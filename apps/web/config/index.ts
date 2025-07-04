const isProduction = process.env.IS_PRODUCTION === 'true';

export const config = {
  isProduction,
  
  // Server Configuration
  server: {
    url: isProduction 
      ? process.env.NEXT_PUBLIC_SERVER_URL_PROD || 'https://your-production-server.com'
      : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3005',
  },
};

export default config;
