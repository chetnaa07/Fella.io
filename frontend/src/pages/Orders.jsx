import { useState, useEffect } from 'react';
import API from '../api/axios';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  RETURNED: 'bg-gray-100 text-gray-800',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/')
      .then((res) => {
        setOrders(res.data.results || res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        {[1, 2, 3].map((i) => <div key={i} className="h-32 skeleton rounded mb-4" />)}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-black tracking-tight mb-8">MY ORDERS</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-border">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-border">
                <div>
                  <p className="text-[10px] text-muted">ORDER ID</p>
                  <p className="text-xs font-mono font-bold">{order.order_id.slice(0, 8)}...</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-1 ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-16 bg-surface shrink-0 overflow-hidden">
                      {item.image_url && <img src={item.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.product_name}</p>
                      <p className="text-xs text-muted">{item.product_brand} · {item.size} · {item.color}</p>
                      <p className="text-xs text-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold shrink-0">₹{item.line_total}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-surface">
                <span className="text-xs text-muted">
                  {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-sm font-black">₹{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
