import { useState } from 'react';
import { Bot } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showFallback?: boolean;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};

export default function Logo({ className = '', size = 'md', showFallback = true }: LogoProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Show fallback if image failed to load or if we want to show fallback
  if (imageError || !showFallback) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-brand-950 to-accent-500 rounded-xl flex items-center justify-center shadow-lg ${className}`}>
        <Bot className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img 
        src="/logo.png" 
        alt="Autonique.ai Logo" 
        className={`${sizeClasses[size]} object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      {/* Loading fallback */}
      {!imageLoaded && !imageError && (
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-brand-950 to-accent-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse`}>
          <Bot className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
        </div>
      )}
    </div>
  );
}
