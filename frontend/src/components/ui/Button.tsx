import { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'neural' | 'glass' | 'ai';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  animated?: boolean;
  shimmer?: boolean;
  glow?: boolean;
}

const variants = {
  primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl relative overflow-hidden',
  secondary: 'bg-white/80 backdrop-blur-xl hover:bg-white/90 text-neutral-900 border border-neutral-200/50 hover:border-neutral-300/50 shadow-sm hover:shadow-md',
  outline: 'bg-transparent hover:bg-orange-50/50 text-orange-600 border-2 border-orange-500/50 hover:border-orange-600/50 backdrop-blur-sm',
  ghost: 'bg-transparent hover:bg-neutral-100/50 text-neutral-600 hover:text-neutral-900 backdrop-blur-sm',
  danger: 'bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 text-white shadow-lg hover:shadow-xl relative overflow-hidden',
  neural: 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white shadow-neural hover:shadow-ai relative overflow-hidden',
  glass: 'glass hover:bg-white/20 text-neutral-900 hover:text-neutral-800 shadow-glass border border-white/20 hover:border-white/30',
  ai: 'bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 text-white shadow-ai hover:shadow-neural relative overflow-hidden'
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
};

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-7 w-7'
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  animated = true,
  shimmer = false,
  glow = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = clsx(
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    shimmer && 'bg-gradient-to-r bg-[length:200%_100%] animate-shimmer',
    glow && 'animate-glow',
    className
  );

  const buttonContent = (
    <>
      {loading && (
        <Loader2 className={clsx(iconSizes[size], 'animate-spin', children && 'mr-2')} />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className={clsx(iconSizes[size], children && 'mr-2')}>
          {icon}
        </span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className={clsx(iconSizes[size], children && 'ml-2')}>
          {icon}
        </span>
      )}
    </>
  );

  if (!animated) {
    return (
      <button
        className={baseClasses}
        disabled={disabled || loading}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }

  const motionProps = {
    whileHover: {
      scale: 1.02,
      y: -2,
      boxShadow: variant === 'neural' || variant === 'ai'
        ? "0 10px 25px rgba(79, 172, 254, 0.3)"
        : "0 10px 25px rgba(0, 0, 0, 0.15)"
    },
    whileTap: { scale: 0.98, y: 0 },
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 17
    }
  };

  return (
    <motion.button
      className={baseClasses}
      disabled={disabled || loading}
      {...motionProps}
      {...(props as any)}
    >
      {shimmer && (
        <div className="absolute inset-0 -top-[2px] -bottom-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      )}
      <span className="relative z-10">
        {buttonContent}
      </span>
    </motion.button>
  );
}

// Floating Action Button variant
export function FloatingButton({
  children,
  className = '',
  ...props
}: Omit<ButtonProps, 'variant' | 'size'>) {
  const motionProps = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 17
    }
  };

  return (
    <motion.button
      className={clsx(
        'fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-50',
        className
      )}
      {...motionProps}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

// Button group for related actions
export function ButtonGroup({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex space-x-3', className)}>
      {children}
    </div>
  );
}
