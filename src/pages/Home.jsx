import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import FoodCard from '../components/FoodCard';

function Home() {
  const [foods, setFoods] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        setError(false);
        const searchTerm = query ? query : 's'; // Default pencarian kata kunci huruf awal 's' jika kosong
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        const data = await response.json();
        
        setFoods(data.meals || []);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchFoods();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
        <p className="text-gray-400 text-sm">Sedang Memuat Menu Restoran...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 max-w-sm mx-auto">
        <p className="text-red-500 font-bold text-lg">⚠️ Gagal Memuat Data</p>
        <p className="text-gray-400 text-sm mt-1">Periksa kembali koneksi internetmu.</p>
      </div>
    );
  }

  return (
    <div>
      <SearchBar query={query} setQuery={setQuery} />
      {foods.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Makanan tidak ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foods.map((food) => (
            <FoodCard key={food.idMeal} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;