/**
 * Enhanced Hero component with advanced animations and particle system
 * Requirements: 1.1, 1.4, 1.5
 */

'use client';

import { Suspense, useState, useEffect } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { motion } from 'framer-motion';
import EnhancedParticles, { ParticleConfig } from './three/EnhancedParticles';
import SceneEffects from './three/SceneEffects';
import OptimizedThreeProvider, { useThreePerformance } from './three/OptimizedThreeProvider';
import MobileOptimizedScene from './three/MobileOptimizedScene';
import { ArrowRight } from 'lucide-react';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { animationConfig } from '@/utils/animationConfig';

export default function Hero() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [fps, setFps] = useState(60);
    const deviceCapabilities = useDeviceCapabilities();

    // Set loaded state after component mounts
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Configure particle system based on device capabilities
    const particleConfig: ParticleConfig = {
        count: deviceCapabilities.maxParticles,
        radius: 8,
        mouseInfluence: 0.5,
        idleAnimation: true,
        performanceTier: deviceCapabilities.tier,
    };

    // Handle performance monitoring callback
    const handlePerformanceChange = (currentFps: number) => {
        setFps(currentFps);
    };

    // Staggered text animation variants - Requirement 1.1
    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: animationConfig.durations.slow, // 1.2 seconds
                ease: animationConfig.easings.entrance,
            },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Stagger each child by 0.2s
            },
        },
    };

    // Button animation with delay - Requirement 1.4
    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: animationConfig.durations.medium, // 0.6 seconds
                delay: 0.8, // 0.8 second delay as per requirement
                ease: animationConfig.easings.entrance,
            },
        },
    };

    return (
        <Box sx={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', bgcolor: 'background.default' }}>
            {/* 3D Background with Enhanced Particles - Mobile Optimized */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <MobileOptimizedScene
                    fallback={
                        // Fallback gradient background for mobile - Requirement 8.3
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                                animation: 'pulse 4s ease-in-out infinite',
                                '@keyframes pulse': {
                                    '0%, 100%': { opacity: 0.8 },
                                    '50%': { opacity: 1 },
                                },
                            }}
                        />
                    }
                >
                    <OptimizedThreeProvider
                        onPerformanceChange={handlePerformanceChange}
                        fallback={
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                                }}
                            />
                        }
                    >
                        <Suspense fallback={null}>
                            <EnhancedParticles 
                                config={particleConfig}
                                onPerformanceChange={handlePerformanceChange}
                            />
                            <SceneEffects enabled={deviceCapabilities.enablePostProcessing} />
                        </Suspense>
                    </OptimizedThreeProvider>
                </MobileOptimizedScene>
            </Box>

            {/* Content Overlay with Animations */}
            <Container 
                maxWidth="lg" 
                sx={{ 
                    position: 'relative', 
                    zIndex: 1, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center' 
                }}
            >
                <motion.div
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    variants={staggerContainer}
                    style={{ maxWidth: '600px' }}
                >
                    {/* Hero Title with Staggered Animation */}
                    <motion.div variants={textVariants}>
                        <Typography 
                            variant="h2" 
                            component="h1" 
                            fontWeight="bold" 
                            gutterBottom 
                            sx={{ color: 'text.primary' }}
                        >
                            I am Joe Kolade, <br />
                            <span className="text-primary">Data Scientist</span>
                        </Typography>
                    </motion.div>

                    {/* Subtitle with Staggered Animation */}
                    <motion.div variants={textVariants}>
                        <Typography variant="h5" color="text.secondary" paragraph>
                            Turning raw data into actionable insights.
                            From gathering requirements to processing data, I build the pipelines that power intelligence.
                        </Typography>
                    </motion.div>

                    {/* Buttons with Delayed Animation */}
                    <motion.div variants={buttonVariants}>
                        <Box sx={{ mt: 4 }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                size="large" 
                                endIcon={<ArrowRight />}
                            >
                                View Projects
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                size="large" 
                                sx={{ ml: 2 }}
                            >
                                Contact Me
                            </Button>
                        </Box>
                    </motion.div>
                </motion.div>
            </Container>

            {/* Performance Monitor Display (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: 1,
                        fontSize: '12px',
                        zIndex: 9999,
                    }}
                >
                    FPS: {Math.round(fps)} | Particles: {particleConfig.count} | Tier: {deviceCapabilities.tier}
                </Box>
            )}
        </Box>
    );
}
