import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'responsive';
  animated?: boolean;
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn';
  breakpoint?: 'mobile' | 'tablet' | 'desktop' | 'all';
}

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

interface ResponsiveStackProps {
  children: ReactNode;
  className?: string;
  direction?: {
    default?: 'row' | 'col';
    sm?: 'row' | 'col';
    md?: 'row' | 'col';
    lg?: 'row' | 'col';
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

const maxWidths = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full'
};

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
  responsive: 'p-4 sm:p-6 md:p-8 lg:p-12'
};

const gaps = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8'
};

// Main responsive container component
export function ResponsiveContainer({
  children,
  className = '',
  maxWidth = '7xl',
  padding = 'responsive',
  animated = false,
  animation = 'fadeIn',
  breakpoint = 'all'
}: ResponsiveContainerProps) {
  const containerClasses = clsx(
    'mx-auto w-full',
    maxWidths[maxWidth],
    paddings[padding],
    // Responsive visibility
    breakpoint === 'mobile' && 'block sm:hidden',
    breakpoint === 'tablet' && 'hidden sm:block lg:hidden',
    breakpoint === 'desktop' && 'hidden lg:block',
    className
  );

  const animationProps = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6 }
    },
    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
    }
  };

  if (animated) {
    return (
      <motion.div
        className={containerClasses}
        {...animationProps[animation]}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}

// Responsive grid component
export function ResponsiveGrid({
  children,
  className = '',
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md',
  animated = false
}: ResponsiveGridProps) {
  const gridClasses = clsx(
    'grid',
    // Default columns
    cols.default === 1 && 'grid-cols-1',
    cols.default === 2 && 'grid-cols-2',
    cols.default === 3 && 'grid-cols-3',
    cols.default === 4 && 'grid-cols-4',
    // Small breakpoint
    cols.sm === 1 && 'sm:grid-cols-1',
    cols.sm === 2 && 'sm:grid-cols-2',
    cols.sm === 3 && 'sm:grid-cols-3',
    cols.sm === 4 && 'sm:grid-cols-4',
    // Medium breakpoint
    cols.md === 1 && 'md:grid-cols-1',
    cols.md === 2 && 'md:grid-cols-2',
    cols.md === 3 && 'md:grid-cols-3',
    cols.md === 4 && 'md:grid-cols-4',
    // Large breakpoint
    cols.lg === 1 && 'lg:grid-cols-1',
    cols.lg === 2 && 'lg:grid-cols-2',
    cols.lg === 3 && 'lg:grid-cols-3',
    cols.lg === 4 && 'lg:grid-cols-4',
    cols.lg === 5 && 'lg:grid-cols-5',
    cols.lg === 6 && 'lg:grid-cols-6',
    // Extra large breakpoint
    cols.xl === 1 && 'xl:grid-cols-1',
    cols.xl === 2 && 'xl:grid-cols-2',
    cols.xl === 3 && 'xl:grid-cols-3',
    cols.xl === 4 && 'xl:grid-cols-4',
    cols.xl === 5 && 'xl:grid-cols-5',
    cols.xl === 6 && 'xl:grid-cols-6',
    gaps[gap],
    className
  );

  if (animated) {
    return (
      <motion.div
        className={gridClasses}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, staggerChildren: 0.1 }}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

// Responsive stack/flex component
export function ResponsiveStack({
  children,
  className = '',
  direction = { default: 'col', md: 'row' },
  gap = 'md',
  align = 'start',
  justify = 'start'
}: ResponsiveStackProps) {
  const stackClasses = clsx(
    'flex',
    // Direction
    direction.default === 'row' ? 'flex-row' : 'flex-col',
    direction.sm === 'row' && 'sm:flex-row',
    direction.sm === 'col' && 'sm:flex-col',
    direction.md === 'row' && 'md:flex-row',
    direction.md === 'col' && 'md:flex-col',
    direction.lg === 'row' && 'lg:flex-row',
    direction.lg === 'col' && 'lg:flex-col',
    // Gap
    gap === 'sm' && (direction.default === 'row' ? 'space-x-2' : 'space-y-2'),
    gap === 'md' && (direction.default === 'row' ? 'space-x-4' : 'space-y-4'),
    gap === 'lg' && (direction.default === 'row' ? 'space-x-6' : 'space-y-6'),
    gap === 'xl' && (direction.default === 'row' ? 'space-x-8' : 'space-y-8'),
    // Responsive gap adjustments
    direction.md === 'row' && gap === 'md' && 'md:space-y-0 md:space-x-4',
    direction.md === 'col' && gap === 'md' && 'md:space-x-0 md:space-y-4',
    // Alignment
    align === 'start' && 'items-start',
    align === 'center' && 'items-center',
    align === 'end' && 'items-end',
    align === 'stretch' && 'items-stretch',
    // Justification
    justify === 'start' && 'justify-start',
    justify === 'center' && 'justify-center',
    justify === 'end' && 'justify-end',
    justify === 'between' && 'justify-between',
    justify === 'around' && 'justify-around',
    justify === 'evenly' && 'justify-evenly',
    className
  );

  return (
    <div className={stackClasses}>
      {children}
    </div>
  );
}

// Responsive text component
export function ResponsiveText({
  children,
  className = '',
  size = { default: 'base', md: 'lg', lg: 'xl' },
  weight = 'normal',
  align = { default: 'left', md: 'center' }
}: {
  children: ReactNode;
  className?: string;
  size?: {
    default?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    sm?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    md?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    lg?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  };
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: {
    default?: 'left' | 'center' | 'right';
    sm?: 'left' | 'center' | 'right';
    md?: 'left' | 'center' | 'right';
    lg?: 'left' | 'center' | 'right';
  };
}) {
  const textClasses = clsx(
    // Default size
    `text-${size.default}`,
    // Responsive sizes
    size.sm && `sm:text-${size.sm}`,
    size.md && `md:text-${size.md}`,
    size.lg && `lg:text-${size.lg}`,
    // Weight
    `font-${weight}`,
    // Alignment
    align.default === 'left' && 'text-left',
    align.default === 'center' && 'text-center',
    align.default === 'right' && 'text-right',
    align.sm === 'left' && 'sm:text-left',
    align.sm === 'center' && 'sm:text-center',
    align.sm === 'right' && 'sm:text-right',
    align.md === 'left' && 'md:text-left',
    align.md === 'center' && 'md:text-center',
    align.md === 'right' && 'md:text-right',
    align.lg === 'left' && 'lg:text-left',
    align.lg === 'center' && 'lg:text-center',
    align.lg === 'right' && 'lg:text-right',
    className
  );

  return (
    <div className={textClasses}>
      {children}
    </div>
  );
}

export default ResponsiveContainer;
