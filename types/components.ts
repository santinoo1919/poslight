import type { Product, Category } from "./database";

export interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onLongPress?: () => void;
}

export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onProductPress?: (product: Product) => void;
  onRefresh?: () => void;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export interface KeypadProps {
  onNumberPress: (number: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onEnter: () => void;
  disabled?: boolean;
}

export interface SuccessScreenProps {
  message: string;
  onContinue: () => void;
  onClose?: () => void;
  onNewTransaction?: () => void;
}

export interface ProductGridSkeletonProps {
  count?: number;
  columns?: number;
}

export interface QuickAccessView {
  id: string;
  title: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

export interface QuickAccessSectionProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  selectedProductForQuantity?: Product | null;
}
