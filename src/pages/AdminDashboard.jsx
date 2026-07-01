import React, { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/useAuth';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../shared/services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, ordersRes] = await Promise.all([
        api.get('/admin/users', { headers }),
        api.get('/admin/orders', { headers })
      ]);

      setUsers(usersRes.data.data);
      setOrders(ordersRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/admin/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh data
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-xl"
      >
        <h1 className="text-3xl font-black text-slate-800 mb-8">Admin Dashboard</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'orders' ? 'bg-ocean-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'users' ? 'bg-ocean-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            Manage Users
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === 'orders' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 font-bold text-slate-600">ID Order</th>
                    <th className="py-4 px-4 font-bold text-slate-600">Pelanggan</th>
                    <th className="py-4 px-4 font-bold text-slate-600">Total Harga</th>
                    <th className="py-4 px-4 font-bold text-slate-600">Status</th>
                    <th className="py-4 px-4 font-bold text-slate-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 hover:bg-white/50">
                      <td className="py-4 px-4 font-mono text-sm text-slate-500">{order.id.slice(-6)}</td>
                      <td className="py-4 px-4 text-slate-800 font-semibold">{order.user.name}</td>
                      <td className="py-4 px-4 text-ocean-600 font-bold">Rp {order.total.toLocaleString('id-ID')}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-ocean-500"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-500">Belum ada pesanan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 font-bold text-slate-600">Nama</th>
                    <th className="py-4 px-4 font-bold text-slate-600">Email</th>
                    <th className="py-4 px-4 font-bold text-slate-600">Role</th>
                    <th className="py-4 px-4 font-bold text-slate-600">Tanggal Daftar</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-slate-100 hover:bg-white/50">
                      <td className="py-4 px-4 text-slate-800 font-semibold">{u.name}</td>
                      <td className="py-4 px-4 text-slate-600">{u.email}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 text-sm">
                        {new Date(u.createdAt).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
