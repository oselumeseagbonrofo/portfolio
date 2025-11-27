'use client';

import { Box, Container, Typography, Grid, Card, CardContent, CardActions, Button, Chip, LinearProgress } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Github, ExternalLink, PlayCircle } from 'lucide-react';
import { ScrollReveal } from './animations/ScrollReveal';
import { AnimatedCard } from './animations/AnimatedCard';
import DataVisualization from './three/DataVisualization';
import LazyScene from './three/LazyScene';
import MobileOptimizedScene from './three/MobileOptimizedScene';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { animationConfig } from '@/utils/animationConfig';
import * as THREE from 'three';

const projects = [
    {
        title: 'Customer Churn Prediction',
        description: 'End-to-end pipeline to predict customer churn using XGBoost. Features automated retraining and drift detection.',
        tags: ['Python', 'XGBoost', 'FastAPI', 'Docker'],
        accuracy: 94.5,
        status: 'Deployed',
        github: '#',
        demo: '#'
    },
    {
        title: 'Computer Vision for Retail',
        description: 'Real-time object detection system for inventory management using YOLOv8 and OpenCV.',
        tags: ['PyTorch', 'YOLO', 'OpenCV', 'AWS'],
        accuracy: 88.2,
        status: 'Training',
        github: '#',
        demo: '#'
    },
    {
        title: 'NLP Sentiment Analysis',
        description: 'Transformer-based model for analyzing customer feedback sentiment on social media.',
        tags: ['HuggingFace', 'BERT', 'React', 'Flask'],
        accuracy: 91.0,
        status: 'Deployed',
        github: '#',
        demo: '#'
    }
];

/**
 * 3D Flip Card Component for project reveals
 * Requirement 4.4: 3D flip effect for card reveals
 */
const FlipCard = ({ children, index }: { children: React.ReactNode; index: number }) => {
    return (
        <motion.div
            initial={{ 
                opacity: 0,
                rotateY: -90,
                scale: 0.8
            }}
            whileInView={{ 
                opacity: 1,
                rotateY: 0,
                scale: 1
            }}
            transition={{
                duration: animationConfig.durations.medium,
                delay: index * 0.2,
                ease: animationConfig.easings.entrance,
                type: "spring",
                stiffness: 100,
                damping: 15
            }}
            viewport={{ once: true, margin: "-100px" }}
            style={{
                perspective: "1000px",
                transformStyle: "preserve-3d"
            }}
        >
            {children}
        </motion.div>
    );
};

