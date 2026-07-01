import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock, CreditCard, Truck, CheckCircle, XCircle, Banknote } from 'lucide-react';
import { useAuth } from '../features/auth/useAuth';
import { useToast } from '../features/toast/ToastContext';
import { ordersService } from '../shared/services/orders.service';

const STATUS_CONFIG = {
  pending_payment: { label: 'Menunggu Pembayaran', color: 'bg-amber-100 text-amber-700', icon: Clock },
  paid: { label: 'Dibayar', color: 'bg-blue-100 text-blue-700', icon: CreditCard },
  processing: { label: 'Diproses', color: 'bg-indigo-100 text-indigo-700', icon: Package },
  shipped: { label: 'Dikirim', color: 'bg-cyan-100 text-cyan-700', icon: Truck },
  delivered: { label: 'Sampai', color: 'bg-teal-100 text-teal-700', icon: CheckCircle },
  completed: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  cancelled: { label: 'Dibatalkan', color: 'bg-rose-100 text-rose-700', icon: XCircle },
};

export default function OrdersPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await ordersService.getOrders();
      if (res.status === 'success') {
        setOrders(res.data || []);
      }
    } catch (err) {
      addToast('Gagal memuat riwayat pesanan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  const getStatusConfig = (status) => STATUS_CONFIG[status] || { label: status, color: 'bg-slate-100 text-slate-700', icon: Package };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-slate-800 mb-2">Pesanan Saya</h1>
        <p className="text-slate-500 mb-8">Lacak dan kelola semua pesanan Anda</p>

        {loading ? (
          <div className="text-center py-16 text-slate-500">Memuat riwayat pesanan...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Belum ada pesanan</p>
            <p className="text-sm text-slate-400 mt-1">Pesanan Anda akan muncul di sini</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order, i) => {
              const config = getStatusConfig(order.status);
              const StatusIcon = config.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="bg-white/60 backdrop-blur-xl border border-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-xs text-slate-400 mb-1">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${config.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {config.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.mealImage}
                          alt={item.mealName}
                          className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-sm"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-600 line-clamp-1">
                        {order.items.map(i => i.mealName).join(', ')}
                      </p>
                      <p className="text-xs text-slate-400">{order.items.length} item</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="font-bold text-ocean-600">
                      Rp {order.total.toLocaleString('id-ID')}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-ocean-500 transition-colors" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
