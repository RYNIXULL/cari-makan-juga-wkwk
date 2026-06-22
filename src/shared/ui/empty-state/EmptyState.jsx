import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../card/GlassCard';

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full py-12 px-4 flex justify-center"
    >
      <GlassCard intensity="medium" className="max-w-lg w-full p-10 md:p-14 flex flex-col items-center text-center border-dashed border-2">
        {Icon && (
          <div className="w-20 h-20 rounded-full bg-ocean-100/50 flex items-center justify-center mb-6">
            <Icon className="w-10 h-10 text-ocean-400" />
          </div>
        )}
        
        <h3 className="text-2xl font-black text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-500 font-medium mb-8 leading-relaxed max-w-sm">
          {description}
        </p>
        
        {action}
      </GlassCard>
    </motion.div>
  );
};
