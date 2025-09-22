// AddProductModal constants and sample data

import type { Step, Category } from "./types";

export const STEPS: Step[] = [
  { id: 1, title: "Category", description: "Choose or create category" },
  { id: 2, title: "Details", description: "Product information" },
  { id: 3, title: "Stock", description: "Pricing and inventory" },
  { id: 4, title: "Review", description: "Confirm and save" },
];

export const SAMPLE_CATEGORIES: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    color: "#3B82F6",
    icon: "phone-portrait-outline",
  },
  {
    id: "clothing",
    name: "Clothing",
    color: "#EF4444",
    icon: "shirt-outline",
  },
  {
    id: "food",
    name: "Food & Beverages",
    color: "#10B981",
    icon: "restaurant-outline",
  },
  {
    id: "home",
    name: "Home & Garden",
    color: "#F59E0B",
    icon: "home-outline",
  },
  {
    id: "books",
    name: "Books & Media",
    color: "#8B5CF6",
    icon: "book-outline",
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    color: "#06B6D4",
    icon: "fitness-outline",
  },
];

export const INITIAL_FORM_DATA = {
  categoryId: "",
  categoryName: "",
  name: "",
  description: "",
  sku: "",
  barcode: "",
  brand: "",
  price: "",
  cost: "",
  initialStock: "",
  images: [],
};
