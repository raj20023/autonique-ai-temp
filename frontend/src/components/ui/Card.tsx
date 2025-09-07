import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  animated?: boolean;
  onClick?: () => void;
}

const variants = {
  default: 'bg-white border border-neutral-200 shadow-sm',
  elevated: 'bg-white shadow-lg border border-neutral-100',
  outlined: 'bg-white border-2 border-neutral-300',
  glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-xl'
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
  glass: 'hover:bg-white/90 hover:shadow-2xl'
};

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  animated = true,
  onClick
}: CardProps) {
  const baseClasses = clsx(
    'rounded-2xl transition-all duration-200',
    variants[variant],
    paddings[padding],
    hover && hoverEffects[variant],
    onClick && 'cursor-pointer',
    className
  );

  if (!animated) {
    return (
      <div className={baseClasses} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={hover ? { 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
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
