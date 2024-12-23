import app from './index.js';
import { createServer } from 'http';
import connectDB from './config/db.js';
import { configureSocket } from './config/socket.js';
import dotenv from 'dotenv';
import { log } from './utils/logger.js';
import { validateEnv } from './utils/validateEnv.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const startServer = async () => {
  try {
    log.divider();
    log.info('Starting server...');
    
    if (!validateEnv()) {
      throw new Error('Environment validation failed');
    }
    
    await connectDB();
    
    const httpServer = createServer(app);
    configureSocket(httpServer);
    
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      log.success(`Server running on port ${PORT}`);
      log.divider();
    });
  } catch (error) {
    log.error('Failed to start server:');
    log.error(error.message);
    process.exit(1);
  }
};

startServer();