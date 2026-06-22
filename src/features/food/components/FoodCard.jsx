import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, MapPin } from 'lucide-react';
import { useCart } from '../../cart/CartContext';
import { GlassCard } from '../../../shared/ui/card/GlassCard';
import { Button } from '../../../shared/ui/button/Button';

export const FoodCard = memo(({ food, index }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <GlassCard 
      interactive 
      intensity="medium" 
      onClick={() => navigate(`/detail/${food.idMeal}`)}
      className="group h-full flex flex-col"
    >
      <div className="relative h-48 md:h-52 overflow-hidden bg-ocean-100/50">
        <img
          src={food.strMealThumb}
          alt={food.strMeal}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/60 backdrop-blur-md border border-white/40 shadow-sm px-3 py-1 text-[10px] font-bold text-ocean-600 uppercase tracking-wider rounded-full">
            {food.strCategory || "Hidangan"}
          </span>
        </div>
        <div className="absolute bottom-2 right-2">
          <span className="bg-white/90 backdrop-blur-md shadow-sm px-2 py-0.5 text-xs font-bold text-slate-700 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.8
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow relative">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-ocean-600 transition-colors">
            {food.strMeal}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-500" />
            <span>{(Math.random() * 5 + 0.5).toFixed(1)} km</span>
            <span className="mx-1">•</span>
            <span>{food.strArea}</span>
            <span className="mx-1">•</span>
            <span className="text-slate-400">$$$</span>
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/20">
          <p className="text-ocean-500 font-black text-xl tracking-tight">
            Rp 25k
          </p>

          <Button
            variant="solid"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart({ id: food.idMeal, name: food.strMeal, price: 25000 });
            }}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </GlassCard>
  );
});

FoodCard.displayName = 'FoodCard';
