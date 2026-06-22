import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, SearchX, MapPin, Tag, Star, Sun, Heart, 
  ThumbsUp, Bike, Percent, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FoodCard } from '../features/food/components/FoodCard';
import { SearchInput } from '../shared/ui/input/SearchInput';
import { LoadingSkeleton } from '../shared/ui/skeleton/LoadingSkeleton';
import { EmptyState } from '../shared/ui/empty-state/EmptyState';
import { Button } from '../shared/ui/button/Button';
import { useToast } from '../features/toast/ToastContext';
import { GlassCard } from '../shared/ui/card/GlassCard';

// --- MOCK DATA ---
const QUICK_LINKS = [
  { id: 1, title: 'Terdekat', icon: MapPin, color: 'text-green-500', bg: 'bg-green-100' },
  { id: 2, title: 'Cari Promo', icon: Tag, color: 'text-rose-500', bg: 'bg-rose-100' },
  { id: 3, title: 'Terlaris', icon: Star, color: 'text-amber-500', bg: 'bg-amber-100' },
  { id: 4, title: '24 Jam', icon: Sun, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 5, title: 'Pilihan Foodie', icon: Heart, color: 'text-purple-500', bg: 'bg-purple-100' },
];

const CATEGORIES = [
  { id: 1, name: 'Sapi', img: 'https://www.themealdb.com/images/category/beef.png' },
  { id: 2, name: 'Ayam', img: 'https://www.themealdb.com/images/category/chicken.png' },
  { id: 3, name: 'Seafood', img: 'https://www.themealdb.com/images/category/seafood.png' },
  { id: 4, name: 'Sayuran', img: 'https://www.themealdb.com/images/category/vegetarian.png' },
  { id: 5, name: 'Pencuci Mulut', img: 'https://www.themealdb.com/images/category/dessert.png' },
  { id: 6, name: 'Kambing', img: 'https://www.themealdb.com/images/category/lamb.png' },
];

const INFO_CARDS = [
  { 
    id: 1, 
    title: '20,000+ ulasan baru setiap menitnya', 
    img: '/info_reviews.png', 
  },
  { 
    id: 2, 
    title: 'Delivery atau ambil sendiri di resto', 
    img: '/info_delivery.png', 
  },
  { 
    id: 3, 
    title: 'Makan apa aja, promonya ada', 
    img: '/info_promo.png', 
  },
  { 
    id: 4, 
    title: 'Diantar dengan aman & cepat', 
    img: '/info_secure.png', 
  },
];
// -----------------

