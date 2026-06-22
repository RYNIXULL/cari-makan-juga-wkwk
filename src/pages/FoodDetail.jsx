import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../features/cart/CartContext';
import { useToast } from '../features/toast/ToastContext';
import { ArrowLeft, ShoppingCart, Compass, Info, PlayCircle, Utensils, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

import { GlassCard } from '../shared/ui/card/GlassCard';
import { Button } from '../shared/ui/button/Button';
import { EmptyState } from '../shared/ui/empty-state/EmptyState';

function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/foods/${id}`);
        const json = await response.json();
        if (json.status === 'success') setFood(json.data);
      } catch (err) {
        addToast('Gagal memuat detail makanan.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchFoodDetail();
  }, [id, addToast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-ocean-200 border-t-ocean-500 animate-spin" />
          <div className="absolute inset-0 bg-ocean-500/20 rounded-full blur-xl animate-pulse" />
        </div>
        <p className="mt-6 text-slate-500 font-semibold tracking-wide">Meracik resep...</p>
      </div>
    );
  }

  if (!food) {
    return (
      <EmptyState 
        icon={Info}
        title="Resep Tidak Ditemukan"
        description="Maaf, resep yang Anda cari mungkin telah dihapus atau tidak tersedia."
        action={<Button variant="solid" onClick={() => navigate('/')}>Kembali ke Lautan Rasa</Button>}
      />
    );
  }

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = food[`strIngredient${i}`];
    const measure = food[`strMeasure${i}`];
    if (ing && ing.trim() !== '') {
      ingredients.push({ name: ing, measure });
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-6xl mx-auto w-full flex flex-col gap-8 pb-12"
    >
      {/* Back Button */}
      <Button 
        variant="ghost" 
        leftIcon={<ArrowLeft className="w-5 h-5" />} 
        onClick={() => navigate(-1)}
        className="w-max -ml-2"
      >
        Kembali
      </Button>

      {/* Main Hero Card */}
      <GlassCard intensity="medium" className="overflow-hidden border-white/60">
        <div className="flex flex-col lg:flex-row h-full w-full">
        {/* Left: Image Section */}
        <div className="lg:w-1/2 relative bg-ocean-100/50 min-h-[400px] lg:min-h-[500px]">
          <img 
            src={food.strMealThumb} 
            alt={food.strMeal} 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          {/* Gradient Overlay for Text Readability on Mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent lg:hidden" />
          
          <div className="absolute bottom-8 left-8 lg:hidden">
            <span className="bg-white/30 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm mb-3 inline-block">
              {food.strCategory}
            </span>
            <h1 className="text-4xl font-black text-white drop-shadow-md leading-tight">
              {food.strMeal}
            </h1>
          </div>
        </div>
        
        {/* Right: Content Section */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between bg-white/20 backdrop-blur-md">
          <div>
            <div className="hidden lg:block mb-6">
              <span className="bg-white/50 backdrop-blur-md border border-white/40 text-ocean-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                {food.strCategory}
              </span>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-800 mt-5 leading-tight tracking-tight">
                {food.strMeal}
              </h1>
            </div>
            
            <div className="flex items-center gap-6 text-slate-600 font-medium mb-8">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-ocean-500" />
                <span>Asal: {food.strArea}</span>
              </div>
            </div>
            
            <div className="mb-10">
              <p className="text-4xl font-black text-ocean-500 drop-shadow-sm tracking-tighter">
                Rp 25.000
              </p>
              <p className="text-sm text-slate-500 mt-2 font-medium">Harga estimasi bahan-bahan di pasar</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button 
                variant="solid" 
                size="lg" 
                className="w-full sm:flex-1 text-lg py-4"
                leftIcon={<ShoppingCart className="w-5 h-5" />}
                onClick={() => addToCart({ id: food.idMeal, name: food.strMeal, price: 25000 })}
              >
                Pesan Sekarang
              </Button>
              {food.strYoutube && (
                <Button 
                  variant="glass" 
                  size="lg"
                  className="w-full sm:w-auto text-lg py-4 border-2"
                  onClick={() => window.open(food.strYoutube, '_blank')}
                  leftIcon={<PlayCircle className="w-5 h-5 text-rose-500" />}
                >
                  Video Tutorial
                </Button>
              )}
            </div>
          </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Content Grid: Ingredients & Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ingredients Panel */}
        <GlassCard intensity="medium" className="p-8 lg:col-span-1 h-max">
          <h3 className="font-black text-2xl text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-ocean-100 flex items-center justify-center text-ocean-600">
              <Utensils className="w-5 h-5" />
            </span>
            Komposisi
          </h3>
          <ul className="flex flex-col gap-3">
            {ingredients.map((ing, idx) => (
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                key={idx} 
                className="flex items-center justify-between bg-white/40 backdrop-blur-md border border-white/50 px-4 py-3 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-2 h-2 rounded-full bg-ocean-400 flex-shrink-0" />
                  <span className="font-semibold text-slate-700 truncate">{ing.name}</span>
                </div>
                <span className="text-sm text-slate-500 font-medium whitespace-nowrap ml-4">{ing.measure}</span>
              </motion.li>
            ))}
          </ul>
        </GlassCard>

        {/* Instructions Panel */}
        <GlassCard intensity="medium" className="p-8 lg:p-10 lg:col-span-2">
          <h3 className="font-black text-2xl text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-ocean-100 flex items-center justify-center text-ocean-600">
              <ChefHat className="w-5 h-5" />
            </span>
            Instruksi Pembuatan
          </h3>
          <div className="prose prose-slate prose-lg max-w-none text-slate-700">
            {food.strInstructions.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="mb-6 leading-relaxed text-justify"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </GlassCard>
      </div>

    </motion.div>
  );
}

export default FoodDetail;