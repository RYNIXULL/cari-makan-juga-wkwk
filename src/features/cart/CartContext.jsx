import React, { createContext, useState, useContext } from 'react';
import { useToast } from '../toast/ToastContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { addToast } = useToast();

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    addToast(`"${item.name}" ditambahkan ke keranjang!`, 'success');
  };

  const checkout = async () => {
    if (cart.length === 0) return;
    try {
      const response = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cart, 
          totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) 
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        addToast(`Pesanan berhasil! ID: ${data.data.orderId}`, 'success');
        setCart([]); // Clear cart
      } else {
        addToast(data.message || 'Gagal memproses pesanan', 'error');
      }
    } catch (err) {
      addToast('Koneksi ke backend terputus saat checkout', 'error');
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, checkout, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
