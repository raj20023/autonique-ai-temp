import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'icon' | 'full' | 'name';
  theme?: 'light' | 'dark' | 'auto';
  animated?: boolean;
  showFallback?: boolean;
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

export default function Logo({
  className = '',
  size = 'md',
  variant = 'icon',
  theme = 'auto',
  animated = false,
  showFallback = true
}: LogoProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // Auto-detect theme based on system preference or parent element
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');

      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setCurrentTheme(theme);
    }
  }, [theme]);

  const getLogoSrc = () => {
    const themeToUse = theme === 'auto' ? currentTheme : theme;

    switch (variant) {
      case 'icon':
        return '/logos/logo_icon.png';
      case 'full':
        return themeToUse === 'dark'
          ? '/logos/full_logo_dark_theam.png'
          : '/logos/full_logo_light_theam.png';
      case 'name':
        return themeToUse === 'dark'
          ? '/logos/name_logo_dark_theam.png'
          : '/logos/name_log_light_theam.png';
      default:
        return '/logos/logo_icon.png';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

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

  const fallbackAnimations = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Show fallback if image failed to load and we allow fallback
  if (imageError && showFallback) {
    const FallbackComponent = (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg ${className}`}>
        <Bot className={`${size === 'xs' ? 'h-2 w-2' : size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : size === 'xl' ? 'h-8 w-8' : 'h-12 w-12'} text-white`} />
      </div>
    );

    return animated ? (
      <motion.div
        variants={fallbackAnimations}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        {FallbackComponent}
      </motion.div>
    ) : FallbackComponent;
  }

  const sizeClass = variant === 'icon' ? sizeClasses[size] : fullLogoSizes[size];

  const LogoComponent = (
    <div className={`relative ${className}`}>
      <img
        src={getLogoSrc()}
        alt="AutoniqueAI Logo"
        className={`${sizeClass} object-contain transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      {/* Loading state */}
      {!imageLoaded && !imageError && (
        <div className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse`}>
          <Bot className={`${size === 'xs' ? 'h-2 w-2' : size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : size === 'xl' ? 'h-8 w-8' : 'h-12 w-12'} text-white`} />
        </div>
      )}
    </div>
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
