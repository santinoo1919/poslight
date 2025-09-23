// AddProductModal types and interfaces

export interface ProductFormData {
  // Basic Details
  name: string;
  description: string;
  sku: string;
  barcode: string;
  brand: string;
  categories: Category[]; // Array of selected categories

  // Pricing & Stock
  price: string;
  cost: string;
  initialStock: string;

  // Images (future)
  images: any[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
}

export interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (productData: ProductFormData) => void;
}

export interface StepComponentProps {
  formData: ProductFormData;
  onUpdate: (field: keyof ProductFormData, value: string | Category[]) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
}

export interface NavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}
