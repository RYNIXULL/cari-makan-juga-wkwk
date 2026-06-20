import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Header() {
  const { totalItems } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-lg">C</span>
          CariMakan
        </Link>
        
        <div className="relative p-2 hover:bg-gray-100 rounded-full transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
              {totalItems}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;