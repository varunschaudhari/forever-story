export const env = {
  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/forever-story',
  },

  // Application
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'ForeverStory',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Session
  session: {
    secret: process.env.SESSION_SECRET || 'dev-secret',
  },

  // API
  api: {
    url: process.env.API_URL || 'http://localhost:3000/api',
  },

  // Node Environment
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Type-safe environment access
export type EnvConfig = typeof env;
