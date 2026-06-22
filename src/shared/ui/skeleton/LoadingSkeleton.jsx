import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx} 
          className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl md:rounded-3xl h-[340px] flex flex-col overflow-hidden relative"
        >
          {/* Shimmer Effect */}
          <motion.div
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'linear',
            }}
            className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
          />
          
          {/* Image Placeholder */}
          <div className="h-48 bg-ocean-100/50 w-full" />
          
          {/* Content Placeholder */}
          <div className="p-5 flex flex-col flex-grow gap-4">
            <div>
              <div className="h-6 bg-ocean-100/60 rounded-md w-3/4 mb-2" />
              <div className="h-4 bg-ocean-100/40 rounded-md w-1/2" />
            </div>
            
            <div className="mt-auto flex justify-between items-center">
              <div className="h-6 bg-ocean-100/60 rounded-md w-1/3" />
              <div className="h-8 bg-ocean-200/50 rounded-lg w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
