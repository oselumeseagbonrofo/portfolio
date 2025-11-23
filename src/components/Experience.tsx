'use client';

import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Award } from 'lucide-react';

const experiences = [
    {
        role: 'Senior Data Scientist',
        company: 'TechCorp AI',
        period: '2022 - Present',
        description: 'Leading the NLP team to build large-scale language models for customer support automation.',
        metrics: [
            { label: 'Automation Rate', value: '+45%', icon: <TrendingUp size={20} /> },
            { label: 'Cost Reduction', value: '$2M/yr', icon: <DollarSign size={20} /> },
        ]
    },
    {
        role: 'Data Scientist',
        company: 'DataFlow Inc.',
        period: '2020 - 2022',
        description: 'Developed predictive maintenance models for manufacturing clients, reducing downtime significantly.',
        metrics: [
            { label: 'Downtime', value: '-30%', icon: <TrendingUp size={20} /> },
            { label: 'Client Retention', value: '98%', icon: <Users size={20} /> },
        ]
    },
    {
        role: 'Junior ML Engineer',
        company: 'StartupX',
        period: '2018 - 2020',
        description: 'Implemented computer vision pipelines for quality control in production lines.',
        metrics: [
            { label: 'Accuracy', value: '99.5%', icon: <Award size={20} /> },
        ]
    }
];

export default function Experience() {
    return (
        <Box sx={{ py: 10, bgcolor: 'background.paper', position: 'relative', overflow: 'hidden' }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Model Evaluation
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Professional experience measured by impact.
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative', maxWidth: '800px', mx: 'auto' }}>
                    {/* Vertical Line */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: { xs: 20, md: '50%' },
                            top: 0,
                            bottom: 0,
                            width: '2px',
                            bgcolor: 'primary.light',
                            opacity: 0.3,
                            transform: { md: 'translateX(-50%)' }
                        }}
                    />

                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                                    alignItems: 'center',
                                    mb: 6,
                                    position: 'relative'
                                }}
                            >
                                {/* Dot */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: { xs: 20, md: '50%' },
                                        width: 16,
                                        height: 16,
                                        bgcolor: 'primary.main',
                                        borderRadius: '50%',
                                        transform: { xs: 'translateX(-50%)', md: 'translateX(-50%)' },
                                        zIndex: 1,
                                        border: '4px solid white'
                                    }}
                                />

                                {/* Content */}
                                <Box sx={{ width: { xs: '100%', md: '50%' }, pl: { xs: 8, md: index % 2 === 0 ? 0 : 8 }, pr: { md: index % 2 === 0 ? 8 : 0 } }}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 4,
                                            textAlign: { xs: 'left', md: index % 2 === 0 ? 'right' : 'left' },
                                            transition: 'all 0.3s',
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(8px)',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                                            }
                                        }}
                                    >
                                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                                            {exp.role}
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {exp.company}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                                            {exp.period}
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            {exp.description}
                                        </Typography>

                                        <Grid container spacing={2} justifyContent={index % 2 === 0 ? 'flex-end' : 'flex-start'}>
                                            {exp.metrics.map((metric, i) => (
                                                <Grid item key={i}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        bgcolor: 'primary.50',
                                                        px: 1.5,
                                                        py: 0.5,
                                                        borderRadius: 2,
                                                        color: 'primary.dark'
                                                    }}>
                                                        {metric.icon}
                                                        <Box>
                                                            <Typography variant="caption" display="block" lineHeight={1}>
                                                                {metric.label}
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight="bold" lineHeight={1}>
                                                                {metric.value}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Paper>
                                </Box>
                            </Box>
                        </motion.div>
                    ))}
                </Box>
            </Container>

            {/* Background Decoration: Metric Grid */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.03, pointerEvents: 'none' }}>
                <svg width="100%" height="100%">
                    <defs>
                        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#smallGrid)" />
                </svg>
            </Box>
        </Box>
    );
}
