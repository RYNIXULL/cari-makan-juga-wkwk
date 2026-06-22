import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const SearchBar = ({ query, setQuery }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto my-8 px-4"
    >
      <div className="relative group">
        <input
          type="text"
          placeholder="Cari makanan favoritmu di lautan rasa..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="glass-input w-full h-14 pl-12 pr-4 text-base shadow-sm group-hover:shadow-md"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ocean-400 group-focus-within:text-ocean-500 transition-colors" />
      </div>
    </motion.div>
  );
};
