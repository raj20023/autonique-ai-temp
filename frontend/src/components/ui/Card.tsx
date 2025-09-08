import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'neural' | 'cyber' | 'quantum' | 'floating';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  animated?: boolean;
  onClick?: () => void;
  glow?: boolean;
  pulse?: boolean;
}

const variants = {
  default: 'bg-white border border-neutral-200 shadow-sm',
  elevated: 'bg-white shadow-lg border border-neutral-100',
  outlined: 'bg-white border-2 border-neutral-300',
  glass: 'glass shadow-glass border border-white/20',
  neural: 'glass shadow-neural border border-neural-200/30 relative overflow-hidden',
  cyber: 'glass shadow-ai border border-cyber-200/30 relative overflow-hidden',
  quantum: 'glass shadow-morphic border border-quantum-200/30 relative overflow-hidden',
  floating: 'glass shadow-levitate border border-white/10 relative'
};

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10'
};

const hoverEffects = {
  default: 'hover:shadow-md hover:border-neutral-300',
  elevated: 'hover:shadow-xl hover:-translate-y-1',
  outlined: 'hover:border-orange-300 hover:shadow-sm',
  glass: 'hover:bg-white/90 hover:shadow-2xl',
  neural: 'hover:shadow-neural hover:border-neural-300/50 hover:-translate-y-2 hover:scale-[1.02]',
  cyber: 'hover:shadow-ai hover:border-cyber-300/50 hover:-translate-y-2 hover:scale-[1.02]',
  quantum: 'hover:shadow-morphic hover:border-quantum-300/50 hover:-translate-y-2 hover:scale-[1.02]',
  floating: 'hover:shadow-levitate hover:-translate-y-4 hover:scale-[1.01]'
};

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  animated = true,
  onClick,
  glow = false,
  pulse = false
}: CardProps) {
  const baseClasses = clsx(
    'rounded-2xl transition-all duration-300',
    variants[variant],
    paddings[padding],
    hover && hoverEffects[variant],
    onClick && 'cursor-pointer',
    glow && 'glow-ai',
    pulse && 'animate-neuralPulse',
    className
  );

  if (!animated) {
    return (
      <div className={baseClasses} onClick={onClick}>
        {children}
      </div>
    );
  }

  const getAnimationProps = () => {
    const baseProps = {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.3 },
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    };

    if (variant === 'neural' || variant === 'cyber' || variant === 'quantum') {
      baseProps.initial = { opacity: 0, scale: 0.9, rotateX: -10 };
      baseProps.whileInView = { opacity: 1, scale: 1, rotateX: 0 };
      baseProps.transition = {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1],
        type: "spring",
        stiffness: 100,
        damping: 20
      };
    }

    if (variant === 'floating') {
      baseProps.initial = { opacity: 0, y: 30, rotateY: -15 };
      baseProps.whileInView = { opacity: 1, y: 0, rotateY: 0 };
      baseProps.transition = {
        duration: 1.0,
        ease: [0.175, 0.885, 0.32, 1.275],
        type: "spring",
        stiffness: 120,
        damping: 25
      };
    }

    return baseProps;
  };

  return (
    <motion.div
      className={baseClasses}
      onClick={onClick}
      {...getAnimationProps()}
      whileHover={hover ? {
        scale: variant === 'floating' ? 1.01 : 1.02,
        y: variant === 'floating' ? -4 : -2,
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
      } : undefined}
      whileTap={onClick ? { scale: 0.98, y: 0 } : undefined}
    >
      {/* AI Accent Lines for Neural Variants */}
      {(variant === 'neural' || variant === 'cyber' || variant === 'quantum') && (
        <>
          <div className={clsx(
            "absolute top-0 left-0 w-full h-0.5 rounded-t-2xl",
            variant === 'neural' && "bg-gradient-to-r from-neural-400 to-neural-600",
            variant === 'cyber' && "bg-gradient-to-r from-cyber-400 to-cyber-600",
            variant === 'quantum' && "bg-gradient-to-r from-quantum-400 to-quantum-600"
          )} />
          <div className={clsx(
            "absolute top-0 left-0 w-0.5 h-full rounded-l-2xl",
            variant === 'neural' && "bg-gradient-to-b from-neural-400 to-neural-600",
            variant === 'cyber' && "bg-gradient-to-b from-cyber-400 to-cyber-600",
            variant === 'quantum' && "bg-gradient-to-b from-quantum-400 to-quantum-600"
          )} />
        </>
      )}

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// Card Header component
export function CardHeader({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('border-b border-neutral-200 pb-4 mb-6', className)}>
      {children}
    </div>
  );
}

// Card Title component
export function CardTitle({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={clsx('text-xl font-semibold text-neutral-900', className)}>
      {children}
    </h3>
  );
}

// Card Description component
export function CardDescription({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={clsx('text-neutral-600 mt-2', className)}>
      {children}
    </p>
  );
}

// Card Content component
export function CardContent({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

// Card Footer component
export function CardFooter({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('border-t border-neutral-200 pt-4 mt-6', className)}>
      {children}
    </div>
  );
}

// Feature Card for landing page
export function FeatureCard({
  icon,
  title,
  description,
  className = ''
}: {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <Card variant="elevated" hover animated className={className}>
      <div className="text-center">
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg"
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2 }
          }}
        >
          <div className="text-white">
            {icon}
          </div>
        </motion.div>
        <CardTitle className="mb-3">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </Card>
  );
}

// Stats Card for dashboard
export function StatsCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  className = ''
}: {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  className?: string;
}) {
  const changeColors = {
    positive: 'text-success-600 bg-success-50',
    negative: 'text-error-600 bg-error-50',
    neutral: 'text-neutral-600 bg-neutral-50'
  };

  return (
    <Card variant="elevated" className={className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-2">{value}</p>
          {change && (
            <p className={clsx(
              'text-sm font-medium mt-2 px-2 py-1 rounded-full inline-block',
              changeColors[changeType]
            )}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-orange-500">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
