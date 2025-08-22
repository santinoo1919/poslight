import React from "react";
import type { Product } from "../../types/database";

interface CartProduct extends Product {
  quantity: number;
}

interface EventHandlersProps {
  selectedProductForQuantity: Product | null;
  keypadInput: string;
  selectedProducts: CartProduct[];
  onSetSelectedProductForQuantity: (product: Product | null) => void;
  onSetKeypadInput: React.Dispatch<React.SetStateAction<string>>;
  onAddToCart: (product: Product, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onCompleteSale: () => void;
  getTotalAmount: () => number;
}

export default function EventHandlers({
  selectedProductForQuantity,
  keypadInput,
  selectedProducts,
  onSetSelectedProductForQuantity,
  onSetKeypadInput,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  onCompleteSale,
  getTotalAmount,
}: EventHandlersProps) {
  // Product press handler
  const handleProductPress = (product: Product) => {
    React.startTransition(() => {
      onSetSelectedProductForQuantity(product);
      onSetKeypadInput("");
    });
  };

  // Keypad handlers
  const handleKeypadNumber = (num: string) => {
    onSetKeypadInput((prev: string) => prev + num);
  };

  const handleKeypadClear = () => {
    onSetKeypadInput("");
  };

  const handleKeypadDelete = () => {
    onSetKeypadInput(keypadInput.slice(0, -1));
  };

  const handleKeypadEnter = () => {
    if (keypadInput && selectedProductForQuantity) {
      const quantity = parseInt(keypadInput);
      if (quantity > 0) {
        onAddToCart(selectedProductForQuantity, quantity);
        onSetSelectedProductForQuantity(null);
        onSetKeypadInput("");
      }
    }
  };

  return {
    handleProductPress,
    handleKeypadNumber,
    handleKeypadClear,
    handleKeypadDelete,
    handleKeypadEnter,
  };
}
