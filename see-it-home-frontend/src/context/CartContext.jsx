import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCart(res.data.data);
    } catch (err) {
      console.error('Error fetching cart', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId, quantity = 1, color = null) => {
    try {
      await api.post('/cart', { product_id: productId, quantity, color });
      await fetchCart();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error adding to cart' };
    }
  };

  const updateItem = async (index, quantity) => {
    try {
      await api.put(`/cart/${index}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error('Error updating cart item', err);
    }
  };

  const removeItem = async (index) => {
    try {
      await api.delete(`/cart/${index}`);
      await fetchCart();
    } catch (err) {
      console.error('Error removing cart item', err);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart({ items: [] });
    } catch (err) {
      console.error('Error clearing cart', err);
    }
  };

  const cartCount = (cart?.items || []).reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = (cart?.items || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, loading, cartCount, cartTotal,
      fetchCart, addItem, updateItem, removeItem, clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
