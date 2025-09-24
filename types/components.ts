import type { Product, Category } from "./database";

// Re-export core types for convenience
export type { Product, Category };

// Inventory type for business data (separate from Product)
export interface Inventory {
  id: string; // inventory id
  product_id: string; // reference to product
  user_id: string;
  buy_price: number;
  sell_price: number;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Combined type for UI convenience
export interface ProductWithInventory extends Product {
  inventory?: Inventory;
}

export interface ProductCardProps {
  product: Product; // Catalog data (immutable)
  inventory?: Inventory; // Business data (user-specific, optional)
  onPress?: (product: ProductWithInventory) => void;
  onLongPress?: () => void;
  mode?: "cart" | "stock"; // UI mode for different behaviors
}

export interface ProductGridProps {
  products: Product[]; // Catalog data
  inventory?: Inventory[]; // Business data (optional)
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
  mode?: "cart" | "stock";
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
export interface CartProduct extends ProductWithInventory {
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
  title?: string;
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

// Additional component types
export interface ProductGridHeaderProps {
  visibleProductsCount: number;
  totalProductsCount: number;
  currentCategory: string | null;
  onSearch?: (query: string) => void;
}

export interface ProductGridContentProps {
  products: Product[];
  allProducts: Product[];
  inventoryMap?: Map<string, Inventory>; // Map for fast inventory lookup
  onProductPress: (product: Product) => void;
  selectedProductForQuantity: Product | null;
  currentCategory: string | null;
  loading?: boolean;
}

export interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export interface DailyMetricsCardProps {
  dailyRevenue: number;
  dailyProfit: number;
  onPress?: () => void;
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
