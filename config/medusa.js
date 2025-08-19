// Medusa Configuration
export const MEDUSA_CONFIG = {
  // Base URL for your Medusa instance
  BASE_URL: process.env.EXPO_PUBLIC_MEDUSA_URL || "http://localhost:9000",

  // API endpoints
  ENDPOINTS: {
    PRODUCTS: "/store/products",
    PRODUCT: "/store/products/:id",
    SEARCH: "/store/products",
  },

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Default headers
  HEADERS: {
    "Content-Type": "application/json",
  },

  // Query parameters for product expansion
  PRODUCT_EXPANSIONS: "variants,variants.inventory_item",

  // Pagination limit
  PRODUCT_LIMIT: 100,
};

// Helper function to get full URL
export const getMedusaUrl = (endpoint) => {
  return `${MEDUSA_CONFIG.BASE_URL}${endpoint}`;
};
