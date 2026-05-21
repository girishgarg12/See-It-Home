import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import ARViewer from '../components/ARViewer';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const mapStorageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  let cleanPath = path;
  if (cleanPath.startsWith('/storage/')) {
    cleanPath = cleanPath.substring(9);
  } else if (cleanPath.startsWith('storage/')) {
    cleanPath = cleanPath.substring(8);
  } else if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  return `/storage/${cleanPath}`;
};

export default function ProductDetail() {
  const { id }                    = useParams();
  const { user }                  = useAuth();
  const { addItem }               = useCart();
  const [product, setProduct]     = useState(null);
  const [quantity, setQuantity]   = useState(1);
  const [selectedColor, setColor] = useState('');
  const [message, setMessage]     = useState('');
  const [wishlistMessage, setWishlistMessage] = useState('');
  
  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`).then(res => {
      setProduct(res.data.data);
      setColor(res.data.data.colors?.[0] || '');
    });
    fetchReviews();
  }, [id]);

  const fetchReviews = () => {
    api.get(`/products/${id}/reviews`).then(res => {
      setReviews(res.data.data);
    });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return setReviewMsg('Please log in to review');
    try {
      await api.post(`/products/${id}/reviews`, newReview);
      setNewReview({ rating: 5, comment: '' });
      setReviewMsg('Review submitted!');
      fetchReviews();
      // Update local product rating count
      api.get(`/products/${id}`).then(res => setProduct(res.data.data));
    } catch (err) {
      setReviewMsg('Error submitting review');
    }
  };

  const handleAddToCart = async () => {
    if (!user) return setMessage('Please log in first');
    const result = await addItem(id, quantity, selectedColor);
    setMessage(result.success ? 'Added to cart!' : result.message);
  };

  const toggleWishlist = async () => {
    try {
      if (!user) return setWishlistMessage('Please log in first');
      const res = await api.post(`/wishlist/${id}`);
      setWishlistMessage(res.data.message);
    } catch (err) {
      setWishlistMessage('Error updating wishlist');
    }
  };

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left — 3D / AR Viewer */}
      <div>
        <ARViewer modelUrl={mapStorageUrl(product.model_url)} productName={product.name} />
        {/* Image gallery */}
        <div className="flex gap-2 mt-4">
          {product.images?.map((img, i) => (
            <img key={i} src={mapStorageUrl(img)} className="w-20 h-20 object-cover rounded border" />
          ))}
        </div>
      </div>

      {/* Right — Product Info */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.review_count > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-500 font-bold">★ {product.average_rating}</span>
              <span className="text-gray-500 text-sm">({product.review_count} reviews)</span>
            </div>
          )}
        </div>
        <p className="text-2xl font-semibold text-gray-800">₹{product.price}</p>
        <p className="text-gray-600">{product.description}</p>

        <div>
          <p className="font-medium mb-1">Material: {product.material}</p>
          {product.dimensions && (
            <p className="font-medium">
              Dimensions: {typeof product.dimensions === 'string' 
                ? product.dimensions 
                : `${product.dimensions.length || ''} × ${product.dimensions.width || ''} × ${product.dimensions.height || ''} ${product.dimensions.unit || ''}`}
            </p>
          )}
        </div>

        {/* Color selector */}
        {product.colors?.length > 0 && (
          <div>
            <p className="font-medium mb-2">Color:</p>
            <div className="flex gap-2">
              {product.colors.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-3 py-1 rounded border ${selectedColor === c ? 'border-black font-bold' : 'border-gray-300'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 border rounded">-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 border rounded">+</button>
        </div>

        {message && <p className="text-green-600 font-medium">{message}</p>}
        {wishlistMessage && <p className="text-red-500 font-medium">{wishlistMessage}</p>}

        <div className="flex gap-4">
          <button onClick={handleAddToCart} className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition">
            Add to Cart
          </button>
          <button onClick={toggleWishlist} className="px-4 py-3 border border-black rounded-lg hover:bg-gray-50 transition text-red-500 font-medium">
            ♡ Wishlist
          </button>
        </div>

        <p className="text-sm text-gray-500">
          {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
        </p>
      </div>

      {/* Bottom — Reviews Section */}
      <div className="col-span-1 md:col-span-2 mt-10 pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map(review => (
                <ReviewCard key={review._id} review={review} />
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h3 className="text-lg font-bold mb-4">Write a Review</h3>
            {user ? (
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select 
                    value={newReview.rating} 
                    onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                  >
                    {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                  <textarea 
                    required
                    rows="3"
                    value={newReview.comment}
                    onChange={e => setNewReview({...newReview, comment: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                    placeholder="What did you think about this product?"
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-black text-white font-medium py-2 rounded-lg hover:bg-gray-800 transition">
                  Submit Review
                </button>
                {reviewMsg && <p className="text-sm font-medium text-amber-700 mt-2">{reviewMsg}</p>}
              </form>
            ) : (
              <p className="text-gray-500 text-sm">Please log in to leave a review.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
