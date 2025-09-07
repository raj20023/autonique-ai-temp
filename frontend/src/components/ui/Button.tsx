import { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  animated?: boolean;
}

const variants = {
  primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 hover:border-neutral-400',
  outline: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700',
  ghost: 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
  danger: 'bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 text-white shadow-lg hover:shadow-xl'
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
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = clsx(
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
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

  return (
    <motion.button
      className={baseClasses}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
}

// Floating Action Button variant
export function FloatingButton({
  children,
  className = '',
  ...props
}: Omit<ButtonProps, 'variant' | 'size'>) {
  return (
    <motion.button
      className={clsx(
        'fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-50',
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      {...props}
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
