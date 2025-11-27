'use client';

import { Box, Container, Typography, Grid, Card, CardContent, CardActionArea, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const posts = [
    {
        id: 1,
        title: 'Deploying ML Models with Docker and Kubernetes',
        excerpt: 'A comprehensive guide to containerizing your machine learning applications and orchestrating them for scale.',
        date: 'Nov 15, 2023',
        readTime: '8 min read',
        category: 'DevOps',
        slug: 'deploying-ml-models'
    },
    {
        id: 2,
        title: 'Understanding Attention Mechanisms in Transformers',
        excerpt: 'Deep dive into the mathematics and intuition behind the self-attention mechanism that powers modern LLMs.',
        date: 'Oct 28, 2023',
        readTime: '12 min read',
        category: 'Deep Learning',
        slug: 'attention-mechanisms'
    },
    {
        id: 3,
        title: 'Feature Engineering for Time Series Data',
        excerpt: 'Techniques and strategies for extracting meaningful features from temporal data to improve model performance.',
        date: 'Sep 10, 2023',
        readTime: '10 min read',
        category: 'Data Science',
        slug: 'time-series-features'
    }
];

export default function Blog() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 12 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 10, textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography variant="h2" fontWeight="bold" gutterBottom>
                            Deployment & Insights
                        </Typography>
                        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                            Production-ready thoughts on machine learning, engineering, and data strategy.
                        </Typography>
                    </motion.div>
                </Box>

                <Grid container spacing={4}>
                    {posts.map((post, index) => (
                        <Grid xs={12} md={4} key={post.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
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
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
                                            borderColor: 'primary.main'
                                        }
                                    }}
                                >
                                    <CardActionArea sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Chip label={post.category} size="small" sx={{ bgcolor: 'primary.50', color: 'primary.main', fontWeight: 600 }} />
                                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: '0.875rem' }}>
                                                <Clock size={14} style={{ marginRight: 4 }} />
                                                {post.readTime}
                                            </Box>
                                        </Box>

                                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2, lineHeight: 1.3 }}>
                                            {post.title}
                                        </Typography>

                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                                            {post.excerpt}
                                        </Typography>

                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: '0.875rem' }}>
                                                <Calendar size={14} style={{ marginRight: 4 }} />
                                                {post.date}
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', fontWeight: 600 }}>
                                                Read Article <ArrowRight size={16} style={{ marginLeft: 4 }} />
                                            </Box>
                                        </Box>
                                    </CardActionArea>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
