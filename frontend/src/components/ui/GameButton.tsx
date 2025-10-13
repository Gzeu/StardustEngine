'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'legendary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  effect?: 'glow' | 'pulse' | 'ripple' | 'cyber' | 'none';
  icon?: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  glitchText?: boolean;
  soundEffect?: boolean;
  children: React.ReactNode;
}

const variants = {
  primary: {
    base: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500',
    hover: 'from-blue-700 to-purple-700 border-blue-400',
    active: 'from-blue-800 to-purple-800',
    glow: 'shadow-lg shadow-blue-500/50'
  },
  secondary: {
    base: 'bg-gradient-to-r from-gray-700 to-gray-600 text-white border-gray-600',
    hover: 'from-gray-600 to-gray-500 border-gray-500',
    active: 'from-gray-800 to-gray-700',
    glow: 'shadow-lg shadow-gray-500/30'
  },
  danger: {
    base: 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500',
    hover: 'from-red-700 to-red-800 border-red-400',
    active: 'from-red-800 to-red-900',
    glow: 'shadow-lg shadow-red-500/50'
  },
  success: {
    base: 'bg-gradient-to-r from-green-600 to-green-700 text-white border-green-500',
    hover: 'from-green-700 to-green-800 border-green-400',
    active: 'from-green-800 to-green-900',
    glow: 'shadow-lg shadow-green-500/50'
  },
  legendary: {
    base: 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white border-yellow-400',
    hover: 'from-yellow-600 via-orange-600 to-red-600 border-yellow-300',
    active: 'from-yellow-700 via-orange-700 to-red-700',
    glow: 'shadow-xl shadow-yellow-500/60'
  }
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
};

function RippleEffect({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/30 pointer-events-none"
      style={{
        left: x - 25,
        top: y - 25,
        width: 50,
        height: 50
      }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 4, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  );
}

function LoadingSpinner() {
  return (
    <motion.div
      className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function GlitchText({ children, active }: { children: React.ReactNode; active: boolean }) {
  if (!active) return <>{children}</>;
  
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 text-red-400"
        animate={{
          x: [0, -1, 1, 0],
          y: [0, 1, -1, 0]
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-cyan-400"
        animate={{
          x: [0, 1, -1, 0],
          y: [0, -1, 1, 0]
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 0.1
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function GameButton({
  variant = 'primary',
  size = 'md',
  effect = 'glow',
  icon: Icon,
  loading = false,
  glitchText = false,
  soundEffect = false,
  className,
  children,
  disabled,
  onClick,
  ...props
}: GameButtonProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);

  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Create ripple effect
    if (effect === 'ripple' && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = {
        id: rippleIdRef.current++,
        x,
        y
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }

    // Glitch effect
    if (glitchText) {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 300);
    }

    // Sound effect
    if (soundEffect && typeof window !== 'undefined') {
      // Create audio context for button sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (error) {
        // Fallback - silent failure
      }
    }

    onClick?.(e);
  };

  const getEffectClasses = () => {
    switch (effect) {
      case 'glow':
        return variantStyles.glow;
      case 'pulse':
        return 'animate-pulse';
      case 'cyber':
        return 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700';
      default:
        return '';
    }
  };

  const buttonClasses = cn(
    // Base styles
    'relative inline-flex items-center justify-center gap-2 font-semibold rounded-lg border-2 transition-all duration-200 transform-gpu',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    
    // Size
    sizeStyles,
    
    // Variant base
    variantStyles.base,
    
    // Hover effects
    !disabled && !loading && [
      `hover:${variantStyles.hover}`,
      'hover:scale-105 hover:shadow-lg'
    ],
    
    // Active effects
    !disabled && !loading && [
      `active:${variantStyles.active}`,
      'active:scale-95'
    ],
    
    // Special effects
    !disabled && !loading && getEffectClasses(),
    
    // Pressed state
    isPressed && 'scale-95',
    
    // Legendary special styling
    variant === 'legendary' && [
      'relative overflow-hidden',
      'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
      'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000'
    ],
    
    className
  );

  return (
    <motion.button
      ref={buttonRef}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {/* Loading state */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon */}
      {Icon && !loading && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-shrink-0"
        >
          <Icon className={cn(
            size === 'sm' ? 'w-4 h-4' :
            size === 'md' ? 'w-5 h-5' :
            size === 'lg' ? 'w-6 h-6' : 'w-7 h-7'
          )} />
        </motion.div>
      )}

      {/* Button text */}
      {!loading && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          <GlitchText active={glitchActive}>
            {children}
          </GlitchText>
        </motion.span>
      )}

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <RippleEffect key={ripple.id} x={ripple.x} y={ripple.y} />
        ))}
      </AnimatePresence>

      {/* Legendary particle effect */}
      {variant === 'legendary' && !disabled && !loading && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [-20, -40, -20],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
}

export default GameButton;