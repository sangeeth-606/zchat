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
    url: isProduction ? process.env.REDIS_URL_PROD : undefined,
  },
  
  // Kafka Configuration
  kafka: {
    brokers: isProduction 
      ? [process.env.KAFKA_BROKER_PROD || ''] 
      : [process.env.KAFKA_BROKER || 'localhost:9092'],
    ssl: isProduction ? true : false,
    sasl: isProduction ? {
      mechanism: 'plain' as const,
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
