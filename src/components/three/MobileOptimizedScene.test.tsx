/**
 * Tests for MobileOptimizedScene component
 * Verifies mobile optimization behavior
 */

import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import MobileOptimizedScene, { useShould3DRender } from './MobileOptimizedScene';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

// Mock the device capabilities hook
vi.mock('@/hooks/useDeviceCapabilities');

const mockUseDeviceCapabilities = vi.mocked(useDeviceCapabilities);

describe('MobileOptimizedScene', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render 3D content on desktop high-tier devices', () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: false,
      tier: 'high',
      supportsWebGL2: true,
      maxParticles: 2000,
      enablePostProcessing: true,
    });

    render(
      <MobileOptimizedScene fallback={<div>Fallback</div>}>
        <div>3D Content</div>
      </MobileOptimizedScene>
    );

    expect(screen.getByText('3D Content')).toBeInTheDocument();
    expect(screen.queryByText('Fallback')).not.toBeInTheDocument();
  });

  it('should render fallback on mobile devices - Requirement 8.3', () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: true,
      tier: 'medium',
      supportsWebGL2: true,
      maxParticles: 300,
      enablePostProcessing: false,
    });

    render(
      <MobileOptimizedScene fallback={<div>Fallback</div>}>
        <div>3D Content</div>
      </MobileOptimizedScene>
    );

    expect(screen.getByText('Fallback')).toBeInTheDocument();
    expect(screen.queryByText('3D Content')).not.toBeInTheDocument();
  });

  it('should render simplified version when provided for mobile', () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: true,
      tier: 'high',
      supportsWebGL2: true,
      maxParticles: 500,
      enablePostProcessing: false,
    });

    render(
      <MobileOptimizedScene 
        fallback={<div>Fallback</div>}
        simplifiedVersion={<div>Simplified</div>}
      >
        <div>3D Content</div>
      </MobileOptimizedScene>
    );

    expect(screen.getByText('Simplified')).toBeInTheDocument();
    expect(screen.queryByText('3D Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Fallback')).not.toBeInTheDocument();
  });

  it('should render fallback on low-tier desktop devices', () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: false,
      tier: 'low',
      supportsWebGL2: true,
      maxParticles: 500,
      enablePostProcessing: false,
    });

    render(
      <MobileOptimizedScene fallback={<div>Fallback</div>}>
        <div>3D Content</div>
      </MobileOptimizedScene>
    );

    expect(screen.getByText('Fallback')).toBeInTheDocument();
    expect(screen.queryByText('3D Content')).not.toBeInTheDocument();
  });

  it('should force hide when forceHide is true', () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: false,
      tier: 'high',
      supportsWebGL2: true,
      maxParticles: 2000,
      enablePostProcessing: true,
    });

    render(
      <MobileOptimizedScene forceHide fallback={<div>Fallback</div>}>
        <div>3D Content</div>
      </MobileOptimizedScene>
    );

    expect(screen.getByText('Fallback')).toBeInTheDocument();
    expect(screen.queryByText('3D Content')).not.toBeInTheDocument();
  });
});

describe('useShould3DRender', () => {
  it('should return correct values for mobile device', () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: true,
      tier: 'medium',
      supportsWebGL2: true,
      maxParticles: 300,
      enablePostProcessing: false,
    });

    const TestComponent = () => {
      const { shouldRender, shouldSimplify, isMobile, tier } = useShould3DRender();
      return (
        <div>
          <span data-testid="shouldRender">{shouldRender.toString()}</span>
          <span data-testid="shouldSimplify">{shouldSimplify.toString()}</span>
          <span data-testid="isMobile">{isMobile.toString()}</span>
          <span data-testid="tier">{tier}</span>
        </div>
      );
    };

    render(<TestComponent />);

    expect(screen.getByTestId('shouldRender')).toHaveTextContent('false');
    expect(screen.getByTestId('shouldSimplify')).toHaveTextContent('true');
    expect(screen.getByTestId('isMobile')).toHaveTextContent('true');
    expect(screen.getByTestId('tier')).toHaveTextContent('medium');
  });

  it('should return correct values for high-tier desktop', () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: false,
      tier: 'high',
      supportsWebGL2: true,
      maxParticles: 2000,
      enablePostProcessing: true,
    });

    const TestComponent = () => {
      const { shouldRender, shouldSimplify, isMobile, tier } = useShould3DRender();
      return (
        <div>
          <span data-testid="shouldRender">{shouldRender.toString()}</span>
          <span data-testid="shouldSimplify">{shouldSimplify.toString()}</span>
          <span data-testid="isMobile">{isMobile.toString()}</span>
          <span data-testid="tier">{tier}</span>
        </div>
      );
    };

    render(<TestComponent />);

    expect(screen.getByTestId('shouldRender')).toHaveTextContent('true');
    expect(screen.getByTestId('shouldSimplify')).toHaveTextContent('false');
    expect(screen.getByTestId('isMobile')).toHaveTextContent('false');
    expect(screen.getByTestId('tier')).toHaveTextContent('high');
  });
});