import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineTruck, HiOutlineCreditCard, HiOutlineRefresh, HiOutlineShieldCheck } from 'react-icons/hi';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/products/featured/'),
      API.get('/products/categories/'),
    ]).then(([featRes, catRes]) => {
      setFeatured(featRes.data.results || featRes.data);
      setCategories(catRes.data.results || catRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categoryIcons = {
    'T-Shirts': '👕',
    'Shirts': '🎽',
    'Jeans': '👖',
    'Jackets': '🧥',
    'Hoodies': '🧤',
    'Shorts': '🩳',
  };

  return (
    <div>
      {/* Hero Section — Bold gradient */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #1e3a5f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-36 flex flex-col items-center text-center relative z-10">
          <span className="inline-block bg-blue-500/20 text-blue-400 text-xs font-bold tracking-widest px-4 py-1.5 rounded-full mb-6 animate-fadeIn">
            NEW DROPS EVERY WEEK
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white animate-slideUp">
            WEAR YOUR
            <br />
            <span className="text-gradient">IDENTITY</span>
          </h1>
          <p className="mt-6 text-sm md:text-base text-slate-400 max-w-md animate-fadeIn">
            Bold styles. Premium fits. Made for men who set trends.
          </p>
          <div className="mt-10 flex gap-4 animate-fadeIn">
            <Link
              to="/products"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3.5 text-sm font-bold tracking-wider rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              SHOP NOW
            </Link>
            <Link
              to="/custom-design"
              className="border border-white/30 text-white px-8 py-3.5 text-sm font-bold tracking-wider rounded-lg hover:bg-white/10 transition-all"
            >
              CUSTOMIZE
            </Link>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
      </section>

      {/* USP Strip */}
      <section className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <HiOutlineTruck className="w-5 h-5 text-blue-500" />, title: 'Free Delivery', desc: 'On orders above ₹999' },
            { icon: <HiOutlineCreditCard className="w-5 h-5 text-emerald" />, title: 'UPI Payments', desc: 'GPay, PhonePe, Paytm' },
            { icon: <HiOutlineRefresh className="w-5 h-5 text-amber" />, title: 'Easy Returns', desc: '7-day return policy' },
            { icon: <HiOutlineShieldCheck className="w-5 h-5 text-indigo" />, title: 'Premium Quality', desc: '100% cotton, 220 GSM' },
          ].map((usp) => (
            <div key={usp.title} className="flex items-center gap-3">
              <div className="shrink-0">{usp.icon}</div>
              <div>
                <h3 className="text-xs font-bold tracking-wide">{usp.title}</h3>
                <p className="text-[11px] text-muted">{usp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-black tracking-tight mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group relative rounded-xl overflow-hidden aspect-square bg-gradient-to-br from-slate-100 to-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-2"
            >
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <span className="text-4xl">{categoryIcons[cat.name] || '🛍️'}</span>
              )}
              <span className="relative z-10 text-sm font-bold tracking-wide text-primary">{cat.name}</span>
              <span className="text-[10px] text-muted">{cat.product_count} items</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured / Trending Products */}
      <section className="bg-surface py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Trending Now 🔥</h2>
              <p className="text-sm text-muted mt-1">Most popular picks this week</p>
            </div>
            <Link to="/products" className="text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* Custom T-shirt Banner */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1">
            <span className="inline-block bg-amber/20 text-amber text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-4">
              CUSTOM PRINTS
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-white">
              Design Your Own
              <br />
              <span className="text-blue-400">Custom Tee</span>
            </h2>
            <p className="mt-4 text-sm text-slate-400 max-w-md">
              Upload your artwork, choose placement, pick your color. Premium custom T-shirts starting at ₹799.
            </p>
            <Link
              to="/custom-design"
              className="inline-block mt-8 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-sm font-bold tracking-wider rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              START DESIGNING →
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-72 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <span className="text-5xl">👕</span>
                <p className="text-sm text-slate-400 mt-3">Your Design Here</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      </section>
    </div>
  );
}
