import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'icon' | 'full' | 'name';
  theme?: 'light' | 'dark';
  animated?: boolean;
}

const sizeClasses = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
  '2xl': 'h-24 w-24'
};

const fullLogoSizes = {
  xs: 'h-4 w-auto',
  sm: 'h-6 w-auto',
  md: 'h-8 w-auto',
  lg: 'h-12 w-auto',
  xl: 'h-16 w-auto',
  '2xl': 'h-24 w-auto'
};

export default function LogoSimple({
  className = '',
  size = 'md',
  variant = 'icon',
  theme = 'light',
  animated = false
}: LogoProps) {
  const getLogoSrc = () => {
    switch (variant) {
      case 'icon':
        return '/logos/favicon_auto.svg';
      case 'full':
        return theme === 'dark'
          ? '/logos/full_dark_background.svg'
          : '/logos/full_white_background.svg';
      case 'name':
        return theme === 'dark'
          ? '/logos/header_dark_background.svg'
          : '/logos/header_white_background.svg';
      default:
        return '/logos/favicon_auto.svg';
    }
  };

  const sizeClass = variant === 'icon' ? sizeClasses[size] : fullLogoSizes[size];

  const logoAnimations = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const LogoComponent = (
    <img
      src={getLogoSrc()}
      alt="AutoniqueAI Logo"
      className={`${sizeClass} object-contain ${className}`}
      onError={(e) => {
        // Fallback to Bot icon if image fails to load
        const target = e.currentTarget;
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = `
            <div class="${sizeClasses[size]} bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg ${className}">
              <svg class="${size === 'xs' ? 'h-2 w-2' : size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : size === 'xl' ? 'h-8 w-8' : 'h-12 w-12'} text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          `;
        }
      }}
    />
  );

  return animated ? (
    <motion.div
      variants={logoAnimations}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {LogoComponent}
    </motion.div>
  ) : LogoComponent;
}
