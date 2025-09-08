import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { getAnimationConfig, getOptimizedVariants, prefersReducedMotion } from '@/utils/performance';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'bounceIn' | 'float' | 'neuralPulse' | 'morphGlow' | 'levitate' | 'breathe' | 'dataFlow' | 'shimmer';
  delay?: number;
  duration?: number;
  once?: boolean;
  hover?: boolean;
  stagger?: number;
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

const animationVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  slideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  slideDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  slideRight: {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  },
  bounceIn: {
    hidden: { opacity: 0, scale: 0.3 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  },
  float: {
    hidden: { opacity: 0, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  // AI-inspired animations
  neuralPulse: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  },
  morphGlow: {
    hidden: { opacity: 0, scale: 0.9, rotateX: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 1.2,
        ease: [0.34, 1.56, 0.64, 1],
        type: "spring",
        stiffness: 80,
        damping: 20
      }
    }
  },
  levitate: {
    hidden: { opacity: 0, y: 20, rotateX: 10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 1.0,
        ease: [0.175, 0.885, 0.32, 1.275],
        type: "spring",
        stiffness: 120,
        damping: 25
      }
    }
  },
  breathe: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "reverse" as const,
        repeatDelay: 0.5
      }
    }
  },
  dataFlow: {
    hidden: { opacity: 0, x: -100, scaleX: 0 },
    visible: {
      opacity: 1,
      x: 0,
      scaleX: 1,
      transition: {
        duration: 1.2,
        ease: [0.68, -0.55, 0.265, 1.55],
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  },
  shimmer: {
    hidden: { opacity: 0, backgroundPosition: '-200% 0' },
    visible: {
      opacity: 1,
      backgroundPosition: '200% 0',
      transition: {
        duration: 2.0,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: 1
      }
    }
  }
};

const hoverVariants: Record<string, any> = {
  fadeIn: { scale: 1.02, transition: { duration: 0.2 } },
  slideUp: { y: -5, transition: { duration: 0.2 } },
  slideDown: { y: 5, transition: { duration: 0.2 } },
  slideLeft: { x: -5, transition: { duration: 0.2 } },
  slideRight: { x: 5, transition: { duration: 0.2 } },
  scaleIn: { scale: 1.05, transition: { duration: 0.2 } },
  bounceIn: { scale: 1.05, transition: { duration: 0.2, type: "spring" } },
  float: { y: -10, transition: { duration: 0.3, ease: "easeOut" } },
  // AI-inspired hover effects
  neuralPulse: {
    scale: 1.03,
    boxShadow: "0 0 30px rgba(79, 172, 254, 0.4)",
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  morphGlow: {
    scale: 1.02,
    rotateY: 5,
    boxShadow: "0 0 40px rgba(102, 126, 234, 0.5)",
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }
  },
  levitate: {
    y: -15,
    rotateX: 2,
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.2)",
    transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }
  },
  breathe: {
    scale: 1.05,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  dataFlow: {
    x: 5,
    scaleX: 1.02,
    transition: { duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }
  },
  shimmer: {
    backgroundPosition: '100% 0',
    transition: { duration: 0.6, ease: "linear" }
  }
};

export default function AnimatedContainer({
  children,
  className = '',
  animation = 'fadeIn',
  delay = 0,
  duration,
  once = true,
  hover = false,
  stagger = 0,
  springConfig
}: AnimatedContainerProps) {
  // Get performance-optimized configuration
  const animConfig = getAnimationConfig();
  const optimizedVariants = getOptimizedVariants();
  const reducedMotion = prefersReducedMotion();

  // Skip animations if user prefers reduced motion
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Use optimized variants if available, fallback to custom variants
  let variants: any;
  const optimizedVariant = optimizedVariants[animation as keyof typeof optimizedVariants];

  if (optimizedVariant) {
    // Use optimized variants (these use initial/animate structure)
    variants = { ...optimizedVariant };

    // Override transition properties if provided
    if (variants.transition) {
      variants.transition = {
        ...variants.transition,
        ...(duration && { duration }),
        ...(delay && { delay }),
        ...(springConfig && {
          type: "spring",
          stiffness: springConfig.stiffness || animConfig.stiffness,
          damping: springConfig.damping || animConfig.damping,
          mass: springConfig.mass || animConfig.mass
        })
      };
    }
  } else {
    // Use custom variants (these use hidden/visible structure)
    variants = { ...animationVariants[animation] };

    // Override duration, delay, or spring config if provided
    if (variants.visible && typeof variants.visible === 'object') {
      const currentTransition = variants.visible.transition || {};

      variants.visible.transition = {
        ...currentTransition,
        ...(duration && { duration }),
        ...(delay && { delay }),
        ...(springConfig && {
          type: "spring",
          stiffness: springConfig.stiffness || animConfig.stiffness,
          damping: springConfig.damping || animConfig.damping,
          mass: springConfig.mass || animConfig.mass
        })
      };
    }
  }

  // Determine if we're using optimized variants or custom variants
  const isOptimizedVariant = optimizedVariants[animation as keyof typeof optimizedVariants];

  const motionProps: any = {
    className
  };

  if (isOptimizedVariant) {
    // Use optimized variant structure (initial/animate)
    motionProps.initial = variants.initial;
    motionProps.animate = variants.animate;
    motionProps.transition = variants.transition;

    if (once) {
      motionProps.whileInView = variants.animate;
      motionProps.viewport = { once: true, amount: 0.3 };
    }
  } else {
    // Use custom variant structure (hidden/visible)
    motionProps.variants = variants;
    motionProps.initial = "hidden";
    motionProps.animate = "visible";

    if (once) {
      motionProps.whileInView = "visible";
      motionProps.viewport = { once: true, amount: 0.3 };
    }
  }

  if (hover) {
    motionProps.whileHover = hoverVariants[animation];
  }

  if (stagger > 0) {
    motionProps.transition = {
      ...motionProps.transition,
      staggerChildren: stagger
    };
  }

  return (
    <motion.div {...motionProps}>
      {children}
    </motion.div>
  );
}

// Stagger container for animating multiple children
export function StaggerContainer({ 
  children, 
  className = '', 
  stagger = 0.1,
  animation = 'slideUp'
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  animation?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item
export function StaggerItem({ 
  children, 
  className = '',
  animation = 'slideUp'
}: {
  children: ReactNode;
  className?: string;
  animation?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={animationVariants[animation]}
    >
      {children}
    </motion.div>
  );
}
