import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useToast } from '../toast/ToastContext';
import { GlassCard } from '../../shared/ui/card/GlassCard';
import { Button } from '../../shared/ui/button/Button';
import { motion } from 'framer-motion';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      addToast('Registrasi berhasil! Silakan masuk.', 'success');
      navigate('/login');
    } catch (err) {
      addToast(err.message || 'Registrasi gagal', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center items-center flex-grow py-20">
      <GlassCard intensity="medium" className="w-full max-w-md p-8">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Buat Akun Baru</h2>
        <p className="text-slate-500 mb-8 font-medium">Mulai petualangan kuliner Anda bersama CariMakan.</p>
        
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <input 
            type="text" 
            placeholder="Nama Lengkap" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-ocean-400"
            required
          />
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
            Daftar
          </Button>
        </form>

        <p className="text-center mt-6 text-slate-500 font-medium">
          Sudah punya akun? <Link to="/login" className="text-ocean-600 font-bold hover:underline">Masuk di sini</Link>
        </p>
      </GlassCard>
    </motion.div>
  );
}
