'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Database, Settings, Brain, BarChart, Rocket } from 'lucide-react';
import { Box, Tooltip, Typography } from '@mui/material';

const stages = [
    { id: 'hero', label: 'Data Collection', icon: <Database size={18} /> },
    { id: 'tech-stack', label: 'Feature Engineering', icon: <Settings size={18} /> },
    { id: 'projects', label: 'Model Training', icon: <Brain size={18} /> },
    { id: 'experience', label: 'Evaluation', icon: <BarChart size={18} /> },
    { id: 'blog', label: 'Deployment', icon: <Rocket size={18} /> },
];

export default function PipelineProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [activeStage, setActiveStage] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            // Simple scroll-based stage detection (approximate)
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            const totalHeight = document.body.scrollHeight;
            const progress = scrollPosition / totalHeight;

            // Map progress to 5 stages
            const current = Math.min(Math.floor(progress * 5), 4);
            setActiveStage(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
            <motion.div
                style={{ scaleX, transformOrigin: '0%' }}
                className="h-1 bg-blue-600"
            />

            <Box sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                gap: 2,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                    ML Pipeline Status
                </Typography>
                {stages.map((stage, index) => (
                    <Box
                        key={stage.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            opacity: index === activeStage ? 1 : 0.4,
                            transition: 'opacity 0.3s'
                        }}
                    >
                        <Box sx={{
                            color: index === activeStage ? 'primary.main' : 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {stage.icon}
                        </Box>
                        <Typography
                            variant="body2"
                            fontWeight={index === activeStage ? 'bold' : 'medium'}
                            color={index === activeStage ? 'text.primary' : 'text.secondary'}
                        >
                            {stage.label}
                        </Typography>
                        {index === activeStage && (
                            <motion.div
                                layoutId="active-indicator"
                                className="w-1.5 h-1.5 rounded-full bg-green-500 ml-auto"
                            />
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
