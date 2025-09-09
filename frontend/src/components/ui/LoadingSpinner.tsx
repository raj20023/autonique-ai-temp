import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import Logo from './Logo';
import { AutoLoader } from './AutoMascot';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'logo' | 'neural' | 'cyber' | 'quantum' | 'matrix' | 'auto';
  className?: string;
  text?: string;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
};

export default function LoadingSpinner({
  size = 'md',
  variant = 'spinner',
  className = '',
  text
}: LoadingSpinnerProps) {
  if (variant === 'auto') {
    return (
      <div className={clsx('flex flex-col items-center justify-center space-y-4', className)}>
        <AutoLoader
          expression="working"
          size={size}
        />
        {text && (
          <motion.p
            className={clsx('text-neutral-600 font-medium', textSizes[size])}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'logo') {
    return (
      <div className={clsx('flex flex-col items-center justify-center space-y-4', className)}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Logo variant="icon" size={size} animated />
        </motion.div>
        {text && (
          <motion.p
            className={clsx('text-neutral-600 font-medium', textSizes[size])}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={clsx('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={clsx('bg-orange-500 rounded-full', sizes[size])}
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        {text && (
          <p className={clsx('text-neutral-600 font-medium', textSizes[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={clsx('flex flex-col items-center justify-center space-y-4', className)}>
        <motion.div
          className={clsx('bg-gradient-to-r from-orange-500 to-orange-600 rounded-full', sizes[size])}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {text && (
          <motion.p
            className={clsx('text-neutral-600 font-medium', textSizes[size])}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'neural') {
    return (
      <div className={clsx('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="relative">
          {/* Outer Neural Ring */}
          <motion.div
            className={clsx('border-2 border-transparent rounded-full', sizes[size])}
            style={{
              borderTopColor: '#4facfe',
              borderRightColor: '#7db3ff'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          {/* Inner Neural Ring */}
          <motion.div
            className="absolute inset-2 border-2 border-transparent rounded-full"
            style={{
              borderBottomColor: '#2563eb',
              borderLeftColor: '#b8d4ff'
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          {/* Neural Core */}
          <motion.div
            className="absolute inset-1/2 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ backgroundColor: '#4facfe' }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
        {text && (
          <motion.p
            className={clsx('font-medium', textSizes[size])}
            style={{ color: '#1d4ed8' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'cyber') {
    return (
      <div className={clsx('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="relative">
          {/* Cyber Grid */}
          <motion.div
            className={clsx('border rounded-lg', sizes[size])}
            style={{ borderColor: '#38bdf8' }}
            animate={{
              rotateY: [0, 180, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-1 border rounded-sm" style={{ borderColor: '#7dd3fc' }} />
            <div className="absolute inset-2 rounded-xs opacity-50" style={{ backgroundColor: '#0ea5e9' }} />
          </motion.div>
        </div>
        {text && (
          <motion.p
            className={clsx('font-medium font-mono', textSizes[size])}
            style={{ color: '#0284c7' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'quantum') {
    return (
      <div className={clsx('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="relative">
          {/* Quantum Particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
                backgroundColor: '#c026d3'
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 0.5, 1],
                opacity: [1, 0.3, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            className={clsx('font-medium', textSizes[size])}
            style={{ color: '#a21caf' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'matrix') {
    return (
      <div className={clsx('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full"
              style={{ backgroundColor: '#16a34a' }}
              animate={{
                height: [4, 16, 4],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            className={clsx('font-medium font-mono', textSizes[size])}
            style={{ color: '#15803d' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={clsx('flex flex-col items-center justify-center space-y-4', className)}>
      <motion.div
        className={clsx('border-2 border-neutral-200 border-t-orange-500 rounded-full', sizes[size])}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && (
        <p className={clsx('text-neutral-600 font-medium', textSizes[size])}>
          {text}
        </p>
      )}
    </div>
  );
}

// Full page loading component
export function PageLoader({ text = "Auto is working..." }: { text?: string }) {
  return (
    <motion.div
      className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LoadingSpinner variant="auto" size="xl" text={text} />
    </motion.div>
  );
}

// Skeleton loader for content
export function SkeletonLoader({ 
  lines = 3, 
  className = '' 
}: { 
  lines?: number; 
  className?: string; 
}) {
  return (
    <div className={clsx('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="h-4 bg-neutral-200 rounded-lg"
          style={{ width: `${Math.random() * 40 + 60}%` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}

// Button loading state
export function ButtonLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const spinnerSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <motion.div
      className={clsx('border-2 border-white/30 border-t-white rounded-full', spinnerSizes[size])}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}
