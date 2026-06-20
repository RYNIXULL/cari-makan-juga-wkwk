import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import FoodDetail from './pages/FoodDetail';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <Header />
{/* Ubah flex-grow menjadi grow */}
<main className="grow container mx-auto px-4 py-6">
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/detail/:id" element={<FoodDetail />} />
  </Routes>
</main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;