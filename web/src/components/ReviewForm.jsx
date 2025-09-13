import { useState } from 'react';

const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    className={`w-6 h-6 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`}
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

const ReviewForm = ({ onSubmit, isLoading }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0 && comment) {
      onSubmit({ rating, comment });
      setRating(0);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-lg">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Write a review</h3>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, index) => (
            <StarIcon
              key={index}
              filled={index < (hoverRating || rating)}
              onClick={() => setRating(index + 1)}
              onMouseEnter={() => setHoverRating(index + 1)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Comment</label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      <div className="mt-4">
        <button
          type="submit"
          disabled={isLoading || rating === 0 || !comment}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          {isLoading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
