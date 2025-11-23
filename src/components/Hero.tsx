'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import DataParticles from './DataParticles';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <Box sx={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', bgcolor: 'background.default' }}>
            {/* 3D Background */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
                    <ambientLight intensity={0.5} />
                    <Suspense fallback={null}>
                        <DataParticles />
                    </Suspense>
                </Canvas>
            </Box>

            {/* Content Overlay */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ maxWidth: '600px' }}>
                    <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom sx={{ color: 'text.primary' }}>
                        I am Joe Kolade, <br />
                        <span className="text-primary">Data Scientist</span>
                    </Typography>
                    <Typography variant="h5" color="text.secondary" paragraph>
                        Turning raw data into actionable insights.
                        From gathering requirements to processing data, I build the pipelines that power intelligence.
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                        <Button variant="contained" color="primary" size="large" endIcon={<ArrowRight />}>
                            View Projects
                        </Button>
                        <Button variant="outlined" color="primary" size="large" sx={{ ml: 2 }}>
                            Contact Me
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
