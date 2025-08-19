import { MEDUSA_CONFIG, getMedusaUrl } from "../config/medusa";

class MedusaApiService {
  constructor() {
    this.baseUrl = MEDUSA_CONFIG.BASE_URL;
    this.isOnline = true;
  }

  // Check if we're online
  async checkConnection() {
    try {
      const response = await fetch(
        getMedusaUrl(MEDUSA_CONFIG.ENDPOINTS.PRODUCTS),
        {
          method: "GET",
          headers: MEDUSA_CONFIG.HEADERS,
          timeout: MEDUSA_CONFIG.TIMEOUT,
        }
      );
      this.isOnline = response.ok;
      return this.isOnline;
    } catch (error) {
      console.log("Medusa connection failed:", error.message);
      this.isOnline = false;
      return false;
    }
  }

  // Fetch all products with stock information
  async getProducts() {
    try {
      const url = `${getMedusaUrl(MEDUSA_CONFIG.ENDPOINTS.PRODUCTS)}?limit=${MEDUSA_CONFIG.PRODUCT_LIMIT}&expand=${MEDUSA_CONFIG.PRODUCT_EXPANSIONS}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform Medusa data to our format
      return data.products.map((product) => {
        const variant = product.variants?.[0]; // Get first variant
        const inventoryItem = variant?.inventory_item;

        return {
          id: product.id,
          name: product.title,
          price: variant?.prices?.[0]?.amount / 100 || 0, // Convert from cents
          stock: inventoryItem?.inventory_quantity || 0,
          category: product.collection?.title || "Uncategorized",
          description: product.description,
          thumbnail: product.thumbnail,
          handle: product.handle,
          variantId: variant?.id,
          inventoryItemId: inventoryItem?.id,
        };
      });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw error;
    }
  }

  // Get product by ID
  async getProduct(productId) {
    try {
      const url = `${getMedusaUrl(MEDUSA_CONFIG.ENDPOINTS.PRODUCT.replace(":id", productId))}?expand=${MEDUSA_CONFIG.PRODUCT_EXPANSIONS}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const product = await response.json();
      const variant = product.variants?.[0];
      const inventoryItem = variant?.inventory_item;

      return {
        id: product.id,
        name: product.title,
        price: variant?.prices?.[0]?.amount / 100 || 0,
        stock: inventoryItem?.inventory_quantity || 0,
        category: product.collection?.title || "Uncategorized",
        description: product.description,
        thumbnail: product.thumbnail,
        handle: product.handle,
        variantId: variant?.id,
        inventoryItemId: inventoryItem?.id,
      };
    } catch (error) {
      console.error("Failed to fetch product:", error);
      throw error;
    }
  }

  // Search products
  async searchProducts(query) {
    try {
      const url = `${getMedusaUrl(MEDUSA_CONFIG.ENDPOINTS.SEARCH)}?q=${encodeURIComponent(query)}&limit=${MEDUSA_CONFIG.PRODUCT_LIMIT}&expand=${MEDUSA_CONFIG.PRODUCT_EXPANSIONS}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data.products.map((product) => {
        const variant = product.variants?.[0];
        const inventoryItem = variant?.inventory_item;

        return {
          id: product.id,
          name: product.title,
          price: variant?.prices?.[0]?.amount / 100 || 0,
          stock: inventoryItem?.inventory_quantity || 0,
          category: product.collection?.title || "Uncategorized",
          description: product.description,
          thumbnail: product.thumbnail,
          handle: product.handle,
          variantId: variant?.id,
          inventoryItemId: inventoryItem?.id,
        };
      });
    } catch (error) {
      console.error("Failed to search products:", error);
      throw error;
    }
  }

  // Get connection status
  getConnectionStatus() {
    return this.isOnline;
  }
}

export default new MedusaApiService();
