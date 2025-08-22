import type { Product, Category } from "./database";

// Re-export core types for convenience
export type { Product, Category };

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

// Keypad-specific types
export type ButtonVariant = "default" | "number" | "function" | "clear";

export interface KeypadButtonProps {
  value: string;
  onPress: (value: string) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}

// Cart-related types
export interface CartProduct extends Product {
  quantity: number;
}

// Event handler types
export interface EventHandlerProps {
  setSelectedProductForQuantity: (product: Product | null) => void;
  setKeypadInput: React.Dispatch<React.SetStateAction<string>>;
  addToCart: (product: Product, quantity: number) => void;
  keypadInput: string;
  selectedProductForQuantity: Product | null;
}

// Layout component types
export interface MainLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export interface LeftPanelProps {
  title: string;
  products: Product[];
  allProducts: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  currentCategory: string | null;
  searchResults: Product[];
  isFiltering: boolean;
  onProductPress: (product: Product) => void;
  onCategorySelect: (category: string) => void;
  onSearch: (query: string) => void;
  onRefresh: () => void;
  selectedProductForQuantity: Product | null;
  dailyRevenue: number;
  dailyProfit: number;
}

export interface RightPanelProps {
  selectedProducts: CartProduct[];
  selectedProductForQuantity: Product | null;
  keypadInput: string;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onSetSelectedProductForQuantity: (product: Product | null) => void;
  onSetKeypadInput: React.Dispatch<React.SetStateAction<string>>;
  onKeypadNumber: (num: string) => void;
  onKeypadDelete: () => void;
  onKeypadClear: () => void;
  onKeypadEnter: () => void;
  onCompleteSale: () => void;
  getTotalAmount: () => number;
}

// Product management types
export interface ProductManagerProps {
  children: (props: {
    products: Product[];
    categories: Category[];
    loading: boolean;
    error: string | null;
    currentCategory: string | null;
    searchResults: Product[];
    isFiltering: boolean;
    visibleProducts: Product[];
    handleCategorySelect: (categoryName: string) => void;
    handleSearch: (query: string) => void;
    clearSearch: () => void;
    isSearching: boolean;
    resetProducts: () => void;
    updateProductStock: (productId: string, newStock: number) => void;
  }) => React.ReactNode;
}

export interface CartManagerProps {
  children: (props: {
    selectedProducts: CartProduct[];
    selectedProductForQuantity: Product | null;
    keypadInput: string;
    dailyRevenue: number;
    dailyProfit: number;
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, newQuantity: number) => void;
    setSelectedProductForQuantity: (product: Product | null) => void;
    setKeypadInput: React.Dispatch<React.SetStateAction<string>>;
    getTotalAmount: () => number;
    completeSale: () => void;
  }) => React.ReactNode;
  onStockUpdate?: () => void;
  onProductStockUpdate?: (productId: string, newStock: number) => void;
}

// Additional component types
export interface ProductGridHeaderProps {
  visibleProductsCount: number;
  totalProductsCount: number;
  currentCategory: string | null;
}

export interface ProductGridContentProps {
  products: Product[];
  allProducts: Product[];
  onProductPress: (product: Product) => void;
  selectedProductForQuantity: Product | null;
  currentCategory: string | null;
}

export interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export interface DailyMetricsCardProps {
  dailyRevenue: number;
  dailyProfit: number;
}

export interface ProductGridSkeletonProps {
  count?: number;
  columns?: number;
}

export interface SkeletonItemProps {
  width: number | string;
  height: number;
  marginBottom?: number;
}
