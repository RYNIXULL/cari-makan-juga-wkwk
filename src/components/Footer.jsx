import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-500 py-6 text-center text-sm border-t border-gray-800 mt-12">
      <p className="text-gray-300 font-medium">CariMakan Platform Discovery</p>
      <p className="text-xs mt-1">© {new Date().getFullYear()} CariMakan. Built by standard components.</p>
    </footer>
  );
}

export default Footer;