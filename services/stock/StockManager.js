class StockManager {
  constructor(store) {
    this.store = store;
    this.rules = {
      lowStockThreshold: 10,
    };
  }

  // Check if we can sell a product
  canSell(productId, quantity) {
    const currentStock = this.getStockLevel(productId);
    return currentStock >= quantity;
  }

  // Sell a product (decrement stock)
  sellProduct(productId, quantity) {
    if (!this.canSell(productId, quantity)) {
      return false; // Can't sell
    }

    const currentStock = this.getStockLevel(productId);
    const newStock = currentStock - quantity;

    // Update stock in TinyBase
    this.store.setCell("products", productId, "stock", newStock);

    return newStock;
  }

  // Restock a product (increment stock)
  restockProduct(productId, quantity) {
    const currentStock = this.getStockLevel(productId);
    const newStock = currentStock + quantity;

    this.store.setCell("products", productId, "stock", newStock);
    return newStock;
  }

  // Get current stock level
  getStockLevel(productId) {
    return this.store.getCell("products", productId, "stock") || 0;
  }

  // Check if stock is low
  isLowStock(productId) {
    const stock = this.getStockLevel(productId);
    return stock <= this.rules.lowStockThreshold;
  }

  // Get all low stock items
  getLowStockItems() {
    const products = this.store.getTable("products");
    return Object.values(products).filter((product) =>
      this.isLowStock(product.id)
    );
  }

  // Update stock level directly
  updateStock(productId, newStock) {
    this.store.setCell("products", productId, "stock", newStock);
    return newStock;
  }
}

export default StockManager;
