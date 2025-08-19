// API Configuration
export const API_CONFIG = {
  // OpenCage Geocoding API
  OPENCAGE: {
    API_KEY: import.meta.env.VITE_OPENCAGE_API_KEY || '',
    BASE_URL: 'https://api.opencagedata.com/geocode/v1/json',
    RATE_LIMIT: 1000, // 1 second between requests
    DAILY_LIMIT: 2500, // Free tier limit
  },
  
  // Fallback coordinates for error cases (Austin, TX)
  FALLBACK_LOCATION: {
    latitude: 30.2672,
    longitude: -97.7431,
    city: "Austin",
    state: "TX"
  }
};

// Environment check utilities
export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;

// API key validation
export const hasValidApiKey = (): boolean => {
  return !!API_CONFIG.OPENCAGE.API_KEY && API_CONFIG.OPENCAGE.API_KEY !== 'your_api_key_here';
};

// Development mode check
export const isUsingMockData = (): boolean => {
  return !hasValidApiKey();
};
