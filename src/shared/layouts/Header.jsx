import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, ShoppingCart, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useCart } from '../../features/cart/CartContext';
import { useAuth } from '../../features/auth/useAuth';
import { Button } from '../ui/button/Button';
import { motion } from 'framer-motion';

export const Header = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 inset-x-0 z-40 bg-white/40 backdrop-blur-md border-b border-white/40 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-ocean-400 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform">
            C
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">CariMakan</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center space-x-4">
            {user && user.role === 'admin' && (
              <Button variant="outline" size="sm" onClick={() => navigate('/admin')} className="border-ocean-500 text-ocean-600">
                Admin Panel
              </Button>
            )}
            <Button variant="ghost" className="relative p-2 px-3">
              <ShoppingCart className="w-5 h-5 text-ocean-600" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-rose-500 rounded-full">
                  {totalItems}
                </span>
              )}
            </Button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-ocean-900 bg-ocean-100/50 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user.name.split(' ')[0]}
                </span>
                <Button variant="ghost" size="sm" onClick={logout} className="text-rose-500 hover:bg-rose-50 border-rose-100">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button variant="solid" size="sm" leftIcon={<LogIn className="w-4 h-4" />} onClick={() => navigate('/login')}>
                Masuk
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};
