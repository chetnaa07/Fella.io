import { create } from 'zustand';
import API from '../api/axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('tokens'),
  loading: false,

  register: async (data) => {
    set({ loading: true });
    const res = await API.post('/auth/register/', data);
    localStorage.setItem('tokens', JSON.stringify(res.data.tokens));
    localStorage.setItem('user', JSON.stringify(res.data.user));
    set({ user: res.data.user, isAuthenticated: true, loading: false });
    return res.data;
  },

  login: async (username, password) => {
    set({ loading: true });
    const res = await API.post('/auth/login/', { username, password });
    localStorage.setItem('tokens', JSON.stringify(res.data));
    // Fetch profile after login
    const profile = await API.get('/auth/profile/');
    localStorage.setItem('user', JSON.stringify(profile.data));
    set({ user: profile.data, isAuthenticated: true, loading: false });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    const res = await API.put('/auth/profile/', data);
    localStorage.setItem('user', JSON.stringify(res.data));
    set({ user: res.data });
    return res.data;
  },
}));

export default useAuthStore;
