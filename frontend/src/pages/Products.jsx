import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';

const GENDER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'M', label: 'Men' },
  { value: 'W', label: 'Women' },
  { value: 'U', label: 'Unisex' },
  { value: 'K', label: 'Kids' },
];

const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-discount_percent', label: 'Discount' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Filter state from URL
  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    gender: searchParams.get('gender') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    min_discount: searchParams.get('min_discount') || '',
    ordering: searchParams.get('ordering') || '-created_at',
    page: searchParams.get('page') || '1',
  };

  useEffect(() => {
    API.get('/products/categories/').then((res) => {
      setCategories(res.data.results || res.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    API.get('/products/', { params })
      .then((res) => {
        setProducts(res.data.results || res.data);
        setTotalCount(res.data.count || (res.data.results || res.data).length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => setSearchParams({});

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => v && k !== 'ordering' && k !== 'page'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            {filters.search ? `Results for "${filters.search}"` : 'ALL PRODUCTS'}
          </h1>
          <p className="text-xs text-muted mt-1">{totalCount} items found</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filters.ordering}
            onChange={(e) => updateFilter('ordering', e.target.value)}
            className="text-sm border border-border px-3 py-2 focus:outline-none focus:border-primary bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-1 text-sm font-bold border border-border px-3 py-2"
          >
            <HiOutlineAdjustments className="w-4 h-4" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'} md:block md:relative md:w-56 shrink-0`}>
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h2 className="text-lg font-bold">Filters</h2>
            <button onClick={() => setShowFilters(false)}><HiOutlineX className="w-6 h-6" /></button>
          </div>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="text-xs font-bold text-red-500 mb-4 hover:underline">
              CLEAR ALL FILTERS
            </button>
          )}

          {/* Gender */}
          <div className="mb-6">
            <h3 className="text-xs font-bold tracking-widest text-muted mb-3">GENDER</h3>
            <div className="space-y-2">
              {GENDER_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={filters.gender === opt.value}
                    onChange={() => updateFilter('gender', opt.value)}
                    className="accent-primary"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <h3 className="text-xs font-bold tracking-widest text-muted mb-3">CATEGORY</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={!filters.category}
                  onChange={() => updateFilter('category', '')}
                  className="accent-primary"
                />
                <span className="text-sm">All</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat.slug}
                    onChange={() => updateFilter('category', cat.slug)}
                    className="accent-primary"
                  />
                  <span className="text-sm">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-xs font-bold tracking-widest text-muted mb-3">PRICE RANGE</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.min_price}
                onChange={(e) => updateFilter('min_price', e.target.value)}
                className="w-full px-2 py-2 border border-border text-sm focus:outline-none focus:border-primary"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.max_price}
                onChange={(e) => updateFilter('max_price', e.target.value)}
                className="w-full px-2 py-2 border border-border text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Discount */}
          <div className="mb-6">
            <h3 className="text-xs font-bold tracking-widest text-muted mb-3">DISCOUNT</h3>
            <div className="space-y-2">
              {[10, 20, 30, 50].map((d) => (
                <label key={d} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="discount"
                    checked={filters.min_discount === String(d)}
                    onChange={() => updateFilter('min_discount', String(d))}
                    className="accent-primary"
                  />
                  <span className="text-sm">{d}% and above</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowFilters(false)}
            className="md:hidden w-full bg-primary text-white py-3 text-sm font-bold tracking-wider mt-4"
          >
            APPLY FILTERS
          </button>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted text-sm">No products found.</p>
              <button onClick={clearFilters} className="mt-4 text-sm font-bold underline">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
