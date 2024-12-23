import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { join } from 'path';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const testConnection = async () => {
  console.log(chalk.blue('\nTesting MongoDB connection...'));
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(chalk.red('❌ MONGODB_URI is not defined in .env file'));
    process.exit(1);
  }

  const uriWithDB = uri.includes('waterquality') ? uri : `${uri}/waterquality`;
  
  try {
    console.log(chalk.gray('\nConnection URI:'), uriWithDB);
    console.log(chalk.yellow('\nAttempting connection...'));
    
    await mongoose.connect(uriWithDB, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    console.log(chalk.green('\n✅ MongoDB connection successful!'));
    console.log(chalk.gray('\nConnection details:'));
    console.log(chalk.gray('- Database:'), mongoose.connection.name);
    console.log(chalk.gray('- Host:'), mongoose.connection.host);
    
    await mongoose.disconnect();
    console.log(chalk.blue('\nConnection closed successfully'));
    process.exit(0);
  } catch (error) {
    console.error(chalk.red('\n❌ MongoDB connection failed!'));
    console.error(chalk.red('Error details:'), error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error(chalk.yellow('\nTroubleshooting steps:'));
      console.error(chalk.yellow('1. Check your network connection'));
      console.error(chalk.yellow('2. Verify the connection string is correct'));
      console.error(chalk.yellow('3. Ensure MongoDB Atlas cluster is running'));
      console.error(chalk.yellow('4. Try connecting from a different network'));
    }
    
    process.exit(1);
  }
};

testConnection();