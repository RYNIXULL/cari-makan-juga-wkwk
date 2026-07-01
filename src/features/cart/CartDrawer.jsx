import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useToast } from '../toast/ToastContext';
import { Button } from '../../shared/ui/button/Button';

export const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      addToast('Silakan login terlebih dahulu untuk checkout.', 'error');
      setIsCartOpen(false);
      navigate('/login');
      return;
    }
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-ocean-50 rounded-xl">
                  <ShoppingCart className="w-5 h-5 text-ocean-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Keranjang Belanja</h2>
                {cart.length > 0 && (
                  <span className="text-xs font-bold bg-ocean-100 text-ocean-700 px-2 py-0.5 rounded-full">
                    {cart.length} item
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                  <ShoppingCart className="w-16 h-16 opacity-20" />
                  <p className="font-medium">Keranjang Anda masih kosong</p>
                  <p className="text-sm">Tambahkan makanan favorit Anda!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100"
                    >
                      <img
                        src={item.image || item.strMealThumb || item.mealImage}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-sm"
                      />
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                          <p className="text-sm font-medium text-ocean-600 mt-0.5">
                            Rp 25.000
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-bold text-slate-800 text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {/* Subtotal + Delete */}
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800 text-sm">
                              Rp {(25000 * item.quantity).toLocaleString('id-ID')}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-2xl font-black text-slate-800">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">Ongkir dihitung saat checkout</p>
                <Button
                  variant="solid"
                  size="lg"
                  className="w-full text-lg shadow-lg shadow-ocean-500/30"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  onClick={handleCheckout}
                >
                  Lanjut ke Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
