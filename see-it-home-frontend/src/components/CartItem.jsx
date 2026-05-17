import api from '../api/axios';

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

export default function CartItem({ item, index, onUpdate, onRemove }) {
  const imageUrl = item.image ? mapStorageUrl(item.image) : null;

  const handleQuantityChange = async (newQty) => {
    try {
      if (newQty < 1) return;
      await api.put(`/cart/${index}`, { quantity: newQty });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error updating cart item', err);
    }
  };

  const handleRemove = async () => {
    try {
      await api.delete(`/cart/${index}`);
      if (onRemove) onRemove();
    } catch (err) {
      console.error('Error removing cart item', err);
    }
  };

  return (
    <div className="flex items-center gap-5 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
      {/* Image */}
      <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
        )}
      </div>

      {/* Details */}
      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
        {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
        <p className="text-lg font-bold text-amber-700 mt-1">₹{item.price}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition font-bold text-gray-600"
        >
          −
        </button>
        <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
        <button 
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition font-bold text-gray-600"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right flex-shrink-0 w-24">
        <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
      </div>

      {/* Remove */}
      <button 
        onClick={handleRemove}
        className="text-red-400 hover:text-red-600 transition p-2 rounded-lg hover:bg-red-50 flex-shrink-0"
        title="Remove item"
      >
        ✕
      </button>
    </div>
  );
}
