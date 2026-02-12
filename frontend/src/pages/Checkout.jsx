import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';
import useCartStore from '../store/cartStore';

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    full_name: '', phone: '', pincode: '',
    address_line1: '', address_line2: '', city: '', state: '', is_default: false,
  });
  const [placing, setPlacing] = useState(false);
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    API.get('/auth/addresses/').then((res) => {
      const addrs = res.data.results || res.data;
      setAddresses(addrs);
      const def = addrs.find((a) => a.is_default);
      if (def) setSelectedAddress(def.id);
      else if (addrs.length) setSelectedAddress(addrs[0].id);
    });
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/addresses/', newAddr);
      const addr = res.data;
      setAddresses([addr, ...addresses]);
      setSelectedAddress(addr.id);
      setShowNewAddress(false);
      setNewAddr({ full_name: '', phone: '', pincode: '', address_line1: '', address_line2: '', city: '', state: '', is_default: false });
      toast.success('Address added');
    } catch {
      toast.error('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    setPlacing(true);
    try {
      // 1. Create order
      const orderRes = await API.post('/orders/create/', { address_id: selectedAddress });
      const order = orderRes.data;

      // 2. Create Razorpay payment
      const payRes = await API.post('/payments/create/', { order_id: order.id });
      const { razorpay_order_id, razorpay_key, amount, currency } = payRes.data;

      // 3. Open Razorpay checkout
      const options = {
        key: razorpay_key,
        amount,
        currency,
        name: 'fella.io',
        description: `Order ${order.order_id}`,
        order_id: razorpay_order_id,
        handler: async (response) => {
          try {
            await API.post('/payments/verify/', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful!');
            navigate('/orders');
          } catch {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: addresses.find((a) => a.id === selectedAddress)?.full_name || '',
          contact: addresses.find((a) => a.id === selectedAddress)?.phone || '',
        },
        theme: { color: '#000000' },
        modal: { ondismiss: () => setPlacing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to place order');
      setPlacing(false);
    }
  };

  const items = cart?.items || [];
  const subtotal = parseFloat(cart?.total_price || 0);
  const delivery = subtotal >= 999 ? 0 : 49;
  const total = subtotal + delivery;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-black tracking-tight mb-8">CHECKOUT</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Address */}
        <div className="flex-1">
          <h2 className="text-xs font-bold tracking-widest text-muted mb-4">DELIVERY ADDRESS</h2>

          {addresses.length > 0 && (
            <div className="space-y-3 mb-4">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex gap-3 p-4 border cursor-pointer transition-colors ${
                    selectedAddress === addr.id ? 'border-primary bg-surface' : 'border-border'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === addr.id}
                    onChange={() => setSelectedAddress(addr.id)}
                    className="accent-primary mt-1"
                  />
                  <div>
                    <p className="text-sm font-bold">{addr.full_name}</p>
                    <p className="text-xs text-muted mt-1">
                      {addr.address_line1}{addr.address_line2 && `, ${addr.address_line2}`}
                    </p>
                    <p className="text-xs text-muted">{addr.city}, {addr.state} — {addr.pincode}</p>
                    <p className="text-xs text-muted">{addr.phone}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowNewAddress(!showNewAddress)}
            className="text-sm font-bold text-primary hover:underline mb-4"
          >
            + Add New Address
          </button>

          {showNewAddress && (
            <form onSubmit={handleAddAddress} className="border border-border p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input name="full_name" placeholder="Full Name" value={newAddr.full_name} onChange={(e) => setNewAddr({ ...newAddr, full_name: e.target.value })} required className="px-3 py-2 border border-border text-sm focus:outline-none focus:border-primary" />
                <input name="phone" placeholder="Phone" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} required className="px-3 py-2 border border-border text-sm focus:outline-none focus:border-primary" />
              </div>
              <input name="pincode" placeholder="Pincode" value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} required className="w-full px-3 py-2 border border-border text-sm focus:outline-none focus:border-primary" />
              <input name="address_line1" placeholder="Address Line 1" value={newAddr.address_line1} onChange={(e) => setNewAddr({ ...newAddr, address_line1: e.target.value })} required className="w-full px-3 py-2 border border-border text-sm focus:outline-none focus:border-primary" />
              <input name="address_line2" placeholder="Address Line 2 (optional)" value={newAddr.address_line2} onChange={(e) => setNewAddr({ ...newAddr, address_line2: e.target.value })} className="w-full px-3 py-2 border border-border text-sm focus:outline-none focus:border-primary" />
              <div className="grid grid-cols-2 gap-3">
                <input name="city" placeholder="City" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} required className="px-3 py-2 border border-border text-sm focus:outline-none focus:border-primary" />
                <input name="state" placeholder="State" value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} required className="px-3 py-2 border border-border text-sm focus:outline-none focus:border-primary" />
              </div>
              <button type="submit" className="bg-primary text-white px-6 py-2 text-sm font-bold hover:bg-accent transition-colors">
                SAVE ADDRESS
              </button>
            </form>
          )}

          {/* Order Items Summary */}
          <div className="mt-8">
            <h2 className="text-xs font-bold tracking-widest text-muted mb-4">ORDER SUMMARY ({items.length} items)</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="w-12 h-14 bg-surface shrink-0 overflow-hidden">
                    {item.product_image && <img src={item.product_image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{item.product_name}</p>
                    <p className="text-[10px] text-muted">{item.variant_detail?.size} · {item.variant_detail?.color} · Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold shrink-0">₹{item.line_total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Price + Pay */}
        <div className="lg:w-80">
          <div className="border border-border p-6 sticky top-24">
            <h3 className="text-xs font-bold tracking-widest text-muted mb-4">PRICE DETAILS</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className={delivery === 0 ? 'text-green-600' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placing || items.length === 0}
              className="w-full bg-primary text-white py-4 text-sm font-bold tracking-wider mt-6 hover:bg-accent transition-colors disabled:opacity-50"
            >
              {placing ? 'PROCESSING...' : 'PAY NOW'}
            </button>
            <p className="text-[10px] text-muted text-center mt-2">Secured by Razorpay • UPI / Cards / Net Banking</p>
          </div>
        </div>
      </div>
    </div>
  );
}
