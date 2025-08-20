import type { Product, Category } from "./database";

export interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onLongPress?: () => void;
}

export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onProductPress?: (product: Product) => void;
  onRefresh?: () => void;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export interface QuickAccessSectionProps {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
}

export interface KeypadProps {
  onNumberPress: (number: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onEnter: () => void;
}

export interface SuccessScreenProps {
  message: string;
  onContinue: () => void;
  onNewTransaction?: () => void;
}

export interface ProductGridSkeletonProps {
  count?: number;
  columns?: number;
}