export default function Projects() {
    const scrollProgress = useScrollProgress();
    const { isMobile } = useDeviceCapabilities();

    return (
        <Box sx={{ py: 10, bgcolor: 'background.default', position: 'relative', overflow: 'hidden' }}>
            {/* 3D Background with DataVisualization - Mobile Optimized */}
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
                        // Animated gradient background for mobile - Requirement 8.3
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                background: `
                                    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
                                    radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 40%),
                                    radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)
                                `,
                                animation: 'wave 8s ease-in-out infinite',
                                '@keyframes wave': {
                                    '0%, 100%': { 
                                        transform: 'scale(1) rotate(0deg)',
                                        opacity: 0.6 
                                    },
                                    '50%': { 
                                        transform: 'scale(1.05) rotate(1deg)',
                                        opacity: 0.8 
                                    },
                                },
                            }}
                        />
                    }
                >
                    <LazyScene threshold={0.1} rootMargin="300px">
                        <Canvas
                            camera={{ position: [0, 0, 15], fov: 60 }}
                            style={{ background: 'transparent' }}
                        >
                            <ambientLight intensity={0.4} />
                            <pointLight position={[10, 10, 10]} intensity={0.8} />
                            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
                            
                            {/* Multiple DataVisualization meshes with parallax */}
                            <DataVisualization
                                scrollProgress={scrollProgress}
                                position={[-8, 2, -12]}
                                scale={3}
                                color="#3b82f6"
                                depth={0.8}
                                parallaxStrength={40}
                                rotationSpeed={new THREE.Vector3(Math.PI * 0.5, Math.PI * 0.3, 0)}
                                waveAmplitude={0.3}
                                waveFrequency={1.5}
                            />
                            <DataVisualization
                                scrollProgress={scrollProgress}
                                position={[8, -3, -15]}
                                scale={4}
                                color="#8b5cf6"
                                depth={1.2}
                                parallaxStrength={60}
                                rotationSpeed={new THREE.Vector3(Math.PI * 0.3, Math.PI * 0.7, Math.PI * 0.2)}
                                waveAmplitude={0.4}
                                waveFrequency={2}
                            />
                            <DataVisualization
                                scrollProgress={scrollProgress}
                                position={[0, 4, -10]}
                                scale={2.5}
                                color="#06b6d4"
                                depth={0.6}
                                parallaxStrength={30}
                                rotationSpeed={new THREE.Vector3(Math.PI * 0.8, Math.PI * 0.2, Math.PI * 0.5)}
                                waveAmplitude={0.2}
                                waveFrequency={3}
                            />
                        </Canvas>
                    </LazyScene>
                </MobileOptimizedScene>
            </Box>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Header with ScrollReveal animation */}
                <ScrollReveal threshold={0.3} direction="up" distance={30}>
                    <Box sx={{ mb: 8 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Model Architecture
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Selected experiments and deployed models.
                        </Typography>
                    </Box>
                </ScrollReveal>

                <Grid container spacing={4}>
                    {projects.map((project, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            {/* Wrap with ScrollReveal for entrance animation */}
                            <ScrollReveal 
                                threshold={0.5} 
                                delay={index * 0.1}
                                direction="up"
                                distance={50}
                            >
                                {/* 3D Flip effect for card reveals - Requirement 4.4 */}
                                <FlipCard index={index}>
                                    {/* AnimatedCard for hover effects - Requirement 5.2 */}
                                    <AnimatedCard
                                        tiltEnabled={true}
                                        tiltStrength={8}
                                        hoverScale={1.05}
                                        glowColor="rgba(59, 130, 246, 0.4)"
                                    >
                                        <Card
                                            elevation={0}
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                borderRadius: 4,
                                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                backdropFilter: 'blur(10px)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                                    bgcolor: 'background.paper',
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                                        {project.title}
                                                    </Typography>
                                                    <Chip
                                                        label={project.status}
                                                        color={project.status === 'Deployed' ? 'success' : 'warning'}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Box>

                                                <Typography variant="body1" color="text.secondary" paragraph>
                                                    {project.description}
                                                </Typography>

                                                <Box sx={{ mb: 3 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="caption" color="text.secondary">Model Accuracy</Typography>
                                                        <Typography variant="caption" fontWeight="bold">{project.accuracy}%</Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={project.accuracy}
                                                        sx={{
                                                            height: 6,
                                                            borderRadius: 3,
                                                            bgcolor: 'grey.100',
                                                            '& .MuiLinearProgress-bar': {
                                                                borderRadius: 3,
                                                            }
                                                        }}
                                                    />
                                                </Box>

                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {project.tags.map((tag) => (
                                                        <Chip 
                                                            key={tag} 
                                                            label={tag} 
                                                            size="small" 
                                                            sx={{ 
                                                                bgcolor: 'primary.50', 
                                                                color: 'primary.main', 
                                                                fontWeight: 500,
                                                                '&:hover': {
                                                                    bgcolor: 'primary.100',
                                                                }
                                                            }} 
                                                        />
                                                    ))}
                                                </Box>
                                            </CardContent>
                                            <CardActions sx={{ p: 3, pt: 0 }}>
                                                <Button 
                                                    startIcon={<Github size={18} />} 
                                                    sx={{ 
                                                        mr: 1,
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                        }
                                                    }}
                                                >
                                                    Code
                                                </Button>
                                                <Button 
                                                    startIcon={<ExternalLink size={18} />}
                                                    sx={{
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                        }
                                                    }}
                                                >
                                                    Demo
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </AnimatedCard>
                                </FlipCard>
                            </ScrollReveal>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Enhanced Background Decoration with parallax */}
            <Box 
                sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: 0, 
                    right: 0, 
                    transform: `translateY(calc(-50% + ${scrollProgress * 20}px))`, // Parallax effect
                    zIndex: 0, 
                    opacity: 0.03, 
                    pointerEvents: 'none' 
                }}
            >
                <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,122.7C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </Box>
        </Box>
    );
}
