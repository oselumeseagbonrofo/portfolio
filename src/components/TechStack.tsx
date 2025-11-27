'use client';

import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { Code2, Database, Brain, Layers, Terminal, Cpu } from 'lucide-react';
import { AnimatedCard } from './animations/AnimatedCard';
import { StaggeredGrid } from './animations/StaggeredGrid';
import FloatingShapes, { Shape } from './three/FloatingShapes';
import LazyScene from './three/LazyScene';
import MobileOptimizedScene from './three/MobileOptimizedScene';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

const features = [
    { name: 'Python', icon: <Code2 size={40} />, category: 'Language' },
    { name: 'TensorFlow', icon: <Brain size={40} />, category: 'Framework' },
    { name: 'PyTorch', icon: <Layers size={40} />, category: 'Framework' },
    { name: 'SQL', icon: <Database size={40} />, category: 'Database' },
    { name: 'Bash', icon: <Terminal size={40} />, category: 'Tooling' },
    { name: 'Scikit-learn', icon: <Cpu size={40} />, category: 'Library' },
];

// Define floating shapes for the background
const floatingShapes: Shape[] = [
    {
        geometry: 'box',
        position: [-8, 2, -5],
        rotation: [0.5, 0.5, 0],
        scale: 1.5,
        color: '#3b82f6',
        depth: 0.8,
    },
    {
        geometry: 'sphere',
        position: [8, -3, -8],
        rotation: [0, 0, 0],
        scale: 1.2,
        color: '#8b5cf6',
        depth: 1.2,
    },
    {
        geometry: 'torus',
        position: [-6, -4, -6],
        rotation: [1, 0.5, 0],
        scale: 1,
        color: '#06b6d4',
        depth: 1.0,
    },
    {
        geometry: 'octahedron',
        position: [7, 4, -7],
        rotation: [0.3, 0.8, 0.2],
        scale: 1.3,
        color: '#10b981',
        depth: 0.6,
    },
];

export default function TechStack() {
    const scrollProgress = useScrollProgress();
    const { isMobile } = useDeviceCapabilities();

    return (
        <Box sx={{ py: 10, bgcolor: 'background.paper', position: 'relative', overflow: 'hidden' }}>
            {/* 3D Background with FloatingShapes - Mobile Optimized */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            >
                <MobileOptimizedScene
                    fallback={
                        // Simple animated background for mobile - Requirement 8.3
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
                                animation: 'float 6s ease-in-out infinite',
                                '@keyframes float': {
                                    '0%, 100%': { transform: 'translateY(0px)' },
                                    '50%': { transform: 'translateY(-10px)' },
                                },
                            }}
                        />
                    }
                >
                    <LazyScene threshold={0.1} rootMargin="300px">
                        <Canvas
                            camera={{ position: [0, 0, 10], fov: 50 }}
                            style={{ background: 'transparent' }}
                        >
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} />
                            <FloatingShapes
                                shapes={floatingShapes}
                                scrollProgress={scrollProgress}
                                parallaxStrength={30}
                            />
                        </Canvas>
                    </LazyScene>
                </MobileOptimizedScene>
            </Box>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Feature Engineering
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        The toolkit I use to extract value from data.
                    </Typography>
                </Box>

                {/* StaggeredGrid for card entrance animations - Requirement 4.3 */}
                <StaggeredGrid
                    threshold={0.5}
                    staggerDelay={0.1}
                    direction="up"
                    distance={50}
                >
                    <Grid container spacing={4}>
                        {features.map((tech, index) => (
                            <Grid item xs={6} md={4} key={index}>
                                {/* AnimatedCard for 3D tilt - Requirements 5.1, 5.2 */}
                                <AnimatedCard
                                    tiltEnabled={true}
                                    tiltStrength={10}
                                    hoverScale={1.05}
                                    glowColor="rgba(59, 130, 246, 0.3)"
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 4,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 4,
                                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(8px)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                boxShadow: '0 10px 30px -10px rgba(37, 99, 235, 0.2)',
                                                bgcolor: 'background.default',
                                            },
                                        }}
                                    >
                                        <Box sx={{ color: 'primary.main', mb: 2 }}>
                                            {tech.icon}
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold">
                                            {tech.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {tech.category}
                                        </Typography>
                                    </Paper>
                                </AnimatedCard>
                            </Grid>
                        ))}
                    </Grid>
                </StaggeredGrid>
            </Container>

            {/* Background Decoration */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.05, pointerEvents: 'none' }}>
                <svg width="100%" height="100%">
                    <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </Box>
        </Box>
    );
}
