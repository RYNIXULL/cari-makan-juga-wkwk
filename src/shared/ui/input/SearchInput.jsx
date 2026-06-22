import React, { forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SearchInput = forwardRef(({ 
  value, 
  onChange, 
  placeholder = "Pencarian...", 
  className, 
  onClear,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={twMerge(clsx('relative group w-full', className))}>
      {/* Glow Effect on Focus */}
      <div className={clsx(
        "absolute -inset-0.5 bg-gradient-to-r from-ocean-300 to-ocean-500 rounded-2xl blur opacity-0 transition duration-500 group-hover:opacity-30",
        isFocused && "opacity-50 group-hover:opacity-60"
      )} />
      
      <div className="relative flex items-center bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden transition-colors">
        <div className="pl-4 pr-2 text-ocean-400">
          <Search className={clsx("w-5 h-5 transition-colors duration-300", isFocused && "text-ocean-600")} />
        </div>
        
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full py-4 px-2 bg-transparent text-slate-800 placeholder-slate-500 font-medium focus:outline-none"
          {...props}
        />

        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={onClear}
              className="pr-4 pl-2 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

SearchInput.displayName = 'SearchInput';
