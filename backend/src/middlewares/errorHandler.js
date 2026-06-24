export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode} - ${message}`);
  
  // Optionally log the stack trace in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    message
  });
};
