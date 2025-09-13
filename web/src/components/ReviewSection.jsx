import { useState } from 'react';
import useAuthStore from '../state/useAuthStore';

const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <svg
      className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'} ${onClick ? 'cursor-pointer' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
  
const Rating = ({ rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState(0);
  
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon 
            key={i} 
            filled={i < (hoverRating || rating)} 
            onClick={onRatingChange ? () => onRatingChange(i + 1) : undefined}
            onMouseEnter={onRatingChange ? () => setHoverRating(i + 1) : undefined}
            onMouseLeave={onRatingChange ? () => setHoverRating(0) : undefined}
          />
        ))}
      </div>
    );
};

const ReviewSection = ({ reviews, onUpdateReview, onDeleteReview }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [editingReview, setEditingReview] = useState(null);

  const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

  const handleEditClick = (review) => {
    setEditingReview({ ...review });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleSaveEdit = () => {
    if (editingReview) {
        onUpdateReview(editingReview._id, { rating: editingReview.rating, comment: editingReview.comment });
        setEditingReview(null);
    }
  };

  const handleDeleteClick = (reviewId) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
        onDeleteReview(reviewId);
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Customer Reviews</h2>
      
      {reviews.length > 0 && (
        <div className="mt-3 flex items-center">
          <div>
            <div className="flex items-center">
              <Rating rating={averageRating} />
            </div>
            <p className="sr-only">{averageRating.toFixed(1)} out of 5 stars</p>
          </div>
          <p className="ml-2 text-sm text-gray-900 dark:text-white">Based on {reviews.length} reviews</p>
        </div>
      )}

      <div className="mt-6 space-y-10 divide-y divide-gray-200 dark:divide-gray-700 border-b border-gray-200 dark:border-gray-700 pb-10">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="pt-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                    <img src={review.user.avatar || `https://i.pravatar.cc/150?u=${review.user._id}`} alt={review.user.username} className="h-12 w-12 rounded-full" />
                    <div className="ml-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{review.user.username}</h4>
                    {editingReview?._id === review._id ? (
                        <Rating rating={editingReview.rating} onRatingChange={(newRating) => setEditingReview({...editingReview, rating: newRating})} />
                    ) : (
                        <Rating rating={review.rating} />
                    )}
                    </div>
                </div>
                {isAuthenticated && user._id === review.user._id && (
                    <div className="flex gap-4 text-sm">
                        {editingReview?._id === review._id ? (
                            <>
                                <button onClick={handleSaveEdit} className="font-medium text-indigo-600 hover:text-indigo-500">Save</button>
                                <button onClick={handleCancelEdit} className="font-medium text-gray-600 hover:text-gray-500">Cancel</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleEditClick(review)} className="font-medium text-indigo-600 hover:text-indigo-500">Edit</button>
                                <button onClick={() => handleDeleteClick(review._id)} className="font-medium text-red-600 hover:text-red-500">Delete</button>
                            </>
                        )}
                    </div>
                )}
              </div>
              <div className="mt-4 space-y-6 text-base italic text-gray-600 dark:text-gray-400">
                {editingReview?._id === review._id ? (
                    <textarea 
                        value={editingReview.comment}
                        onChange={(e) => setEditingReview({...editingReview, comment: e.target.value})}
                        rows={3}
                        className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                ) : (
                    <p>{review.comment}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="pt-10 text-center text-gray-500 dark:text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
