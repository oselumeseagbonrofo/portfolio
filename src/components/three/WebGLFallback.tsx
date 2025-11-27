/**
 * Fallback component for browsers without WebGL2 support
 * Provides CSS-based animations as alternatives to 3D effects
 */

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { checkWebGL2Support, checkWebGLSupport } from '@/utils/webglRecovery';

interface WebGLFallbackProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireWebGL2?: boolean;
}

/**
 * Component that renders children only if WebGL is supported,
 * otherwise shows a fallback with CSS animations
 */
export default function WebGLFallback({
  children,
  fallback,
  requireWebGL2 = false,
}: WebGLFallbackProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const supported = requireWebGL2 ? checkWebGL2Support() : checkWebGLSupport();
    setWebglSupported(supported);
  }, [requireWebGL2]);

  // Show loading state while checking support
  if (webglSupported === null) {
    return <div className="animate-pulse bg-gray-800 rounded-lg h-64" />;
  }

  // Show fallback if WebGL is not supported
  if (!webglSupported) {
    return fallback || <DefaultWebGLFallback />;
  }

  // Render 3D content if WebGL is supported
  return <>{children}</>;
}

/**
 * Default fallback component with CSS animations
 */
function DefaultWebGLFallback() {
  return (
    <div className="relative min-h-[400px] bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg overflow-hidden">
      {/* Animated background particles using CSS */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
            }}
            animate={{
              x: [
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
              ],
              y: [
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
              ],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute border border-blue-400/20 rounded-lg"
            style={{
              width: 40 + Math.random() * 60,
              height: 40 + Math.random() * 60,
              left: Math.random() * 80 + '%',
              top: Math.random() * 80 + '%',
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Central content area */}
      <div className="relative z-10 flex items-center justify-center h-full p-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Enhanced Experience Available
            </h3>
            <p className="text-gray-300 text-sm max-w-md">
              For the full 3D experience, please use a modern browser with WebGL support.
              You're currently seeing our optimized fallback version.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/**
 * Particle system fallback using CSS animations
 */
export function ParticleFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

/**
 * 3D background fallback using CSS transforms
 */
export function Background3DFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-purple-400/10 rounded-lg"
          style={{
            width: 100 + Math.random() * 200,
            height: 100 + Math.random() * 200,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
            z: [0, 100, 0],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            transformStyle: 'preserve-3d',
          }}
        />
      ))}
    </div>
  );
}