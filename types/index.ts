export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  categoryName: string;
  color: string;
  icon: string;
  barcode: string;
  description: string;
}

export interface Category {
  key: string;
  name: string;
  color: string;
  icon: string;
}

export interface QuickAccessView {
  id: "most-bought" | "low-stock" | "coming-in" | "trending";
  title: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

export interface QuickAccessSectionProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  selectedProductForQuantity: Product | null;
}
