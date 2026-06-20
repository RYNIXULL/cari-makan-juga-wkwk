import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function FoodCard({ food }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col h-full border border-gray-100">
      {/* Gambar Menu */}
      <img 
        src={food.strMealThumb} 
        alt={food.strMeal} 
        className="w-full h-48 object-cover bg-gray-50" 
      />
      
      {/* Detail Konten - flex-grow diganti dengan grow */}
      <div className="p-4 flex flex-col grow">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-1">
          {food.strMeal}
        </h3>
        <p className="text-sm text-gray-400 mb-3">
          {food.strCategory || "Makanan"}
        </p>
        <p className="text-blue-600 font-bold text-md mb-4">
          Rp 25.000
        </p>
        
        {/* Tombol Kontrol Aksi */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Link 
            to={`/detail/${food.idMeal}`} 
            className="text-center px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium transition"
          >
            Detail
          </Link>
          <button 
            onClick={() => addToCart({ id: food.idMeal, name: food.strMeal, price: 25000 })} 
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition shadow-sm"
          >
            Pesan
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;