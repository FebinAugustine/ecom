import ApiError from '../utils/ApiErrors.js';

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // If the error is not an instance of ApiError, create a new one for consistency
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  // Construct a clean response object
  const response = {
    statusCode: error.statusCode,
    data: error.data, // Will be null for errors
    success: false, // Always false for errors
    errors: error.errors,
    message: error.message,
  };

  // Include stack trace only in development mode
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  return res.status(error.statusCode).json(response);
};

export default errorMiddleware;
