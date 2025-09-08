import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'neural' | 'data-flow';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'shimmer' | 'neural-pulse' | 'data-stream';
  lines?: number;
}

interface SkeletonCardProps {
  className?: string;
  variant?: 'default' | 'neural' | 'dashboard' | 'message';
  animated?: boolean;
}

// Base Skeleton Component
export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'shimmer',
  lines = 1
}: SkeletonProps) {
  const baseClasses = clsx(
    'relative overflow-hidden',
    variant === 'text' && 'h-4 rounded',
    variant === 'circular' && 'rounded-full',
    variant === 'rectangular' && 'rounded-lg',
    variant === 'neural' && 'rounded-xl border border-neural-200/30',
    variant === 'data-flow' && 'rounded-md border-l-2 border-cyber-400',
    className
  );

  const animationClasses = clsx(
    animation === 'pulse' && 'animate-pulse bg-neutral-200',
    animation === 'wave' && 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-shimmer',
    animation === 'shimmer' && 'bg-gradient-to-r from-neutral-200 via-white to-neutral-200 bg-[length:200%_100%] animate-shimmer',
    animation === 'neural-pulse' && 'bg-gradient-to-r from-neural-100 via-neural-200 to-neural-100 animate-neuralPulse',
    animation === 'data-stream' && 'bg-gradient-to-r from-cyber-100 via-cyber-200 to-cyber-100 animate-dataFlow'
  );

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={clsx(baseClasses, animationClasses)}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={clsx(baseClasses, animationClasses)}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}

// AI-Inspired Loading Spinner
export function AISpinner({ 
  size = 40, 
  className = '',
  variant = 'neural'
}: { 
  size?: number; 
  className?: string;
  variant?: 'neural' | 'cyber' | 'quantum';
}) {
  const colors = {
    neural: 'border-neural-500',
    cyber: 'border-cyber-500', 
    quantum: 'border-quantum-500'
  };

  return (
    <div className={clsx('relative', className)}>
      {/* Outer Ring */}
      <motion.div
        className={clsx(
          'rounded-full border-2 border-transparent',
          `border-t-${variant}-500 border-r-${variant}-300`
        )}
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner Ring */}
      <motion.div
        className={clsx(
          'absolute inset-2 rounded-full border-2 border-transparent',
          `border-b-${variant}-400 border-l-${variant}-200`
        )}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Center Dot */}
      <motion.div
        className={clsx(
          'absolute inset-1/2 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2',
          `bg-${variant}-500`
        )}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
}

// Neural Network Loading Animation
export function NeuralLoader({ className = '' }: { className?: string }) {
  return (
    <div className={clsx('flex items-center justify-center space-x-2', className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-3 h-3 bg-neural-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 20">
        {[0, 1].map((index) => (
          <motion.line
            key={index}
            x1={20 + index * 30}
            y1="10"
            x2={35 + index * 30}
            y2="10"
            stroke="currentColor"
            strokeWidth="1"
            className="text-neural-300"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: index * 0.3 + 0.5,
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Skeleton Card Components
export function SkeletonCard({ 
  className = '', 
  variant = 'default',
  animated = true 
}: SkeletonCardProps) {
  const cardClasses = clsx(
    'p-6 rounded-2xl border',
    variant === 'default' && 'bg-white border-neutral-200',
    variant === 'neural' && 'glass border-neural-200/30',
    variant === 'dashboard' && 'glass border-white/20',
    variant === 'message' && 'bg-neutral-50 border-neutral-100',
    className
  );

  if (variant === 'dashboard') {
    return (
      <motion.div 
        className={cardClasses}
        initial={animated ? { opacity: 0, y: 20 } : false}
        animate={animated ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <Skeleton variant="text" width="40%" height={20} animation="neural-pulse" />
          <Skeleton variant="circular" width={32} height={32} animation="shimmer" />
        </div>
        <Skeleton variant="text" width="60%" height={32} animation="neural-pulse" />
        <div className="mt-4 space-y-2">
          <Skeleton variant="text" lines={2} animation="shimmer" />
        </div>
      </motion.div>
    );
  }

  if (variant === 'message') {
    return (
      <motion.div 
        className={cardClasses}
        initial={animated ? { opacity: 0, x: -20 } : false}
        animate={animated ? { opacity: 1, x: 0 } : false}
        transition={{ duration: 0.4 }}
      >
        <div className="flex space-x-3">
          <Skeleton variant="circular" width={40} height={40} animation="pulse" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="30%" height={16} />
            <Skeleton variant="text" lines={2} animation="wave" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={cardClasses}
      initial={animated ? { opacity: 0, scale: 0.95 } : false}
      animate={animated ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4">
        <Skeleton variant="text" width="70%" height={24} />
        <Skeleton variant="rectangular" width="100%" height={120} />
        <div className="space-y-2">
          <Skeleton variant="text" lines={3} />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton variant="text" width="25%" height={16} />
          <Skeleton variant="rectangular" width={80} height={32} />
        </div>
      </div>
    </motion.div>
  );
}

// Data Loading Animation
export function DataStreamLoader({ className = '' }: { className?: string }) {
  return (
    <div className={clsx('flex flex-col space-y-2', className)}>
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className="h-1 bg-gradient-to-r from-cyber-400 to-cyber-600 rounded-full"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export default Skeleton;