function Home() {
  const [foods, setFoods] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        setError(null);
        const endpoint = query 
          ? `http://localhost:5000/api/foods/search?q=${query}`
          : 'http://localhost:5000/api/foods/search?q=';
        const response = await fetch(endpoint);
        const json = await response.json();
        setFoods(json.data || []);
      } catch (err) {
        setError('Koneksi ke server terputus.');
        addToast('Gagal memuat data menu. Periksa koneksi Anda.', 'error');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFoods();
    }, 500);

    return () => clearTimeout(timer);
  }, [query, addToast]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow flex flex-col w-full pb-12"
    >
      {/* 1. Hero Section */}
      <div className="relative w-full h-[300px] md:h-[350px] lg:h-[400px] bg-gradient-to-r from-ocean-500 via-ocean-400 to-ocean-600 mb-20 overflow-visible rounded-b-[2rem] md:rounded-b-[3rem] shadow-xl">
        <div className="absolute inset-0 overflow-hidden rounded-b-[2rem] md:rounded-b-[3rem]">
          {/* Abstract background blobs for ocean theme */}
          <div className="absolute top-0 left-10 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-2xl animate-blob"></div>
          <div className="absolute top-0 right-10 w-72 h-72 bg-ocean-300/20 rounded-full mix-blend-overlay filter blur-2xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-cyan-300/20 rounded-full mix-blend-overlay filter blur-2xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 text-center drop-shadow-md">
            Makan enak?
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white/90 text-center drop-shadow-md">
            CariMakan aja.
          </h2>
        </div>

        {/* Floating Search Bar */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-20">
          <div className="bg-white p-2 rounded-2xl md:rounded-full shadow-xl flex flex-col md:flex-row gap-2 border border-slate-100">
            <div className="flex-grow w-full">
               <SearchInput 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)}
                  onClear={() => setQuery('')}
                  placeholder="Cari makanan, restoran, atau area..."
                  className="[&>div:nth-child(2)]:border-none [&>div:nth-child(2)]:bg-transparent"
                />
            </div>
            <Button variant="solid" className="w-full md:w-auto rounded-xl md:rounded-full px-10 h-14 shrink-0 font-bold text-lg bg-ocean-500 hover:bg-ocean-600 border-none shadow-md" onClick={() => {}}>
              Eksplor
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Quick Links Section */}
      <div className="max-w-6xl mx-auto w-full px-4 mb-16 pt-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">Belom ada ide? Mulai dari sini aja dulu</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 justify-center">
          {QUICK_LINKS.map((link) => (
            <GlassCard key={link.id} interactive intensity="light" className="flex flex-col items-center justify-center p-6 text-center hover:-translate-y-1 transition-transform">
              <div className={`w-14 h-14 ${link.bg} rounded-2xl flex items-center justify-center mb-4 shadow-sm`}>
                <link.icon className={`w-7 h-7 ${link.color}`} />
              </div>
              <span className="font-semibold text-slate-700 text-sm md:text-base">{link.title}</span>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* 3. Circular Categories */}
      <div className="max-w-6xl mx-auto w-full px-4 mb-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">Aneka kuliner menarik</h2>
        <div className="flex overflow-x-auto pb-4 gap-6 md:gap-10 justify-start lg:justify-center scrollbar-hide snap-x">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center snap-center shrink-0 group cursor-pointer">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-md border-4 border-white mb-3 group-hover:border-ocean-300 transition-colors">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="font-semibold text-slate-700 text-sm md:text-base">{cat.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
           <Button variant="outline" className="rounded-full bg-ocean-50 text-ocean-700 border-ocean-200 hover:bg-ocean-100 font-semibold px-6">
              Tampilkan kuliner lainnya
           </Button>
        </div>
      </div>

      {/* 4. Food List Section */}
      <div className="max-w-6xl mx-auto w-full px-4 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Apa aja nih yang enak di dekatmu?</h2>
          <p className="text-slate-500 mt-2">Yuk, dicek koleksi makanan populer, favoritnya foodies lokal di lokasimu!</p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingSkeleton count={8} />
            </motion.div>
          ) : error ? (
            <EmptyState 
              key="error"
              icon={AlertCircle}
              title="Gagal Memuat Data"
              description={error}
              action={
                <Button variant="danger" onClick={() => setQuery('')}>Coba Lagi</Button>
              }
            />
          ) : foods.length === 0 ? (
            <EmptyState 
              key="empty"
              icon={SearchX}
              title="Menu Tidak Ditemukan"
              description={`Kami tidak menemukan makanan dengan kata kunci "${query}".`}
              action={
                <Button variant="solid" onClick={() => setQuery('')}>Hapus Pencarian</Button>
              }
            />
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {foods.map((food, idx) => (
                <FoodCard key={food.idMeal} food={food} index={idx} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Info Cards Section */}
      <div className="max-w-6xl mx-auto w-full px-4 mb-8 text-center mt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-10">Kenapa beli pakai CariMakan?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INFO_CARDS.map((info) => (
            <div key={info.id} className="bg-white rounded-3xl h-72 flex flex-col shadow-lg text-left transform transition-transform hover:-translate-y-2 overflow-hidden group">
              <div className="h-44 w-full overflow-hidden flex items-center justify-center">
                <img src={info.img} alt={info.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex-grow flex items-center justify-center">
                <h3 className="text-lg font-bold text-slate-800 leading-snug text-center">
                  {info.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}

export default Home;