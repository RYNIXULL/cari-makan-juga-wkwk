import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  solid: 'bg-ocean-400 text-white shadow-lg shadow-ocean-400/30 hover:bg-ocean-500 hover:shadow-ocean-500/40 border border-transparent',
  glass: 'bg-white/40 backdrop-blur-md border border-white/50 text-ocean-900 shadow-sm hover:bg-white/60 hover:shadow-md',
  ghost: 'bg-transparent text-ocean-600 hover:bg-ocean-50 border border-transparent',
  danger: 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-600 hover:shadow-rose-600/40 border border-transparent'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-xl',
  lg: 'px-6 py-3 text-lg rounded-2xl'
};

export const Button = forwardRef(({ 
  children, 
  variant = 'solid', 
  size = 'md', 
  className, 
  isLoading = false, 
  leftIcon, 
  rightIcon, 
  disabled, 
  ...props 
}, ref) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:pointer-events-none overflow-hidden';
  
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.95 }}
      disabled={disabled || isLoading}
      className={twMerge(clsx(baseClasses, variants[variant], sizes[size], className))}
      {...props}
    >
      {/* Shine effect for solid button */}
      {variant === 'solid' && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
      )}
      
      <span className={clsx('flex items-center gap-2 relative z-10', isLoading && 'opacity-0')}>
        {leftIcon}
        {children}
        {rightIcon}
      </span>
      
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center z-20">
          <Loader2 className="w-5 h-5 animate-spin" />
        </span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';
