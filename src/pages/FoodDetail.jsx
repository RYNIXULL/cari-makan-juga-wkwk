import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function FoodDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        if (data.meals) setFood(data.meals[0]);
      } catch (err) {
        console.error(err);
      } {
        setLoading(false);
      }
    };
    fetchFoodDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!food) return <p className="text-center text-gray-400 py-10">Detail menu kosong.</p>;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (food[`strIngredient${i}`]) {
      ingredients.push(`${food[`strIngredient${i}`]} - ${food[`strMeasure${i}`]}`);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-4xl mx-auto border border-gray-100">
      <div className="md:flex">
        <div className="md:w-1/2 relative">
<img src={food.strMealThumb} alt={food.strMeal} className="w-full h-full object-cover min-h-72" />
          <Link to="/" className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:bg-white text-gray-700">
            ← Kembali
          </Link>
        </div>
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">{food.strCategory}</span>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">{food.strMeal}</h2>
            <p className="text-sm text-gray-400 mb-4">Kategori Wilayah: {food.strArea}</p>
            <p className="text-xl font-bold text-blue-600 mb-4">Rp 25.000</p>
            
            <div className="mb-4">
              <h4 className="font-bold text-gray-700 mb-1">Bahan Masakan (Ingredients):</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-0.5">
                {ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
              </ul>
            </div>
          </div>
          <button onClick={() => addToCart({ id: food.idMeal, name: food.strMeal, price: 25000 })} className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition shadow-md">
            Tambah ke Keranjang
          </button>
        </div>
      </div>
      <div className="p-6 border-t border-gray-50 bg-gray-50/50">
        <h4 className="font-bold text-gray-700 mb-1">Cara Pembuatan:</h4>
        <p className="text-sm text-gray-600 leading-relaxed text-justify whitespace-pre-line">{food.strInstructions}</p>
      </div>
    </div>
  );
}

export default FoodDetail;