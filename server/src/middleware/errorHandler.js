module.exports = (err, req, res, next) => {
  console.error('[Error]', err.stack);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Terjadi kesalahan internal pada server.',
  });
};
