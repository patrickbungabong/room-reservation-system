import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/database.js';
import logger from './src/utils/logger.js';

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    });
  })
  .catch((err) => {
    logger.error('Failed to start server:', err);
    process.exit(1);
  });
