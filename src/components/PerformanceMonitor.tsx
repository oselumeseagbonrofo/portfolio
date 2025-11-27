/**
 * Performance monitoring component for development and debugging
 * Shows real-time FPS, memory usage, and quality settings
 */

'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Chip, IconButton, Collapse } from '@mui/material';
import { Monitor, ChevronDown, ChevronUp } from 'lucide-react';
import { getPerformanceMonitor } from '@/utils/performanceMonitor';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

interface PerformanceMonitorProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  compact?: boolean;
}

export default function PerformanceMonitor({
  show = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  compact = false,
}: PerformanceMonitorProps) {
  const [fps, setFps] = useState(60);
  const [memoryInfo, setMemoryInfo] = useState<{ used: number; total: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState(!compact);
  const deviceCapabilities = useDeviceCapabilities();
  const performanceMonitor = getPerformanceMonitor();

  useEffect(() => {
    if (!show) return;

    const unsubscribe = performanceMonitor.subscribe((newFps) => {
      setFps(newFps);
      
      // Update memory info
      const memory = performanceMonitor.getMemoryInfo();
      setMemoryInfo(memory);
    });

    return () => unsubscribe();
  }, [show, performanceMonitor]);

  if (!show) return null;

  const positionStyles = {
    'top-left': { top: 16, left: 16 },
    'top-right': { top: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 },
  };

  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'success';
    if (fps >= 30) return 'warning';
    return 'error';
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        ...positionStyles[position],
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        borderRadius: 2,
        p: 1,
        minWidth: compact ? 'auto' : 200,
        zIndex: 9999,
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: compact ? 0 : 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Monitor size={16} />
          {!compact && (
            <Typography variant="caption" fontWeight="bold">
              Performance
            </Typography>
          )}
        </Box>
        {compact && (
          <IconButton
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{ color: 'white', p: 0.5 }}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </IconButton>
        )}
      </Box>

      {/* Compact view */}
      {compact && !isExpanded && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${Math.round(fps)} FPS`}
            size="small"
            color={getFpsColor(fps) as any}
            variant="outlined"
          />
          <Chip
            label={deviceCapabilities.tier.toUpperCase()}
            size="small"
            color={getTierColor(deviceCapabilities.tier) as any}
            variant="outlined"
          />
        </Box>
      )}

      {/* Expanded view */}
      <Collapse in={!compact || isExpanded}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* FPS */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">FPS:</Typography>
            <Chip
              label={Math.round(fps)}
              size="small"
              color={getFpsColor(fps) as any}
              variant="outlined"
            />
          </Box>

          {/* Performance Tier */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">Tier:</Typography>
            <Chip
              label={deviceCapabilities.tier.toUpperCase()}
              size="small"
              color={getTierColor(deviceCapabilities.tier) as any}
              variant="outlined"
            />
          </Box>

          {/* Particle Count */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">Particles:</Typography>
            <Typography variant="caption" fontWeight="bold">
              {deviceCapabilities.maxParticles}
            </Typography>
          </Box>

          {/* Device Type */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">Device:</Typography>
            <Chip
              label={deviceCapabilities.isMobile ? 'Mobile' : 'Desktop'}
              size="small"
              color={deviceCapabilities.isMobile ? 'warning' : 'success'}
              variant="outlined"
            />
          </Box>

          {/* Memory Usage */}
          {memoryInfo && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption">Memory:</Typography>
              <Typography variant="caption" fontWeight="bold">
                {Math.round(memoryInfo.used)}MB
              </Typography>
            </Box>
          )}

          {/* WebGL Support */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">WebGL2:</Typography>
            <Chip
              label={deviceCapabilities.supportsWebGL2 ? 'Yes' : 'No'}
              size="small"
              color={deviceCapabilities.supportsWebGL2 ? 'success' : 'error'}
              variant="outlined"
            />
          </Box>

          {/* Post-processing */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">Effects:</Typography>
            <Chip
              label={deviceCapabilities.enablePostProcessing ? 'On' : 'Off'}
              size="small"
              color={deviceCapabilities.enablePostProcessing ? 'success' : 'default'}
              variant="outlined"
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

/**
 * Simple FPS counter for minimal overhead monitoring
 */
export function SimpleFPSCounter({ show = true }: { show?: boolean }) {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    if (!show) return;

    const performanceMonitor = getPerformanceMonitor();
    const unsubscribe = performanceMonitor.subscribe(setFps);

    return () => unsubscribe();
  }, [show]);

  if (!show) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        left: 16,
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        px: 2,
        py: 1,
        borderRadius: 1,
        fontSize: '14px',
        fontFamily: 'monospace',
        zIndex: 9999,
      }}
    >
      {Math.round(fps)} FPS
    </Box>
  );
}