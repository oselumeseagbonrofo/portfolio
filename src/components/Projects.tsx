'use client';

import { Box, Container, Typography, Grid, Card, CardContent, CardActions, Button, Chip, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Github, ExternalLink, PlayCircle } from 'lucide-react';

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

export default function Projects() {
    return (
        <Box sx={{ py: 10, bgcolor: 'background.default', position: 'relative', overflow: 'hidden' }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Model Architecture
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Selected experiments and deployed models.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {projects.map((project, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
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
                                        transition: 'transform 0.3s ease-in-out',
                                        bgcolor: 'background.paper',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
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
                                                <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'primary.50', color: 'primary.main', fontWeight: 500 }} />
                                            ))}
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{ p: 3, pt: 0 }}>
                                        <Button startIcon={<Github size={18} />} sx={{ mr: 1 }}>
                                            Code
                                        </Button>
                                        <Button startIcon={<ExternalLink size={18} />}>
                                            Demo
                                        </Button>
                                    </CardActions>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Background Decoration: Training Curves */}
            <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', zIndex: 0, opacity: 0.03, pointerEvents: 'none' }}>
                <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,122.7C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </Box>
        </Box>
    );
}
