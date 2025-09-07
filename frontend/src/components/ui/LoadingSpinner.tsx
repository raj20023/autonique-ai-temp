import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import Logo from './Logo';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'logo';
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
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <motion.div
      className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LoadingSpinner variant="logo" size="xl" text={text} />
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
