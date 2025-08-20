// Re-export types from other files to maintain backward compatibility
export type { Product, Category } from "./database";
export type {
  ProductCardProps,
  ProductGridProps,
  SearchBarProps,
  KeypadProps,
  SuccessScreenProps,
  ProductGridSkeletonProps,
  QuickAccessSectionProps,
} from "./components";

export interface QuickAccessView {
  id: "most-bought" | "low-stock" | "coming-in" | "trending";
  title: string;
  icon: string;
  color: string;
  backgroundColor: string;
}
