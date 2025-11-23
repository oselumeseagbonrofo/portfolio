'use client';

import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Code2, Database, Brain, Layers, Terminal, Cpu } from 'lucide-react';

const features = [
    { name: 'Python', icon: <Code2 size={40} />, category: 'Language' },
    { name: 'TensorFlow', icon: <Brain size={40} />, category: 'Framework' },
    { name: 'PyTorch', icon: <Layers size={40} />, category: 'Framework' },
    { name: 'SQL', icon: <Database size={40} />, category: 'Database' },
    { name: 'Bash', icon: <Terminal size={40} />, category: 'Tooling' },
    { name: 'Scikit-learn', icon: <Cpu size={40} />, category: 'Library' },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export default function TechStack() {
    return (
        <Box sx={{ py: 10, bgcolor: 'background.paper', position: 'relative', overflow: 'hidden' }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Feature Engineering
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        The toolkit I use to extract value from data.
                    </Typography>
                </Box>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <Grid container spacing={4}>
                        {features.map((tech, index) => (
                            <Grid item xs={6} md={4} key={index}>
                                <motion.div variants={item} whileHover={{ scale: 1.05, rotateX: 10, rotateY: 10 }}>
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
                                            transition: 'all 0.3s ease',
                                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(8px)',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                boxShadow: '0 10px 30px -10px rgba(37, 99, 235, 0.2)',
                                                bgcolor: 'background.default'
                                            }
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
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
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
