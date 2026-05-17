export default function ReviewCard({ review }) {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
            {(review.user_name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{review.user_name || 'Anonymous'}</p>
            <p className="text-xs text-gray-400">
              {review.created_at ? new Date(review.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
            </p>
          </div>
        </div>
        <span className="text-yellow-500 font-bold text-sm tracking-wide">{stars}</span>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
}
