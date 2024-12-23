import dotenv from 'dotenv';
import { log } from '../../utils/logger.js';
import { createConnection } from './connection.js';
import { setupConnectionEvents } from './events.js';

dotenv.config();

const connectDB = async () => {
  try {
    log.info('Initializing MongoDB connection...');
    
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Ensure database name is in URI
    const uriWithDB = uri.includes('waterquality') ? uri : `${uri}/waterquality`;
    
    const connection = await createConnection(uriWithDB);
    setupConnectionEvents(connection);
    
    return connection;
  } catch (error) {
    log.error('MongoDB Connection Failed');
    log.error(`Error Details: ${error.message}`);
    throw error;
  }
};

export default connectDB;