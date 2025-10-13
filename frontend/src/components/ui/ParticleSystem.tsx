'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  opacity: number;
}

interface ParticleSystemProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  life?: number;
  gravity?: number;
  spread?: number;
  burst?: boolean;
  continuous?: boolean;
  trigger?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const PARTICLE_COLORS = {
  fire: ['#FF6B35', '#F7931E', '#FFD23F'],
  magic: ['#8B5CF6', '#A855F7', '#C084FC'],
  energy: ['#00D4FF', '#0EA5E9', '#38BDF8'],
  legendary: ['#F59E0B', '#EAB308', '#FCD34D'],
  ice: ['#60A5FA', '#93C5FD', '#DBEAFE'],
  poison: ['#22C55E', '#4ADE80', '#86EFAC']
};

export function ParticleSystem({
  count = 50,
  color = 'energy',
  size = 4,
  speed = 2,
  life = 3000,
  gravity = 0.1,
  spread = 360,
  burst = false,
  continuous = true,
  trigger = false,
  className,
  style
}: ParticleSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(continuous);
  const animationRef = useRef<number>();
  const particleIdRef = useRef(0);
  const lastEmitTime = useRef(0);

  const colors = Array.isArray(color) ? color : PARTICLE_COLORS[color as keyof typeof PARTICLE_COLORS] || [color];

  const createParticle = useCallback((x?: number, y?: number): Particle => {
    const container = containerRef.current;
    if (!container) {
      return {
        id: particleIdRef.current++,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: life,
        maxLife: life,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1
      };
    }

    const rect = container.getBoundingClientRect();
    const centerX = x ?? rect.width / 2;
    const centerY = y ?? rect.height / 2;
    
    // Random angle within spread
    const angle = (Math.random() - 0.5) * (spread * Math.PI / 180);
    const velocity = speed * (0.5 + Math.random() * 0.5);
    
    return {
      id: particleIdRef.current++,
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 2, // Slight upward bias
      life: life,
      maxLife: life,
      size: size * (0.8 + Math.random() * 0.4),
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1
    };
  }, [colors, size, speed, life, spread]);

  const emitParticles = useCallback((particleCount: number, x?: number, y?: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push(createParticle(x, y));
    }
    
    setParticles(prev => {
      const combined = [...prev, ...newParticles];
      // Limit total particles for performance
      return combined.slice(-200);
    });
  }, [createParticle]);

  const updateParticles = useCallback(() => {
    const currentTime = Date.now();
    
    setParticles(prev => {
      const container = containerRef.current;
      if (!container) return prev;
      
      const rect = container.getBoundingClientRect();
      
      return prev
        .map(particle => {
          // Update physics
          const newParticle = {
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + gravity,
            life: particle.life - 16, // Assume 60fps
            opacity: particle.life / particle.maxLife
          };
          
          // Apply some drag
          newParticle.vx *= 0.99;
          newParticle.vy *= 0.99;
          
          return newParticle;
        })
        .filter(particle => {
          // Remove dead particles or particles outside bounds
          return particle.life > 0 && 
                 particle.x > -50 && particle.x < rect.width + 50 &&
                 particle.y > -50 && particle.y < rect.height + 50;
        });
    });

    // Emit new particles for continuous mode
    if (continuous && isActive && currentTime - lastEmitTime.current > 100) {
      emitParticles(Math.ceil(count / 20)); // Emit a fraction each frame
      lastEmitTime.current = currentTime;
    }
  }, [continuous, isActive, count, emitParticles, gravity]);

  const animate = useCallback(() => {
    updateParticles();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles]);

  // Handle trigger prop
  useEffect(() => {
    if (trigger) {
      if (burst) {
        emitParticles(count);
      } else {
        setIsActive(true);
      }
    } else {
      setIsActive(continuous);
    }
  }, [trigger, burst, count, continuous, emitParticles]);

  // Start/stop animation
  useEffect(() => {
    if (isActive || particles.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, particles.length, animate]);

  // Initial burst
  useEffect(() => {
    if (burst || continuous) {
      emitParticles(burst ? count : Math.ceil(count / 4));
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (!continuous) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        emitParticles(burst ? count : 10, x, y);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onClick={handleClick}
    >
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: particle.x - particle.size / 2,
              top: particle.y - particle.size / 2,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              filter: 'blur(0.5px)'
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Preset particle effects
export function FireParticles(props: Omit<ParticleSystemProps, 'color'>) {
  return <ParticleSystem {...props} color="fire" gravity={0.2} />;
}

export function MagicParticles(props: Omit<ParticleSystemProps, 'color'>) {
  return <ParticleSystem {...props} color="magic" gravity={-0.1} />;
}

export function EnergyParticles(props: Omit<ParticleSystemProps, 'color'>) {
  return <ParticleSystem {...props} color="energy" gravity={0.05} />;
}

export function LegendaryParticles(props: Omit<ParticleSystemProps, 'color'>) {
  return (
    <ParticleSystem 
      {...props} 
      color="legendary" 
      gravity={-0.05}
      life={4000}
      speed={1.5}
    />
  );
}

export function IceParticles(props: Omit<ParticleSystemProps, 'color'>) {
  return <ParticleSystem {...props} color="ice" gravity={0.3} speed={1} />;
}

export function PoisonParticles(props: Omit<ParticleSystemProps, 'color'>) {
  return <ParticleSystem {...props} color="poison" gravity={0.1} />;
}

// Explosion effect
export function ExplosionEffect({ 
  x, 
  y, 
  onComplete 
}: { 
  x: number; 
  y: number; 
  onComplete?: () => void; 
}) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div 
      className="absolute pointer-events-none"
      style={{ 
        left: x - 50, 
        top: y - 50, 
        width: 100, 
        height: 100 
      }}
    >
      <ParticleSystem
        count={30}
        color="fire"
        size={6}
        speed={5}
        life={800}
        gravity={0.3}
        spread={360}
        burst
        continuous={false}
        className="w-full h-full"
      />
    </div>
  );
}

export default ParticleSystem;