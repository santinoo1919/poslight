import Toast from "react-native-toast-message";

export const ToastService = {
  // Stock domain
  stock: {
    updated: (productName: string, newStock: number) => {
      Toast.show({
        type: "success",
        text1: "Stock Updated ✅",
        text2: `${productName}: ${newStock} units remaining`,
        position: "bottom",
        visibilityTime: 3000,
      });
    },

    lowStock: (productName: string, stock: number) => {
      Toast.show({
        type: "info",
        text1: "Low Stock Warning ⚠️",
        text2: `${productName}: Only ${stock} units left`,
        position: "bottom",
        visibilityTime: 4000,
      });
    },

    insufficient: (
      productName: string,
      requested: number,
      available: number
    ) => {
      Toast.show({
        type: "error",
        text1: "Stock Error ❌",
        text2: `${productName}: Requested ${requested}, Available ${available}`,
        position: "bottom",
        visibilityTime: 4000,
      });
    },
  },

  // Order domain
  order: {
    placed: (orderId: string, total: number) => {
      Toast.show({
        type: "success",
        text1: "Order Placed! 🎉",
        text2: `Order #${orderId} - €${total.toFixed(2)}`,
        position: "bottom",
        visibilityTime: 4000,
      });
    },

    paymentReceived: (amount: number) => {
      Toast.show({
        type: "success",
        text1: "Payment Received 💳",
        text2: `€${amount.toFixed(2)} added to daily revenue`,
        position: "bottom",
        visibilityTime: 4000,
      });
    },

    cartEmpty: () => {
      Toast.show({
        type: "error",
        text1: "Cart is Empty!",
        text2: "Please add products to cart",
        position: "bottom",
        visibilityTime: 3000,
      });
    },
  },

  // Sale domain
  sale: {
    complete: (totalAmount: number, itemCount: number) => {
      Toast.show({
        type: "success",
        text1: "Sale Complete! 🎉",
        text2: `${itemCount} item${itemCount !== 1 ? "s" : ""} sold - €${totalAmount.toFixed(2)}`,
        position: "bottom",
        visibilityTime: 4000,
      });
    },

    stockUpdated: () => {
      Toast.show({
        type: "info",
        text1: "Stock Updated 📦",
        text2: "Inventory levels have been updated automatically",
        position: "bottom",
        visibilityTime: 3000,
      });
    },
  },

  // Report domain
  report: {
    generated: (type: string) => {
      Toast.show({
        type: "info",
        text1: "Report Generated 📊",
        text2: `${type} report ready for download`,
        position: "bottom",
        visibilityTime: 3000,
      });
    },

    exported: (format: string) => {
      Toast.show({
        type: "success",
        text1: "Export Complete 📁",
        text2: `Report exported as ${format.toUpperCase()}`,
        position: "bottom",
        visibilityTime: 3000,
      });
    },
  },

  // Price domain
  price: {
    updated: (productName: string, newPrice: number) => {
      Toast.show({
        type: "success",
        text1: "Price Updated 💰",
        text2: `${productName}: €${newPrice.toFixed(2)}`,
        position: "bottom",
        visibilityTime: 3000,
      });
    },

    discountApplied: (discount: number) => {
      Toast.show({
        type: "info",
        text1: "Discount Applied 🎯",
        text2: `${discount}% discount added to cart`,
        position: "bottom",
        visibilityTime: 3000,
      });
    },
  },

  // User domain
  user: {
    loginSuccess: (username: string) => {
      Toast.show({
        type: "success",
        text1: "Welcome Back! 👋",
        text2: `Logged in as ${username}`,
        position: "bottom",
        visibilityTime: 3000,
      });
    },

    settingsSaved: () => {
      Toast.show({
        type: "success",
        text1: "Settings Saved ⚙️",
        text2: "Your preferences have been updated",
        position: "bottom",
        visibilityTime: 3000,
      });
    },
  },

  // Generic methods for custom toasts
  show: (
    type: "success" | "error" | "warning" | "info",
    text1: string,
    text2?: string
  ) => {
    Toast.show({
      type,
      text1,
      text2,
      position: "bottom",
      visibilityTime: 3000,
    });
  },
};
