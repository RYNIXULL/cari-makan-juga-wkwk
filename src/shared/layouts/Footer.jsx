import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/20 bg-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between">
        <p className="text-slate-600 font-medium text-sm">
          &copy; {new Date().getFullYear()} CariMakan Ocean Theme. All rights reserved.
        </p>
        <div className="flex items-center gap-4 mt-4 md:mt-0 text-sm font-semibold text-ocean-600">
          <a href="#" className="hover:text-ocean-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-ocean-400 transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
};
