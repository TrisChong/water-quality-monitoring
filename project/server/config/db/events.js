import { log } from '../../utils/logger.js';

export const setupConnectionEvents = (connection) => {
  // Connection successful
  connection.on('connected', () => {
    log.success('MongoDB connection established');
    log.info(`Connected to database: ${connection.name}`);
    log.info(`Host: ${connection.host}`);
  });

  // Connection error
  connection.on('error', (err) => {
    log.error(`MongoDB connection error: ${err.message}`);
  });

  // Connection lost
  connection.on('disconnected', () => {
    log.warn('MongoDB connection lost. Attempting to reconnect...');
  });

  // Clean shutdown
  process.on('SIGINT', async () => {
    try {
      await connection.close();
      log.info('MongoDB connection closed through app termination');
      process.exit(0);
    } catch (err) {
      log.error(`Error during connection closure: ${err.message}`);
      process.exit(1);
    }
  });
};