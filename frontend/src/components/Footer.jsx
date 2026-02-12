import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="text-white mt-20" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black tracking-tighter mb-4">fella<span className="text-blue-400">.io</span></h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bold styles & premium fits. Made for men who set trends.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold tracking-widest mb-4 text-gray-400">SHOP</h4>
            <ul className="space-y-2">
              <li><Link to="/products?gender=M" className="text-sm text-gray-300 hover:text-white transition-colors">Men</Link></li>
              <li><Link to="/products?gender=W" className="text-sm text-gray-300 hover:text-white transition-colors">Women</Link></li>
              <li><Link to="/products?gender=K" className="text-sm text-gray-300 hover:text-white transition-colors">Kids</Link></li>
              <li><Link to="/custom-design" className="text-sm text-gray-300 hover:text-white transition-colors">Custom T-Shirts</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-bold tracking-widest mb-4 text-gray-400">HELP</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-300">Track Order</span></li>
              <li><span className="text-sm text-gray-300">Returns & Refunds</span></li>
              <li><span className="text-sm text-gray-300">Size Guide</span></li>
              <li><span className="text-sm text-gray-300">Contact Us</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold tracking-widest mb-4 text-gray-400">CONNECT</h4>
            <p className="text-sm text-gray-300 mb-2">support@fella.io</p>
            <p className="text-sm text-gray-300 mb-4">+91 98765 43210</p>
            <div className="flex gap-4">
              <span className="w-8 h-8 bg-white/10 flex items-center justify-center text-xs hover:bg-white/20 transition-colors cursor-pointer">IG</span>
              <span className="w-8 h-8 bg-white/10 flex items-center justify-center text-xs hover:bg-white/20 transition-colors cursor-pointer">TW</span>
              <span className="w-8 h-8 bg-white/10 flex items-center justify-center text-xs hover:bg-white/20 transition-colors cursor-pointer">FB</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} fella.io — All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-xs text-gray-500">Privacy Policy</span>
            <span className="text-xs text-gray-500">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
