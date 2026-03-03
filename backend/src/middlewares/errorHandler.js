import logger from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error(err.message, { stack: err.stack });

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message).join('; ');
    return res.status(400).json({ success: false, message: messages });
  }

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate field value' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ success: false, message });
}
