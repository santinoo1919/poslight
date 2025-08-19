import * as SQLite from "expo-sqlite";

class DatabaseService {
  constructor() {
    this.db = null;
    this.init();
  }

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync("poslight.db");
      await this.createTables();
      await this.seedFMCGData();
      console.log("Database initialized successfully! 🎉");
    } catch (error) {
      console.error("Database initialization failed:", error);
    }
  }

  async createTables() {
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        category TEXT NOT NULL,
        barcode TEXT UNIQUE,
        description TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        color TEXT DEFAULT '#3B82F6',
        icon TEXT DEFAULT '📦'
      );
    `;

    const createTransactionsTable = `
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total_amount REAL NOT NULL,
        payment_method TEXT DEFAULT 'cash',
        status TEXT DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createTransactionItemsTable = `
      CREATE TABLE IF NOT EXISTS transaction_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id INTEGER,
        product_id INTEGER,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        total_price REAL NOT NULL,
        FOREIGN KEY (transaction_id) REFERENCES transactions (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      );
    `;

    try {
      await this.db.execAsync(createCategoriesTable);
      await this.db.execAsync(createProductsTable);
      await this.db.execAsync(createTransactionsTable);
      await this.db.execAsync(createTransactionItemsTable);
      console.log("Tables created successfully! 📊");
    } catch (error) {
      console.error("Table creation failed:", error);
    }
  }

  async seedFMCGData() {
    // Check if data already exists
    const { rows } = await this.db.getAllAsync(
      "SELECT COUNT(*) as count FROM products"
    );
    if (rows[0].count > 0) {
      console.log("Database already seeded, skipping... 🚀");
      return;
    }

    // Insert delightful FMCG categories
    const categories = [
      { name: "Beverages", color: "#10B981", icon: "🥤" },
      { name: "Snacks", color: "#F59E0B", icon: "🍿" },
      { name: "Dairy", color: "#8B5CF6", icon: "🥛" },
      { name: "Bakery", color: "#EF4444", icon: "🥖" },
      { name: "Candy", color: "#EC4899", icon: "🍫" },
      { name: "Household", color: "#06B6D4", icon: "🧽" },
      { name: "Personal Care", color: "#84CC16", icon: "🧴" },
      { name: "Frozen", color: "#6366F1", icon: "🧊" },
    ];

    for (const category of categories) {
      await this.db.runAsync(
        "INSERT INTO categories (name, color, icon) VALUES (?, ?, ?)",
        [category.name, category.color, category.icon]
      );
    }

    // Insert delightful FMCG products
    const products = [
      // Beverages
      {
        name: "Coca Cola 330ml",
        price: 2.5,
        stock: 45,
        category: "Beverages",
        barcode: "5000112543211",
      },
      {
        name: "Pepsi Max 330ml",
        price: 2.3,
        stock: 38,
        category: "Beverages",
        barcode: "5000112543212",
      },
      {
        name: "Fanta Orange 330ml",
        price: 2.2,
        stock: 42,
        category: "Beverages",
        barcode: "5000112543213",
      },
      {
        name: "Water Bottle 500ml",
        price: 1.99,
        stock: 67,
        category: "Beverages",
        barcode: "5000112543214",
      },
      {
        name: "Red Bull 250ml",
        price: 3.99,
        stock: 23,
        category: "Beverages",
        barcode: "5000112543215",
      },

      // Snacks
      {
        name: "Lay's Classic Chips",
        price: 1.99,
        stock: 34,
        category: "Snacks",
        barcode: "5000112543216",
      },
      {
        name: "Doritos Nacho Cheese",
        price: 2.49,
        stock: 28,
        category: "Snacks",
        barcode: "5000112543217",
      },
      {
        name: "Pringles Original",
        price: 2.99,
        stock: 19,
        category: "Snacks",
        barcode: "5000112543218",
      },
      {
        name: "Popcorn Sweet & Salty",
        price: 1.79,
        stock: 31,
        category: "Snacks",
        barcode: "5000112543219",
      },
      {
        name: "Nuts Mixed 100g",
        price: 3.49,
        stock: 15,
        category: "Snacks",
        barcode: "5000112543220",
      },

      // Dairy
      {
        name: "Fresh Milk 1L",
        price: 4.99,
        stock: 12,
        category: "Dairy",
        barcode: "5000112543221",
      },
      {
        name: "Greek Yogurt 500g",
        price: 3.99,
        stock: 18,
        category: "Dairy",
        barcode: "5000112543222",
      },
      {
        name: "Cheddar Cheese 200g",
        price: 5.49,
        stock: 9,
        category: "Dairy",
        barcode: "5000112543223",
      },
      {
        name: "Butter 250g",
        price: 3.29,
        stock: 22,
        category: "Dairy",
        barcode: "5000112543224",
      },
      {
        name: "Cream 300ml",
        price: 2.79,
        stock: 16,
        category: "Dairy",
        barcode: "5000112543225",
      },

      // Bakery
      {
        name: "Fresh Bread Loaf",
        price: 3.49,
        stock: 8,
        category: "Bakery",
        barcode: "5000112543226",
      },
      {
        name: "Croissant",
        price: 2.99,
        stock: 14,
        category: "Bakery",
        barcode: "5000112543227",
      },
      {
        name: "Chocolate Muffin",
        price: 2.49,
        stock: 11,
        category: "Bakery",
        barcode: "5000112543228",
      },
      {
        name: "Donut Glazed",
        price: 1.99,
        stock: 19,
        category: "Bakery",
        barcode: "5000112543229",
      },
      {
        name: "Bagel Everything",
        price: 2.79,
        stock: 13,
        category: "Bakery",
        barcode: "5000112543230",
      },

      // Candy
      {
        name: "Snickers Bar",
        price: 1.49,
        stock: 56,
        category: "Candy",
        barcode: "5000112543231",
      },
      {
        name: "KitKat 4-Finger",
        price: 1.79,
        stock: 43,
        category: "Candy",
        barcode: "5000112543232",
      },
      {
        name: "Twix Bar",
        price: 1.59,
        stock: 38,
        category: "Candy",
        barcode: "5000112543233",
      },
      {
        name: "M&M's Chocolate",
        price: 2.19,
        stock: 29,
        category: "Candy",
        barcode: "5000112543234",
      },
      {
        name: "Skittles 100g",
        price: 1.99,
        stock: 35,
        category: "Candy",
        barcode: "5000112543235",
      },
    ];

    for (const product of products) {
      await this.db.runAsync(
        "INSERT INTO products (name, price, stock, category, barcode) VALUES (?, ?, ?, ?, ?)",
        [
          product.name,
          product.price,
          product.stock,
          product.category,
          product.barcode,
        ]
      );
    }

    console.log(`Seeded ${products.length} delightful FMCG products! 🛍️`);
  }

  // Get all products
  async getProducts() {
    try {
      const { rows } = await this.db.getAllAsync(`
        SELECT p.*, c.color, c.icon 
        FROM products p 
        LEFT JOIN categories c ON p.category = c.name 
        ORDER BY p.category, p.name
      `);
      return rows;
    } catch (error) {
      console.error("Failed to get products:", error);
      return [];
    }
  }

  // Search products
  async searchProducts(query) {
    try {
      const { rows } = await this.db.getAllAsync(
        `
        SELECT p.*, c.color, c.icon 
        FROM products p 
        LEFT JOIN categories c ON p.category = c.name 
        WHERE p.name LIKE ? OR p.category LIKE ? OR p.barcode LIKE ?
        ORDER BY p.category, p.name
      `,
        [`%${query}%`, `%${query}%`, `%${query}%`]
      );
      return rows;
    } catch (error) {
      console.error("Search failed:", error);
      return [];
    }
  }

  // Get products by category
  async getProductsByCategory(category) {
    try {
      const { rows } = await this.db.getAllAsync(
        `
        SELECT p.*, c.color, c.icon 
        FROM products p 
        LEFT JOIN categories c ON p.category = c.name 
        WHERE p.category = ?
        ORDER BY p.name
      `,
        [category]
      );
      return rows;
    } catch (error) {
      console.error("Failed to get products by category:", error);
      return [];
    }
  }

  // Get all categories
  async getCategories() {
    try {
      const { rows } = await this.db.getAllAsync(
        "SELECT * FROM categories ORDER BY name"
      );
      return rows;
    } catch (error) {
      console.error("Failed to get categories:", error);
      return [];
    }
  }

  // Update stock
  async updateStock(productId, newStock) {
    try {
      await this.db.runAsync(
        "UPDATE products SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [newStock, productId]
      );
      return true;
    } catch (error) {
      console.error("Failed to update stock:", error);
      return false;
    }
  }
}

export default new DatabaseService();
