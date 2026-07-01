import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, CreditCard, Truck, CheckCircle, XCircle, MapPin, ArrowLeft, Banknote } from 'lucide-react';
import { useAuth } from '../features/auth/useAuth';
import { useToast } from '../features/toast/ToastContext';
import { ordersService } from '../shared/services/orders.service';
import { Button } from '../shared/ui/button/Button';

const STATUS_STEPS = [
  { key: 'pending_payment', label: 'Menunggu Pembayaran', icon: Clock },
  { key: 'paid', label: 'Dibayar', icon: CreditCard },
  { key: 'processing', label: 'Diproses', icon: Package },
  { key: 'shipped', label: 'Dikirim', icon: Truck },
  { key: 'delivered', label: 'Sampai', icon: CheckCircle },
  { key: 'completed', label: 'Selesai', icon: CheckCircle },
];

const PAYMENT_LABELS = {
  transfer_bank: 'Transfer Bank',
  ewallet: 'E-Wallet',
  cod: 'Bayar di Tempat (COD)',
};

const SHIPPING_LABELS = {
  regular: 'Regular (3-5 hari)',
  express: 'Express (1-2 hari)',
  same_day: 'Same Day',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user) fetchOrder();
  }, [id, user]);

  const fetchOrder = async () => {
    try {
      const res = await ordersService.getOrderById(id);
      if (res.status === 'success') {
        setOrder(res.data);
      }
    } catch (err) {
      addToast('Gagal memuat detail pesanan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceived = async () => {
    setActionLoading(true);
    try {
      const res = await ordersService.confirmReceived(id);
      if (res.status === 'success') {
        addToast('Pesanan dikonfirmasi selesai!', 'success');
        fetchOrder();
      } else {
        addToast(res.message || 'Gagal mengkonfirmasi.', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Terjadi kesalahan.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      const res = await ordersService.cancelOrder(id);
      if (res.status === 'success') {
        addToast('Pesanan dibatalkan.', 'info');
        fetchOrder();
      } else {
        addToast(res.message || 'Gagal membatalkan.', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Terjadi kesalahan.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePay = async () => {
    setActionLoading(true);
    try {
      const res = await ordersService.simulatePayment(id);
      if (res.status === 'success') {
        addToast('Pembayaran berhasil!', 'success');
        fetchOrder();
      } else {
        addToast(res.message || 'Pembayaran gagal.', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Terjadi kesalahan.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <div className="pt-24 pb-12 px-4 min-h-screen flex items-center justify-center">
        <div className="text-slate-500 font-medium">Memuat detail pesanan...</div>
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

  // Calculate current step index for timeline
  const isCancelled = order.status === 'cancelled';
  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.status);

  const subtotal = order.total - (order.shippingCost || 0);

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      {/* Back button */}
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-slate-500 hover:text-ocean-600 transition-colors font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Pesanan
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl mb-6"
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Detail Pesanan</h1>
            <p className="font-mono text-sm text-slate-400 mt-1">#{order.id.slice(-8).toUpperCase()}</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
            isCancelled ? 'bg-rose-100 text-rose-700' :
            order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
            order.status === 'pending_payment' ? 'bg-amber-100 text-amber-700' :
            order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
            order.status === 'processing' ? 'bg-indigo-100 text-indigo-700' :
            order.status === 'shipped' ? 'bg-cyan-100 text-cyan-700' :
            order.status === 'delivered' ? 'bg-teal-100 text-teal-700' :
            'bg-slate-100 text-slate-700'
          }`}>
            {isCancelled ? 'Dibatalkan' : STATUS_STEPS.find(s => s.key === order.status)?.label || order.status}
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Dipesan pada {new Date(order.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </p>
      </motion.div>

      {/* Timeline */}
      {!isCancelled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl mb-6"
        >
          <h2 className="font-bold text-slate-800 mb-6">Status Pesanan</h2>
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 z-0" />
            <div
              className="absolute top-4 left-4 h-0.5 bg-ocean-500 z-0 transition-all duration-500"
              style={{ width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100)}%` }}
            />

            {STATUS_STEPS.map((step, i) => {
              const isActive = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              const StepIcon = step.icon;
              return (
                <div key={step.key} className="flex flex-col items-center z-10 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-ocean-500 text-white shadow-md' :
                    'bg-white border-2 border-slate-200 text-slate-400'
                  } ${isCurrent ? 'ring-4 ring-ocean-200' : ''}`}>
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs mt-2 font-medium text-center max-w-[70px] ${
                    isActive ? 'text-ocean-700' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl"
        >
          <h2 className="font-bold text-slate-800 mb-4">Item Pesanan</h2>
          <div className="flex flex-col gap-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <img
                  src={item.mealImage}
                  alt={item.mealName}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm line-clamp-1">{item.mealName}</p>
                  <p className="text-xs text-slate-500">Rp 25.000 x {item.quantity}</p>
                </div>
                <p className="font-bold text-slate-800 text-sm">
                  Rp {(25000 * item.quantity).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-6"
        >
          {/* Shipping Info */}
          <div className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl">
            <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-ocean-500" /> Pengiriman
            </h2>
            <p className="text-sm text-slate-600 mb-2">{order.shippingAddress || '-'}</p>
            <p className="text-xs text-slate-500">
              Metode: <span className="font-medium">{SHIPPING_LABELS[order.shippingMethod] || order.shippingMethod}</span>
            </p>
            {order.notes && (
              <p className="text-xs text-slate-500 mt-1">Catatan: {order.notes}</p>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl">
            <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Banknote className="w-4 h-4 text-ocean-500" /> Pembayaran
            </h2>
            <p className="text-sm text-slate-600 mb-1">
              Metode: <span className="font-medium">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
            </p>
            {order.paidAt && (
              <p className="text-xs text-slate-500">
                Dibayar: {new Date(order.paidAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl">
            <h2 className="font-bold text-slate-800 mb-3">Rincian Biaya</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ongkir</span>
                <span className="text-slate-800">Rp {(order.shippingCost || 0).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-black text-ocean-600">Rp {order.total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex flex-col sm:flex-row gap-3"
      >
        {order.status === 'pending_payment' && (
          <>
            <Button
              variant="solid"
              size="lg"
              className="flex-1 shadow-lg shadow-ocean-500/30"
              onClick={handlePay}
              isLoading={actionLoading}
              disabled={actionLoading}
            >
              Bayar Sekarang
            </Button>
            <Button
              variant="danger"
              size="lg"
              className="flex-1"
              onClick={handleCancel}
              isLoading={actionLoading}
              disabled={actionLoading}
            >
              Batalkan Pesanan
            </Button>
          </>
        )}
        {order.status === 'delivered' && (
          <Button
            variant="solid"
            size="lg"
            className="flex-1 shadow-lg shadow-emerald-500/30 bg-emerald-500 hover:bg-emerald-600"
            leftIcon={<CheckCircle className="w-5 h-5" />}
            onClick={handleConfirmReceived}
            isLoading={actionLoading}
            disabled={actionLoading}
          >
            Pesanan Diterima
          </Button>
        )}
      </motion.div>
    </div>
  );
}
