import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'bounceIn' | 'float';
  delay?: number;
  duration?: number;
  once?: boolean;
  hover?: boolean;
  stagger?: number;
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
  float: { y: -10, transition: { duration: 0.3, ease: "easeOut" } }
};

export default function AnimatedContainer({
  children,
  className = '',
  animation = 'fadeIn',
  delay = 0,
  duration,
  once = true,
  hover = false,
  stagger = 0
}: AnimatedContainerProps) {
  const variants = animationVariants[animation];
  
  // Override duration if provided
  if (duration && variants.visible && typeof variants.visible === 'object') {
    variants.visible.transition = {
      ...variants.visible.transition,
      duration,
      delay
    };
  }

  const motionProps: any = {
    variants,
    initial: "hidden",
    animate: "visible",
    className
  };

  if (once) {
    motionProps.whileInView = "visible";
    motionProps.viewport = { once: true, amount: 0.3 };
  }

  if (hover) {
    motionProps.whileHover = hoverVariants[animation];
  }

  if (stagger > 0) {
    motionProps.transition = {
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
