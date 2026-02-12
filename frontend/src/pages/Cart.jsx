import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineTrash, HiPlus, HiMinus } from 'react-icons/hi';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore';

export default function Cart() {
  const { cart, fetchCart, updateItem, removeItem, loading } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQty = async (itemId, newQty) => {
    try {
      await updateItem(itemId, newQty);
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId);
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 skeleton rounded" />
          ))}
        </div>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-black tracking-tight mb-2">MY BAG</h1>
      <p className="text-sm text-muted mb-8">{items.length} item{items.length !== 1 ? 's' : ''}</p>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-bold mb-2">Your bag is empty</p>
          <p className="text-sm text-muted mb-6">Looks like you haven't added anything yet.</p>
          <Link
            to="/products"
            className="inline-block bg-primary text-white px-8 py-3 text-sm font-bold tracking-wider hover:bg-accent transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border border-border p-4">
                {/* Image */}
                <div className="w-20 h-24 bg-surface shrink-0 overflow-hidden">
                  {item.product_image ? (
                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted">No img</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold tracking-wider text-muted">{item.product_brand}</p>
                  <Link to={`/products/${item.product_slug}`} className="text-sm font-semibold truncate block hover:underline">
                    {item.product_name}
                  </Link>
                  <p className="text-xs text-muted mt-1">
                    {item.variant_detail?.size} · {item.variant_detail?.color}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Control */}
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() => item.quantity > 1 && handleQty(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <HiMinus className="w-3 h-3" />
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center text-sm font-bold border-x border-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQty(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface transition-colors"
                      >
                        <HiPlus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price + Remove */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold">₹{item.line_total}</span>
                      <button onClick={() => handleRemove(item.id)} className="text-muted hover:text-red-500 transition-colors">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="lg:w-80">
            <div className="border border-border p-6 sticky top-24">
              <h3 className="text-xs font-bold tracking-widest text-muted mb-4">PRICE DETAILS</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total MRP ({items.length} items)</span>
                  <span>₹{cart?.total_price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className={parseFloat(cart?.total_price) >= 999 ? 'text-green-600' : ''}>
                    {parseFloat(cart?.total_price) >= 999 ? 'FREE' : '₹49'}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                  <span>Total Amount</span>
                  <span>
                    ₹{(parseFloat(cart?.total_price || 0) + (parseFloat(cart?.total_price) >= 999 ? 0 : 49)).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary text-white py-4 text-sm font-bold tracking-wider mt-6 hover:bg-accent transition-colors"
              >
                PLACE ORDER
              </button>
              <p className="text-[10px] text-muted text-center mt-2">UPI, Cards, Net Banking accepted</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
