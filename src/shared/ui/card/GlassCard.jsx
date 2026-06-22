import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

export const GlassCard = forwardRef(({ 
  children, 
  className, 
  interactive = false,
  intensity = 'medium', // light, medium, heavy
  ...props 
}, ref) => {
  const intensities = {
    light: 'bg-white/20 backdrop-blur-sm border-white/20',
    medium: 'bg-white/40 backdrop-blur-md border-white/40 shadow-xl shadow-ocean-900/5',
    heavy: 'bg-white/60 backdrop-blur-lg border-white/60 shadow-2xl shadow-ocean-900/10'
  };

  const interactiveClasses = interactive ? 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-ocean-900/10 transition-all duration-500 cursor-pointer' : '';

  return (
    <motion.div
      ref={ref}
      className={twMerge(clsx(
        'border rounded-2xl md:rounded-3xl overflow-hidden relative',
        intensities[intensity],
        interactiveClasses,
        className
      ))}
      {...props}
    >
      {/* Ambient Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 pointer-events-none" />
      
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
});

GlassCard.displayName = 'GlassCard';
