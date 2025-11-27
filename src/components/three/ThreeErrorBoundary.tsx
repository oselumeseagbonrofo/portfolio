/**
 * Error boundary specifically for Three.js components
 * Provides fallback UI when 3D rendering fails
 */

'use client';

import React, { Component, ReactNode } from 'react';
import { checkWebGLSupport } from '@/utils/webglRecovery';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ThreeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Three.js Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log additional context for Three.js errors
    this.logThreeJSContext(error);
  }

  private logThreeJSContext(error: Error) {
    const webglSupport = checkWebGLSupport();
    const userAgent = navigator.userAgent;
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    console.error('Three.js Error Context:', {
      error: error.message,
      stack: error.stack,
      webglSupport,
      userAgent,
      viewport,
      timestamp: new Date().toISOString(),
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg">
          <div className="text-center p-8">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              3D Visualization Unavailable
            </h3>
            <p className="text-gray-300 mb-4">
              The 3D graphics could not be loaded. This might be due to:
            </p>
            <ul className="text-sm text-gray-400 text-left max-w-md mx-auto space-y-1">
              <li>• WebGL not supported by your browser</li>
              <li>• Graphics drivers need updating</li>
              <li>• Hardware acceleration is disabled</li>
              <li>• Insufficient graphics memory</li>
            </ul>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook version of the error boundary for functional components
 */
export function useThreeErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error('Three.js error caught by hook:', error);
    setError(error);
  }, []);

  return {
    error,
    resetError,
    handleError,
  };
}

/**
 * Higher-order component to wrap components with Three.js error boundary
 */
export function withThreeErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ThreeErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ThreeErrorBoundary>
  );

  WrappedComponent.displayName = `withThreeErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export default ThreeErrorBoundary;