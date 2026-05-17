import { Link } from 'react-router-dom';

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

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id || product.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform group-hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images && product.images[0] ? (
            <img 
              src={mapStorageUrl(product.images[0])} 
              alt={product.name} 
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {product.model_url && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-md shadow flex items-center gap-1">
              <span className="text-amber-700">3D</span> / <span className="text-orange-600">AR</span>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{product.category}</p>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-xl font-bold text-amber-700 mt-auto">₹{product.price}</p>
        </div>
      </div>
    </Link>
  );
}
