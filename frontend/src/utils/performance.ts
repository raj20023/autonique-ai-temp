// Performance optimization utilities for animations and UI
import React from 'react';

// Detect user's motion preferences
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Detect device performance capabilities
export const getDevicePerformance = () => {
  if (typeof window === 'undefined') return 'high';
  
  // Check for hardware acceleration
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  // Check memory
  const memory = (navigator as any).deviceMemory || 4;
  
  // Check CPU cores
  const cores = navigator.hardwareConcurrency || 2;
  
  // Determine performance tier
  if (!gl || memory < 2 || cores < 2) {
    return 'low';
  } else if (memory < 4 || cores < 4) {
    return 'medium';
  } else {
    return 'high';
  }
};

// Animation configuration based on performance
export const getAnimationConfig = () => {
  const performance = getDevicePerformance();
  const reducedMotion = prefersReducedMotion();
  
  if (reducedMotion) {
    return {
      duration: 0,
      stiffness: 0,
      damping: 0,
      mass: 0,
      particles: false,
      blur: false,
      shadows: false
    };
  }
  
  switch (performance) {
    case 'low':
      return {
        duration: 0.3,
        stiffness: 200,
        damping: 25,
        mass: 1,
        particles: false,
        blur: false,
        shadows: false
      };
    case 'medium':
      return {
        duration: 0.5,
        stiffness: 300,
        damping: 20,
        mass: 1,
        particles: true,
        blur: true,
        shadows: true
      };
    case 'high':
    default:
      return {
        duration: 0.8,
        stiffness: 400,
        damping: 15,
        mass: 1,
        particles: true,
        blur: true,
        shadows: true
      };
  }
};

// Optimized spring configurations
export const springConfigs = {
  gentle: { stiffness: 120, damping: 14, mass: 1 },
  wobbly: { stiffness: 180, damping: 12, mass: 1 },
  stiff: { stiffness: 400, damping: 30, mass: 1 },
  slow: { stiffness: 280, damping: 60, mass: 1 },
  molasses: { stiffness: 280, damping: 120, mass: 1 }
};

// Easing functions optimized for 60fps
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
  neural: [0.25, 0.46, 0.45, 0.94],
  morphic: [0.34, 1.56, 0.64, 1]
};

// Performance monitoring
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private isMonitoring = false;
  
  start() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.lastTime = performance.now();
    this.measure();
  }
  
  stop() {
    this.isMonitoring = false;
  }
  
  private measure = () => {
    if (!this.isMonitoring) return;
    
    const now = performance.now();
    this.frameCount++;
    
    if (now - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;
      
      // Adjust animation quality based on FPS
      if (this.fps < 30) {
        console.warn('Low FPS detected, consider reducing animation complexity');
      }
    }
    
    requestAnimationFrame(this.measure);
  };
  
  getFPS() {
    return this.fps;
  }
}

// Lazy loading utility for heavy components
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <React.Suspense fallback={fallback ? React.createElement(fallback) : null}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};

// Intersection Observer for performance-aware animations
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options]);
  
  return isIntersecting;
};

// Debounced resize handler
export const useDebounceResize = (callback: () => void, delay = 250) => {
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [callback, delay]);
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    return null;
  }
  
  const memory = (performance as any).memory;
  return {
    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
  };
};

// Optimized animation variants based on performance
export const getOptimizedVariants = () => {
  const config = getAnimationConfig();
  
  return {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: config.duration, ease: easings.easeOut }
    },
    slideUp: {
      initial: { opacity: 0, y: config.particles ? 30 : 10 },
      animate: { opacity: 1, y: 0 },
      transition: { 
        duration: config.duration, 
        ease: easings.easeOut,
        type: "spring",
        stiffness: config.stiffness,
        damping: config.damping
      }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { 
        duration: config.duration, 
        ease: easings.neural,
        type: "spring",
        stiffness: config.stiffness,
        damping: config.damping
      }
    },
    neuralPulse: config.particles ? {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { 
        duration: config.duration * 1.5,
        ease: easings.neural,
        type: "spring",
        stiffness: config.stiffness * 0.7,
        damping: config.damping
      }
    } : {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: config.duration }
    }
  };
};

export default {
  getAnimationConfig,
  getOptimizedVariants,
  springConfigs,
  easings,
  PerformanceMonitor,
  prefersReducedMotion,
  getDevicePerformance
};
