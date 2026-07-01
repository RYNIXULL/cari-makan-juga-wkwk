import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, ChevronRight, Check, Clock, XCircle, CheckCircle, Banknote } from 'lucide-react';
import { useAuth } from '../features/auth/useAuth';
import { useToast } from '../features/toast/ToastContext';
import { ordersService } from '../shared/services/orders.service';
import { Button } from '../shared/ui/button/Button';

const STEPS = ['Keranjang', 'Checkout', 'Pembayaran'];

const PAYMENT_LABELS = {
  transfer_bank: 'Transfer Bank',
  ewallet: 'E-Wallet',
  cod: 'Bayar di Tempat (COD)',
};

export default function PaymentPage() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await ordersService.getOrderById(orderId);
      if (res.status === 'success') {
        setOrder(res.data);
        if (res.data.status !== 'pending_payment') {
          setPaymentSuccess(true);
        }
      }
    } catch (err) {
      addToast('Gagal memuat data pesanan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    setPaying(true);
    try {
      const res = await ordersService.simulatePayment(orderId);
      if (res.status === 'success') {
        setPaymentSuccess(true);
        setOrder(res.data);
        addToast('Pembayaran berhasil!', 'success');
      } else {
        addToast(res.message || 'Pembayaran gagal.', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Terjadi kesalahan saat memproses pembayaran.', 'error');
    } finally {
      setPaying(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await ordersService.cancelOrder(orderId);
      if (res.status === 'success') {
        addToast('Pesanan berhasil dibatalkan.', 'info');
        navigate('/orders');
      } else {
        addToast(res.message || 'Gagal membatalkan pesanan.', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Terjadi kesalahan.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <div className="pt-24 pb-12 px-4 min-h-screen flex items-center justify-center">
        <div className="text-slate-500 font-medium">Memuat data pesanan...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-24 pb-12 px-4 min-h-screen flex items-center justify-center">
        <div className="text-slate-500 font-medium">Pesanan tidak ditemukan.</div>
      </div>
    );
  }

  // Payment Success View
  if (paymentSuccess) {
    return (
      <div className="pt-24 pb-12 px-4 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-10 shadow-xl text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </motion.div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Pembayaran Berhasil!</h2>
          <p className="text-slate-500 mb-6">
            Pesanan Anda sedang menunggu diproses oleh admin.
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">No. Pesanan</span>
              <span className="font-mono font-bold text-slate-800">#{order.id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Dibayar</span>
              <span className="font-bold text-ocean-600">Rp {order.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              variant="solid"
              size="lg"
              className="w-full"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              Lihat Detail Pesanan
            </Button>
            <Button
              variant="ghost"
              size="md"
              className="w-full"
              onClick={() => navigate('/orders')}
            >
              Lihat Semua Pesanan
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Payment Pending View
  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto min-h-screen">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i <= 2 ? 'bg-ocean-500 text-white shadow-md' : 'bg-slate-200 text-slate-400'
              }`}>
                {i < 2 ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm font-bold ${i <= 2 ? 'text-ocean-700' : 'text-slate-400'}`}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className={`w-4 h-4 ${i < 2 ? 'text-ocean-400' : 'text-slate-300'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-50 rounded-2xl">
            <Clock className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Menunggu Pembayaran</h1>
            <p className="text-sm text-slate-500">Selesaikan pembayaran untuk memproses pesanan Anda</p>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-slate-50 rounded-2xl p-5 mb-6 flex flex-col gap-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">No. Pesanan</span>
            <span className="font-mono font-bold text-slate-800">#{order.id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Metode Pembayaran</span>
            <span className="font-bold text-slate-800">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-slate-200 pt-3">
            <span className="font-bold text-slate-800">Total Pembayaran</span>
            <span className="text-xl font-black text-ocean-600">Rp {order.total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-ocean-50/50 border border-ocean-100 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-ocean-800 mb-2 flex items-center gap-2">
            <Banknote className="w-5 h-5" />
            Instruksi Pembayaran (Simulasi)
          </h3>
          <p className="text-sm text-ocean-700">
            Ini adalah simulasi pembayaran untuk keperluan demonstrasi. Tekan tombol "Bayar Sekarang" di bawah untuk mensimulasikan pembayaran berhasil.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            variant="solid"
            size="lg"
            className="w-full shadow-lg shadow-ocean-500/30"
            leftIcon={<CreditCard className="w-5 h-5" />}
            onClick={handlePay}
            isLoading={paying}
            disabled={paying || cancelling}
          >
            Bayar Sekarang
          </Button>
          <Button
            variant="danger"
            size="md"
            className="w-full"
            leftIcon={<XCircle className="w-4 h-4" />}
            onClick={handleCancel}
            isLoading={cancelling}
            disabled={paying || cancelling}
          >
            Batalkan Pesanan
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
