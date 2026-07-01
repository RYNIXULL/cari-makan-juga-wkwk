import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, MapPin, Truck, CreditCard, ChevronRight, AlertCircle, Check, X } from 'lucide-react';
import { useCart } from '../features/cart/CartContext';
import { useAuth } from '../features/auth/useAuth';
import { useToast } from '../features/toast/ToastContext';
import { ordersService } from '../shared/services/orders.service';
import { Button } from '../shared/ui/button/Button';

const SHIPPING_OPTIONS = [
  { id: 'regular', label: 'Regular', desc: '3-5 hari kerja', cost: 10000 },
  { id: 'express', label: 'Express', desc: '1-2 hari kerja', cost: 20000 },
  { id: 'same_day', label: 'Same Day', desc: 'Hari ini', cost: 35000 },
];

const PAYMENT_OPTIONS = [
  { id: 'transfer_bank', label: 'Transfer Bank', desc: 'BCA, BNI, Mandiri, BRI' },
  { id: 'ewallet', label: 'E-Wallet', desc: 'GoPay, OVO, DANA, ShopeePay' },
  { id: 'cod', label: 'Bayar di Tempat (COD)', desc: 'Bayar saat pesanan sampai' },
];

const STEPS = ['Keranjang', 'Checkout', 'Pembayaran'];

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('regular');
  const [paymentMethod, setPaymentMethod] = useState('transfer_bank');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (cart.length === 0) return <Navigate to="/" replace />;

  const shippingCost = SHIPPING_OPTIONS.find(s => s.id === shippingMethod)?.cost || 10000;
  const total = subtotal + shippingCost;

  const handleSubmit = () => {
    if (!shippingAddress.trim()) {
      addToast('Alamat pengiriman harus diisi.', 'error');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmOrder = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    try {
      const result = await ordersService.createOrder({
        items: cart,
        shippingAddress: shippingAddress.trim(),
        shippingMethod,
        paymentMethod,
        notes: notes.trim() || null,
      });
      if (result.status === 'success') {
        clearCart();
        addToast('Pesanan berhasil dibuat!', 'success');
        navigate(`/payment/${result.data.id}`);
      } else {
        addToast(result.message || 'Gagal membuat pesanan.', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Terjadi kesalahan saat membuat pesanan.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i <= 1 ? 'bg-ocean-500 text-white shadow-md' : 'bg-slate-200 text-slate-400'
              }`}>
                {i < 1 ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm font-bold ${i <= 1 ? 'text-ocean-700' : 'text-slate-400'}`}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className={`w-4 h-4 ${i < 1 ? 'text-ocean-400' : 'text-slate-300'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-ocean-500" />
              Ringkasan Pesanan ({cart.length} item)
            </h2>
            <div className="flex flex-col gap-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <img
                    src={item.image || item.strMealThumb}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-slate-500">Rp 25.000 x {item.quantity}</p>
                  </div>
                  <p className="font-bold text-slate-800 text-sm whitespace-nowrap">
                    Rp {(25000 * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-ocean-500" />
              Alamat Pengiriman
            </h2>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Masukkan alamat lengkap pengiriman..."
              rows={3}
              className="w-full glass-input resize-none"
            />
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan untuk penjual (opsional)"
              className="w-full glass-input mt-3"
            />
          </motion.div>

          {/* Shipping Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-ocean-500" />
              Metode Pengiriman
            </h2>
            <div className="flex flex-col gap-3">
              {SHIPPING_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    shippingMethod === opt.id
                      ? 'border-ocean-400 bg-ocean-50/50'
                      : 'border-slate-100 bg-white/50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={opt.id}
                      checked={shippingMethod === opt.id}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="accent-ocean-500"
                    />
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{opt.label}</p>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </div>
                  </div>
                  <p className="font-bold text-ocean-600 text-sm">
                    Rp {opt.cost.toLocaleString('id-ID')}
                  </p>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-ocean-500" />
              Metode Pembayaran
            </h2>
            <div className="flex flex-col gap-3">
              {PAYMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === opt.id
                      ? 'border-ocean-400 bg-ocean-50/50'
                      : 'border-slate-100 bg-white/50 hover:border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={paymentMethod === opt.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-ocean-500"
                  />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{opt.label}</p>
                    <p className="text-xs text-slate-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Price Summary (Sticky) */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl sticky top-24"
          >
            <h2 className="text-lg font-bold text-slate-800 mb-4">Rincian Biaya</h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal ({cart.length} item)</span>
                <span className="font-bold text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ongkos Kirim</span>
                <span className="font-bold text-slate-800">Rp {shippingCost.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="font-bold text-slate-800">Total</span>
                <span className="text-xl font-black text-ocean-600">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <Button
              variant="solid"
              size="lg"
              className="w-full mt-6 shadow-lg shadow-ocean-500/30"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Buat Pesanan
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
              onClick={() => setShowConfirmDialog(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-ocean-50 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-ocean-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Konfirmasi Pesanan</h3>
                </div>
                <p className="text-slate-600 mb-2">Apakah Anda yakin ingin membuat pesanan ini?</p>
                <p className="text-sm text-slate-500 mb-6">
                  Total pembayaran: <span className="font-bold text-ocean-600">Rp {total.toLocaleString('id-ID')}</span>
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="md"
                    className="flex-1"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    variant="solid"
                    size="md"
                    className="flex-1"
                    onClick={handleConfirmOrder}
                    isLoading={isSubmitting}
                  >
                    Ya, Buat Pesanan
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
