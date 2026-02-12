import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';

export default function ProductCard({ product, onWishlist, isWishlisted }) {
  const img = product.primary_image?.image;

  return (
    <div className="group animate-fadeIn">
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-surface rounded-xl overflow-hidden">
          {img ? (
            <img
              src={img}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm">
              No Image
            </div>
          )}

          {/* Discount badge */}
          {product.discount_percent > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
              {product.discount_percent}% OFF
            </span>
          )}

          {/* Wishlist button */}
          {onWishlist && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onWishlist(product.id);
              }}
              className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
              {isWishlisted ? (
                <HiHeart className="w-4 h-4 text-red-500" />
              ) : (
                <HiOutlineHeart className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <p className="text-xs font-bold tracking-wider text-blue-600 truncate">{product.brand}</p>
          <p className="text-sm text-gray-700 truncate">{product.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">₹{product.selling_price}</span>
            {product.discount_percent > 0 && (
              <>
                <span className="text-xs text-muted line-through">₹{product.price}</span>
                <span className="text-xs text-emerald font-semibold">({product.discount_percent}% off)</span>
              </>
            )}
          </div>
          {product.avg_rating > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs bg-emerald text-white px-1.5 py-0.5 font-bold rounded">{product.avg_rating} ★</span>
              <span className="text-xs text-muted">({product.review_count})</span>
            </div>
          )}
          {/* Color swatches */}
          {product.available_colors?.length > 0 && (
            <div className="flex gap-1 mt-1">
              {product.available_colors.slice(0, 5).map((c, i) => (
                <span
                  key={i}
                  className="w-3.5 h-3.5 rounded-full border border-border"
                  style={{ backgroundColor: c.hex || '#ccc' }}
                  title={c.color}
                />
              ))}
              {product.available_colors.length > 5 && (
                <span className="text-[10px] text-muted self-center">+{product.available_colors.length - 5}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
