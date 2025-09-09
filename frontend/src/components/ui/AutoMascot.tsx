import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export type AutoExpression = 
  | 'hello'      // Saying hello to everyone, best for home screen
  | 'happy'      // Happy auto
  | 'excited'    // Excited and welcome auto
  | 'curious'    // Auto is curious about something
  | 'working'    // Auto is working/processing
  | 'sleepy'     // Auto is sleepy/loading
  | 'shocked'    // Auto is shocked/surprised
  | 'error'      // Got some error in the website
  | 'faq'        // Auto for the FAQ screen
  | 'normal'     // Default neutral expression
  | 'favicon';   // Only head of auto, best for favicon and logos

interface AutoMascotProps {
  expression?: AutoExpression;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animated?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'w-8 h-8',
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
  '2xl': 'w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96'
};

const getAutoSrc = (expression: AutoExpression): string => {
  return `/auto/${expression}_auto.svg`;
};

const getAnimationProps = (expression: AutoExpression, animated: boolean) => {
  if (!animated) return {};

  const baseAnimation = {
    y: [0, -10, 0],
  };

  const expressionAnimations = {
    hello: {
      ...baseAnimation,
      rotate: [0, 5, -5, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    },
    happy: {
      ...baseAnimation,
      scale: [1, 1.05, 1],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    excited: {
      y: [0, -15, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    curious: {
      ...baseAnimation,
      rotate: [0, 10, -5, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
    },
    working: {
      rotate: [0, 360],
      transition: { duration: 8, repeat: Infinity, ease: "linear" }
    },
    sleepy: {
      y: [0, -5, 0],
      opacity: [1, 0.7, 1],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    },
    shocked: {
      scale: [1, 1.2, 1],
      y: [0, -20, 0],
      transition: { duration: 1, repeat: 3, ease: "easeOut" }
    },
    error: {
      x: [-5, 5, -5, 5, 0],
      transition: { duration: 0.5, repeat: 2, ease: "easeInOut" }
    },
    faq: {
      ...baseAnimation,
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    },
    normal: {
      ...baseAnimation,
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    },
    favicon: {} // No animation for favicon
  };

  return expressionAnimations[expression] || baseAnimation;
};

export default function AutoMascot({
  expression = 'normal',
  size = 'md',
  className = '',
  animated = true,
  onClick
}: AutoMascotProps) {
  const animationProps = getAnimationProps(expression, animated);

  return (
    <motion.div
      className={clsx(
        'inline-block relative',
        sizeClasses[size],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...animationProps}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      <img
        src={getAutoSrc(expression)}
        alt={`Auto - ${expression}`}
        className="w-full h-full object-contain"
        draggable={false}
      />
    </motion.div>
  );
}

// Specialized components for common use cases
export function AutoHero({ className = '' }: { className?: string }) {
  return (
    <AutoMascot
      expression="hello"
      size="2xl"
      className={className}
      animated={true}
    />
  );
}

export function AutoLoader({ 
  expression = 'working',
  size = 'lg',
  className = '' 
}: { 
  expression?: 'working' | 'sleepy';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <AutoMascot
      expression={expression}
      size={size}
      className={className}
      animated={true}
    />
  );
}

export function AutoError({ className = '' }: { className?: string }) {
  return (
    <AutoMascot
      expression="error"
      size="lg"
      className={className}
      animated={true}
    />
  );
}

export function AutoFAQ({ className = '' }: { className?: string }) {
  return (
    <AutoMascot
      expression="faq"
      size="lg"
      className={className}
      animated={true}
    />
  );
}

export function AutoFavicon({ className = '' }: { className?: string }) {
  return (
    <AutoMascot
      expression="favicon"
      size="sm"
      className={className}
      animated={false}
    />
  );
}
