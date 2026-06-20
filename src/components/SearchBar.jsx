import React from 'react';

function SearchBar({ query, setQuery }) {
  return (
    <div className="max-w-xl mx-auto my-6">
      <div className="relative flex items-center shadow-sm rounded-xl overflow-hidden border border-gray-200 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
        <input
          type="text"
          placeholder="Cari makanan favoritmu..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-5 py-3 pr-12 text-gray-700 outline-none"
        />
        <div className="absolute right-3 bg-blue-600 text-white p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;