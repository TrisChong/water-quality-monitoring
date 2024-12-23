import mongoose from 'mongoose';
import { log } from '../../utils/logger.js';

const CONNECTION_OPTIONS = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxPoolSize: 10,
  retryWrites: true,
  w: 'majority'
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 3000;

export const createConnection = async (uri) => {
  let retries = MAX_RETRIES;
  
  while (retries > 0) {
    try {
      log.info(`Attempting MongoDB connection (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await mongoose.connect(uri, CONNECTION_OPTIONS);
      return mongoose.connection;
    } catch (error) {
      retries--;
      
      if (error.name === 'MongoServerSelectionError') {
        log.error('\nMongoDB Atlas Connection Error:');
        log.error('1. Check if your IP address is whitelisted in MongoDB Atlas');
        log.error('2. Verify the connection string is correct');
        log.error('3. Ensure you have network connectivity');
        log.error(`4. Error details: ${error.message}\n`);
      } else {
        log.error(`Connection error: ${error.message}`);
      }

      if (retries > 0) {
        log.warn(`Retrying in ${RETRY_DELAY/1000} seconds... (${retries} attempts remaining)`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  
  throw new Error('Failed to connect to MongoDB after multiple attempts');
};