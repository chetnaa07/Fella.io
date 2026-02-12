import { create } from 'zustand';
import API from '../api/axios';

const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await API.get('/orders/cart/');
      set({ cart: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addToCart: async (variantId, quantity = 1) => {
    const res = await API.post('/orders/cart/add/', {
      variant_id: variantId,
      quantity,
    });
    set({ cart: res.data });
    return res.data;
  },

  updateItem: async (itemId, quantity) => {
    const res = await API.put(`/orders/cart/item/${itemId}/`, { quantity });
    set({ cart: res.data });
    return res.data;
  },

  removeItem: async (itemId) => {
    const res = await API.delete(`/orders/cart/item/${itemId}/`);
    set({ cart: res.data });
    return res.data;
  },

  clearCart: async () => {
    await API.delete('/orders/cart/clear/');
    set({ cart: { items: [], total_items: 0, total_price: 0 } });
  },

  get totalItems() {
    return get().cart?.total_items || 0;
  },
}));

export default useCartStore;
