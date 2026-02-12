import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HiOutlineHeart, HiHeart, HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../api/axios';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    API.get(`/products/${slug}/`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const availableSizes = product
    ? [...new Set(product.variants.filter((v) => !selectedColor || v.color === selectedColor).map((v) => v.size))]
    : [];

  const availableColors = product
    ? [...new Map(product.variants.filter((v) => !selectedSize || v.size === selectedSize).map((v) => [v.color, v])).values()]
    : [];

  const selectedVariant = product?.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first');
      return;
    }
    if (!selectedVariant) {
      toast.error('Please select size and color');
      return;
    }
    if (!selectedVariant.in_stock) {
      toast.error('This variant is out of stock');
      return;
    }
    try {
      await addToCart(selectedVariant.id);
      toast.success('Added to bag!');
    } catch {
      toast.error('Failed to add to bag');
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first');
      return;
    }
    try {
      if (wishlisted) {
        // Would need wishlist ID — simplified
        setWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await API.post('/products/wishlist/', { product_id: product.id });
        setWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Already in wishlist');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-[3/4] skeleton" />
          <div className="space-y-4">
            <div className="h-4 w-24 skeleton rounded" />
            <div className="h-6 w-64 skeleton rounded" />
            <div className="h-4 w-32 skeleton rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-muted">Product not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col gap-2 w-16">
            {product.images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(i)}
                className={`aspect-square overflow-hidden border-2 transition-colors ${
                  selectedImage === i ? 'border-primary' : 'border-border'
                }`}
              >
                <img src={img.image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 aspect-[3/4] bg-surface overflow-hidden">
            {product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage].image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">No Image</div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm font-bold tracking-wider text-muted">{product.brand}</p>
          <h1 className="text-2xl font-bold mt-1">{product.name}</h1>

          {/* Rating */}
          {product.avg_rating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1 bg-green-600 text-white text-xs px-2 py-0.5 font-bold">
                {product.avg_rating} <HiStar className="w-3 h-3" />
              </span>
              <span className="text-sm text-muted">{product.review_count} ratings</span>
            </div>
          )}

          {/* Price */}
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black">₹{product.selling_price}</span>
              {product.discount_percent > 0 && (
                <>
                  <span className="text-lg text-muted line-through">₹{product.price}</span>
                  <span className="text-sm text-green-600 font-bold">({product.discount_percent}% OFF)</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted mt-1">inclusive of all taxes</p>
          </div>

          {/* Color Selection */}
          <div className="mt-6">
            <h3 className="text-xs font-bold tracking-widest text-muted mb-3">
              SELECT COLOR {selectedColor && `— ${selectedColor}`}
            </h3>
            <div className="flex gap-2">
              {availableColors.map((v) => (
                <button
                  key={v.color}
                  onClick={() => setSelectedColor(v.color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === v.color ? 'border-primary scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: v.color_hex || '#ccc' }}
                  title={v.color}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mt-6">
            <h3 className="text-xs font-bold tracking-widest text-muted mb-3">SELECT SIZE</h3>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const variant = product.variants.find(
                  (v) => v.size === size && (!selectedColor || v.color === selectedColor)
                );
                const outOfStock = variant && !variant.in_stock;
                return (
                  <button
                    key={size}
                    onClick={() => !outOfStock && setSelectedSize(size)}
                    disabled={outOfStock}
                    className={`w-12 h-12 border text-sm font-bold transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : outOfStock
                        ? 'border-border text-muted line-through cursor-not-allowed'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-white py-4 text-sm font-bold tracking-wider hover:bg-accent transition-colors"
            >
              ADD TO BAG
            </button>
            <button
              onClick={handleWishlist}
              className="w-14 border border-border flex items-center justify-center hover:border-primary transition-colors"
            >
              {wishlisted ? (
                <HiHeart className="w-5 h-5 text-red-500" />
              ) : (
                <HiOutlineHeart className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Delivery info */}
          <div className="mt-6 border-t border-border pt-4 space-y-2">
            <p className="text-sm font-bold">DELIVERY OPTIONS</p>
            <p className="text-xs text-muted">Free delivery on orders above ₹999</p>
            <p className="text-xs text-muted">Cash on Delivery available</p>
            <p className="text-xs text-muted">Easy 7-day returns and exchanges</p>
          </div>

          {/* Description */}
          <div className="mt-6 border-t border-border pt-4">
            <h3 className="text-sm font-bold mb-2">PRODUCT DETAILS</h3>
            <p className="text-sm text-muted leading-relaxed">{product.description}</p>
          </div>

          {/* Reviews */}
          {product.reviews?.length > 0 && (
            <div className="mt-6 border-t border-border pt-4">
              <h3 className="text-sm font-bold mb-4">CUSTOMER REVIEWS ({product.review_count})</h3>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 font-bold">{review.rating}★</span>
                      <span className="text-xs text-muted">{review.username}</span>
                    </div>
                    {review.title && <p className="text-sm font-semibold mt-1">{review.title}</p>}
                    {review.comment && <p className="text-xs text-muted mt-1">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
