import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../../features/cart/CartDrawer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-grow flex flex-col w-full">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-grow flex flex-col"
        >
          <Outlet />
        </motion.main>
      </div>
      <Footer />
      <CartDrawer />
    </div>
  );
};
