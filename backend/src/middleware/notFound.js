// 404 Not Found middleware
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: 'Not Found'
  });
}; 