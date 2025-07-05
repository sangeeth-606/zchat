import fs from 'fs';
import path from 'path';

const isProduction = process.env.IS_PRODUCTION === 'true';

export const config = {
  isProduction,
  
  // Database Configuration
  database: {
    url: isProduction ? process.env.DATABASE_URL_PROD : process.env.DATABASE_URL,
  },
  
  // Redis Configuration
  redis: {
    host: isProduction ? undefined : process.env.REDIS_HOST || 'localhost',
    port: isProduction ? undefined : parseInt(process.env.REDIS_PORT || '6379'),
    url: isProduction ? process.env.REDIS_URL_PROD : "",
  },
  
  // Kafka Configuration
  kafka: {
    brokers: isProduction 
      ? [process.env.KAFKA_BROKER_PROD || ''] 
      : [process.env.KAFKA_BROKER || 'localhost:9092'],
    ssl: isProduction ? {
      ca: [fs.readFileSync('/etc/secrets/ca.pem', 'utf8')],
    } : false,
    sasl: isProduction ? {
      mechanism: 'scram-sha-256' as const,
      username: process.env.KAFKA_SASL_USERNAME || '',
      password: process.env.KAFKA_SASL_PASSWORD || '',
    } : undefined,
  },
  
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '3005'),
  },
};

export default config;
