import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getAnimationConfig, prefersReducedMotion } from '@/utils/performance';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  particleCount?: number;
  className?: string;
  colors?: string[];
  speed?: number;
  size?: { min: number; max: number };
  opacity?: { min: number; max: number };
  interactive?: boolean;
  type?: 'neural' | 'floating' | 'connected' | 'flowing';
}

export default function ParticleSystem({
  particleCount = 50,
  className = '',
  colors = ['#4facfe', '#00f2fe', '#667eea', '#764ba2'],
  speed = 0.5,
  size = { min: 1, max: 3 },
  opacity = { min: 0.1, max: 0.6 },
  interactive = true,
  type = 'neural'
}: ParticleSystemProps) {
  const animConfig = getAnimationConfig();
  const reducedMotion = prefersReducedMotion();

  // Disable particles for reduced motion or low performance
  if (reducedMotion || !animConfig.particles) {
    return null;
  }

  // Adjust particle count based on performance
  const adjustedParticleCount = Math.floor(particleCount * (animConfig.duration / 0.8));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Initialize particles
  const initializeParticles = useMemo(() => {
    return (width: number, height: number) => {
      const particles: Particle[] = [];
      
      for (let i = 0; i < adjustedParticleCount; i++) {
        particles.push({
          id: i,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: size.min + Math.random() * (size.max - size.min),
          opacity: opacity.min + Math.random() * (opacity.max - opacity.min),
          color: colors[Math.floor(Math.random() * colors.length)],
          life: Math.random() * 1000,
          maxLife: 1000 + Math.random() * 2000
        });
      }
      
      return particles;
    };
  }, [adjustedParticleCount, speed, size, opacity, colors]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Reinitialize particles on resize
      particlesRef.current = initializeParticles(rect.width, rect.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      particlesRef.current.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life += 1;

        // Interactive mouse effect
        if (interactive) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.vx += (dx / distance) * force * 0.01;
            particle.vy += (dy / distance) * force * 0.01;
          }
        }

        // Boundary wrapping
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;

        // Particle lifecycle
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.x = Math.random() * rect.width;
          particle.y = Math.random() * rect.height;
          particle.vx = (Math.random() - 0.5) * speed;
          particle.vy = (Math.random() - 0.5) * speed;
        }

        // Render particle based on type
        ctx.save();
        
        if (type === 'neural') {
          // Neural network style with connections
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          // Draw connections to nearby particles
          particlesRef.current.forEach((otherParticle, otherIndex) => {
            if (index !== otherIndex) {
              const dx = particle.x - otherParticle.x;
              const dy = particle.y - otherParticle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 80) {
                ctx.globalAlpha = (80 - distance) / 80 * 0.2;
                ctx.strokeStyle = particle.color;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
              }
            }
          });
        } else if (type === 'floating') {
          // Floating orbs with glow
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'transparent');
          
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'flowing') {
          // Data flow style
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;
          ctx.fillRect(
            particle.x - particle.size / 2, 
            particle.y - particle.size / 2, 
            particle.size * 2, 
            particle.size
          );
        }
        
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeParticles, interactive, speed, type]);

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: 'transparent',
          pointerEvents: interactive ? 'auto' : 'none'
        }}
      />
    </motion.div>
  );
}

// Preset configurations for different effects
export const ParticlePresets = {
  neural: {
    type: 'neural' as const,
    particleCount: 40,
    colors: ['#4facfe', '#00f2fe', '#667eea'],
    speed: 0.3,
    size: { min: 1, max: 2 },
    opacity: { min: 0.2, max: 0.6 }
  },
  aiGlow: {
    type: 'floating' as const,
    particleCount: 25,
    colors: ['#667eea', '#764ba2', '#f093fb'],
    speed: 0.2,
    size: { min: 2, max: 4 },
    opacity: { min: 0.1, max: 0.4 }
  },
  dataFlow: {
    type: 'flowing' as const,
    particleCount: 60,
    colors: ['#4facfe', '#00f2fe'],
    speed: 1.0,
    size: { min: 1, max: 3 },
    opacity: { min: 0.3, max: 0.8 }
  }
};
