import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products/wishlist/')
      .then((res) => {
        setItems(res.data.results || res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRemove = async (wishlistId) => {
    try {
      await API.delete(`/products/wishlist/${wishlistId}/`);
      setItems(items.filter((i) => i.id !== wishlistId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <div key={i} className="aspect-[3/4] skeleton" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-black tracking-tight mb-2">MY WISHLIST</h1>
      <p className="text-sm text-muted mb-8">{items.length} item{items.length !== 1 ? 's' : ''}</p>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <ProductCard product={item.product} />
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 right-2 bg-white border border-border text-xs font-bold px-2 py-1 text-red-500 hover:bg-red-50 transition-colors z-10"
              >
                REMOVE
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
