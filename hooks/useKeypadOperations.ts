import { useCartStore } from "../stores/cartStore";
import { useDrawerStore } from "../stores/drawerStore";
import { ToastService } from "../services/toastService";

export function useKeypadOperations() {
  const { activeTab } = useDrawerStore();
  const { selectedProductForQuantity, keypadInput, setKeypadInput, addToCart } =
    useCartStore();

  const handleKeypadNumber = (num: string) => {
    setKeypadInput((prev) => prev + num);
  };

  const handleKeypadDelete = () => {
    setKeypadInput((prev) => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setKeypadInput("");
  };

  const handleKeypadEnter = () => {
    if (!keypadInput || !selectedProductForQuantity) return;

    const quantity = parseInt(keypadInput);
    const product = selectedProductForQuantity;
    const availableStock = product.inventory?.stock ?? 0;

    if (quantity <= 0) return;

    if (activeTab === "stock") {
      // Stock mode: Add to selectedProducts (stock list) for review
      addToCart(product, quantity);
      setKeypadInput("");
    } else {
      // Cart mode: Apply stock validation
      if (quantity > availableStock) {
        ToastService.stock.insufficient(product.name, quantity, availableStock);
        return;
      }

      // Add to cart
      addToCart(product, quantity);
      setKeypadInput("");
    }
  };

  return {
    handleKeypadNumber,
    handleKeypadDelete,
    handleKeypadClear,
    handleKeypadEnter,
  };
}
