import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineHeart, HiOutlineUser, HiOutlineSearch, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const cart = useCartStore((s) => s.cart);
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/products?gender=M', label: 'MEN' },
    { to: '/products?gender=W', label: 'WOMEN' },
    { to: '/products?gender=K', label: 'KIDS' },
    { to: '/products?category=t-shirts', label: 'T-SHIRTS' },
    { to: '/custom-design', label: 'CUSTOMIZE' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <span className="text-2xl font-black tracking-tighter">fella</span>
            <span className="text-xs font-bold text-blue-500">.io</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-xs font-bold tracking-wider text-primary hover:text-muted transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products, brands..."
                className="w-full pl-10 pr-4 py-2 bg-surface border border-border text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-1 text-primary hover:text-muted transition-colors"
                >
                  <HiOutlineUser className="w-5 h-5" />
                  <span className="hidden lg:block text-xs font-semibold">{user?.first_name || 'Profile'}</span>
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border shadow-lg animate-fadeIn">
                    <Link to="/profile" onClick={() => setUserMenu(false)} className="block px-4 py-3 text-sm hover:bg-surface transition-colors border-b border-border">My Profile</Link>
                    <Link to="/orders" onClick={() => setUserMenu(false)} className="block px-4 py-3 text-sm hover:bg-surface transition-colors border-b border-border">My Orders</Link>
                    <Link to="/wishlist" onClick={() => setUserMenu(false)} className="block px-4 py-3 text-sm hover:bg-surface transition-colors border-b border-border">Wishlist</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-surface transition-colors">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-xs font-bold tracking-wider hover:text-muted transition-colors">LOGIN</Link>
            )}

            <Link to="/wishlist" className="text-primary hover:text-muted transition-colors">
              <HiOutlineHeart className="w-5 h-5" />
            </Link>

            <Link to="/cart" className="relative text-primary hover:text-muted transition-colors">
              <HiOutlineShoppingBag className="w-5 h-5" />
              {cart?.total_items > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.total_items}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-primary">
              {mobileOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white animate-fadeIn">
          <form onSubmit={handleSearch} className="px-4 py-3">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-surface border border-border text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-bold tracking-wider border-t border-border hover:bg-surface transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
