import Toast from "react-native-toast-message";

// Override default toast styles to match your app's design
const toastStyles = {
  success: {
    style: {
      backgroundColor: "#F0FDF4", // green-50
      borderLeftColor: "#10B981", // green-500
      borderWidth: 1,
      borderColor: "#D1FAE5", // green-200
    },
    text1Style: {
      fontSize: 16,
      fontWeight: "500" as const, // medium weight instead of bold
      color: "#6B7280", // neutral gray-500
    },
    text2Style: {
      fontSize: 14,
      fontWeight: "400" as const, // normal weight instead of semibold
      color: "#9CA3AF", // neutral gray-400
    },
  },
  error: {
    style: {
      backgroundColor: "#FEF2F2", // red-50
      borderLeftColor: "#EF4444", // red-500
      borderWidth: 1,
      borderColor: "#FECACA", // red-200
    },
    text1Style: {
      fontSize: 16,
      fontWeight: "500" as const, // medium weight instead of bold
      color: "#6B7280", // neutral gray-500
    },
    text2Style: {
      fontSize: 14,
      fontWeight: "400" as const, // normal weight instead of semibold
      color: "#9CA3AF", // neutral gray-400
    },
  },
  warning: {
    style: {
      backgroundColor: "#FFFBEB", // amber-50
      borderLeftColor: "#F59E0B", // amber-500
      borderWidth: 1,
      borderColor: "#FED7AA", // amber-200
    },
    text1Style: {
      fontSize: 16,
      fontWeight: "500" as const, // medium weight instead of bold
      color: "#6B7280", // neutral gray-500
    },
    text2Style: {
      fontSize: 14,
      fontWeight: "400" as const, // normal weight instead of semibold
      color: "#9CA3AF", // neutral gray-400
    },
  },
  info: {
    style: {
      backgroundColor: "#EFF6FF", // blue-50
      borderLeftColor: "#3B82F6", // blue-500
      borderWidth: 1,
      borderColor: "#BFDBFE", // blue-200
    },
    text1Style: {
      fontSize: 16,
      fontWeight: "500" as const, // medium weight instead of bold
      color: "#6B7280", // neutral gray-500
    },
    text2Style: {
      fontSize: 14,
      fontWeight: "400" as const, // normal weight instead of semibold
      color: "#9CA3AF", // neutral gray-400
    },
  },
};

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
        ...toastStyles.success,
      });
    },

    lowStock: (productName: string, stock: number) => {
      Toast.show({
        type: "info",
        text1: "Low Stock Warning ⚠️",
        text2: `${productName}: Only ${stock} units left`,
        position: "bottom",
        visibilityTime: 4000,
        ...toastStyles.info,
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
        ...toastStyles.error,
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
        ...toastStyles.success,
      });
    },

    paymentReceived: (amount: number) => {
      Toast.show({
        type: "success",
        text1: "Payment Received 💳",
        text2: `€${amount.toFixed(2)} added to daily revenue`,
        position: "bottom",
        visibilityTime: 4000,
        ...toastStyles.success,
      });
    },

    cartEmpty: () => {
      Toast.show({
        type: "error",
        text1: "Cart is Empty!",
        text2: "Please add products to cart",
        position: "bottom",
        visibilityTime: 3000,
        ...toastStyles.error,
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
        ...toastStyles.success,
      });
    },

    stockUpdated: () => {
      Toast.show({
        type: "info",
        text1: "Stock Updated 📦",
        text2: "Inventory levels have been updated automatically",
        position: "bottom",
        visibilityTime: 3000,
        ...toastStyles.info,
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
        ...toastStyles.info,
      });
    },

    exported: (format: string) => {
      Toast.show({
        type: "success",
        text1: "Export Complete 📁",
        text2: `Report exported as ${format.toUpperCase()}`,
        position: "bottom",
        visibilityTime: 3000,
        ...toastStyles.success,
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
        ...toastStyles.success,
      });
    },

    discountApplied: (discount: number) => {
      Toast.show({
        type: "info",
        text1: "Discount Applied 🎯",
        text2: `${discount}% discount added to cart`,
        position: "bottom",
        visibilityTime: 3000,
        ...toastStyles.info,
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
        ...toastStyles.success,
      });
    },

    settingsSaved: () => {
      Toast.show({
        type: "success",
        text1: "Settings Saved ⚙️",
        text2: "Your preferences have been updated",
        position: "bottom",
        visibilityTime: 3000,
        ...toastStyles.success,
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
      ...toastStyles[type],
    });
  },
};
