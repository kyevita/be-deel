module.exports = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const body = {
    message: err.message,
    stack: err.stack,
  };

  console.error(body);
  res.status(statusCode).json(body);
};
