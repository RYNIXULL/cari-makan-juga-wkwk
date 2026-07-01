import React, { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/useAuth';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Users, ChevronDown, ChevronUp, Clock, CreditCard, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../features/toast/ToastContext';
import api from '../shared/services/api';
import { Button } from '../shared/ui/button/Button';

const STATUS_CONFIG = {
  pending_payment: { label: 'Menunggu Pembayaran', color: 'bg-amber-100 text-amber-700', icon: Clock },
  paid: { label: 'Dibayar', color: 'bg-blue-100 text-blue-700', icon: CreditCard, action: 'Proses Pesanan', nextStatus: 'processing' },
  processing: { label: 'Diproses', color: 'bg-indigo-100 text-indigo-700', icon: Package, action: 'Kirim Pesanan', nextStatus: 'shipped' },
  shipped: { label: 'Dikirim', color: 'bg-cyan-100 text-cyan-700', icon: Truck, action: 'Tandai Terkirim', nextStatus: 'delivered' },
  delivered: { label: 'Sampai', color: 'bg-teal-100 text-teal-700', icon: CheckCircle },
  completed: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  cancelled: { label: 'Dibatalkan', color: 'bg-rose-100 text-rose-700', icon: XCircle },
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, ordersRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/orders')
      ]);
      setUsers(usersRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    setActionLoading(id);
    try {
      const res = await api.put(`/admin/orders/${id}/status`, { status });
      if (res.status === 'success') {
        addToast(`Status pesanan berhasil diubah ke "${status}".`, 'success');
        fetchData();
      } else {
        addToast(res.message || 'Gagal mengubah status.', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Gagal mengubah status pesanan.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const getConfig = (status) => STATUS_CONFIG[status] || { label: status, color: 'bg-slate-100 text-slate-700', icon: Package };

  // Stats
  const pendingCount = orders.filter(o => o.status === 'pending_payment').length;
  const paidCount = orders.filter(o => o.status === 'paid').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-slate-800 mb-2">Admin Dashboard</h1>
        <p className="text-slate-500 mb-8">Kelola pesanan dan pengguna aplikasi CariMakan</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-amber-50/60 backdrop-blur-xl border border-amber-100 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl"><Clock className="w-5 h-5 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-black text-amber-700">{pendingCount}</p>
                <p className="text-xs text-amber-600 font-medium">Menunggu Bayar</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50/60 backdrop-blur-xl border border-blue-100 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl"><CreditCard className="w-5 h-5 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-black text-blue-700">{paidCount}</p>
                <p className="text-xs text-blue-600 font-medium">Perlu Diproses</p>
              </div>
            </div>
          </div>
          <div className="bg-indigo-50/60 backdrop-blur-xl border border-indigo-100 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl"><Package className="w-5 h-5 text-indigo-600" /></div>
              <div>
                <p className="text-2xl font-black text-indigo-700">{processingCount}</p>
                <p className="text-xs text-indigo-600 font-medium">Sedang Diproses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-ocean-500 text-white shadow-md' : 'bg-white/60 backdrop-blur-xl text-slate-600 hover:bg-white/80'}`}
          >
            <Package className="w-4 h-4" /> Pesanan ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-ocean-500 text-white shadow-md' : 'bg-white/60 backdrop-blur-xl text-slate-600 hover:bg-white/80'}`}
          >
            <Users className="w-4 h-4" /> Pengguna ({users.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Memuat data...</div>
        ) : (
          <div className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl shadow-xl overflow-hidden">
            {activeTab === 'orders' ? (
              <div>
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-200 text-sm font-bold text-slate-600">
                  <div className="col-span-2">ID</div>
                  <div className="col-span-2">Pelanggan</div>
                  <div className="col-span-2">Tanggal</div>
                  <div className="col-span-2">Total</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Aksi</div>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-slate-500">Belum ada pesanan.</div>
                ) : (
                  orders.map((order) => {
                    const config = getConfig(order.status);
                    const StatusIcon = config.icon;
                    const isExpanded = expandedOrder === order.id;
                    return (
                      <div key={order.id} className="border-b border-slate-100 last:border-0">
                        <div
                          className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-white/50 transition-colors cursor-pointer items-center"
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        >
                          <div className="col-span-2 font-mono text-sm text-slate-500">
                            #{order.id.slice(-6)}
                          </div>
                          <div className="col-span-2 text-slate-800 font-semibold text-sm">
                            {order.user?.name || '-'}
                          </div>
                          <div className="col-span-2 text-slate-500 text-sm">
                            {new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                          <div className="col-span-2 text-ocean-600 font-bold text-sm">
                            Rp {order.total.toLocaleString('id-ID')}
                          </div>
                          <div className="col-span-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${config.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {config.label}
                            </span>
                          </div>
                          <div className="col-span-2 flex items-center gap-2">
                            {config.action && (
                              <Button
                                variant="solid"
                                size="sm"
                                className="text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateOrderStatus(order.id, config.nextStatus);
                                }}
                                isLoading={actionLoading === order.id}
                                disabled={actionLoading === order.id}
                              >
                                {config.action}
                              </Button>
                            )}
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </div>
                        </div>

                        {/* Expanded Detail */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-5 pt-1">
                                <div className="bg-slate-50 rounded-2xl p-4">
                                  <p className="text-xs font-bold text-slate-500 mb-2">ITEM PESANAN</p>
                                  <div className="flex flex-col gap-2">
                                    {order.items.map((item, idx) => (
                                      <div key={idx} className="flex items-center gap-3">
                                        <img src={item.mealImage} alt={item.mealName} className="w-10 h-10 rounded-lg object-cover" />
                                        <div className="flex-1">
                                          <p className="text-sm font-medium text-slate-800">{item.mealName}</p>
                                          <p className="text-xs text-slate-500">x{item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-800">
                                          Rp {(25000 * item.quantity).toLocaleString('id-ID')}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                  {order.shippingAddress && (
                                    <div className="mt-3 pt-3 border-t border-slate-200">
                                      <p className="text-xs text-slate-500">Alamat: <span className="text-slate-700">{order.shippingAddress}</span></p>
                                      <p className="text-xs text-slate-500">Pembayaran: <span className="text-slate-700">{order.paymentMethod}</span></p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div>
                <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-slate-200 text-sm font-bold text-slate-600">
                  <div>Nama</div>
                  <div>Email</div>
                  <div>Role</div>
                  <div>Tanggal Daftar</div>
                </div>
                {users.map((u) => (
                  <div key={u.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 px-6 py-4 border-b border-slate-100 hover:bg-white/50 text-sm">
                    <div className="text-slate-800 font-semibold">{u.name}</div>
                    <div className="text-slate-600">{u.email}</div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
