const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-4 mt-8">
      <button 
        onClick={handlePrevious} 
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-gray-700 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      <button 
        onClick={handleNext} 
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
