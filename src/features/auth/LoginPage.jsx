import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useToast } from '../toast/ToastContext';
import { GlassCard } from '../../shared/ui/card/GlassCard';
import { Button } from '../../shared/ui/button/Button';
import { motion } from 'framer-motion';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addToast('Berhasil masuk!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.message || 'Login gagal', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center items-center flex-grow py-20">
      <GlassCard intensity="medium" className="w-full max-w-md p-8">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Selamat Datang Kembali</h2>
        <p className="text-slate-500 mb-8 font-medium">Masuk untuk melanjutkan petualangan kuliner Anda.</p>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-ocean-400"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-ocean-400"
            required
          />
          <Button type="submit" variant="solid" isLoading={loading} className="w-full py-3 mt-2">
            Masuk
          </Button>
        </form>

        <p className="text-center mt-6 text-slate-500 font-medium">
          Belum punya akun? <Link to="/register" className="text-ocean-600 font-bold hover:underline">Daftar sekarang</Link>
        </p>
      </GlassCard>
    </motion.div>
  );
}
