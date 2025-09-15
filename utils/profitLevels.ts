import type { ProfitLevel, ProfitLevelConfig } from "../types/database";

export const PROFIT_LEVELS: Record<ProfitLevel, ProfitLevelConfig> = {
  high: {
    level: "high",
    color: "#059669", // green-600
    bgColor: "#D1FAE5", // green-100
    borderColor: "#10B981", // green-500
    textColor: "#065F46", // green-800
    label: "High Profit",
    threshold: 50, // 50%+ margin = High Profit
  },
  medium: {
    level: "medium",
    color: "#D97706", // amber-600
    bgColor: "#FEF3C7", // amber-100
    borderColor: "#F59E0B", // amber-500
    textColor: "#92400E", // amber-800
    label: "Medium Profit",
    threshold: 40, // 40-49% margin = Medium Profit
  },
  low: {
    level: "low",
    color: "#DC2626", // red-600
    bgColor: "#FEE2E2", // red-100
    borderColor: "#EF4444", // red-500
    textColor: "#991B1B", // red-800
    label: "Low Profit",
    threshold: 0, // 0-39% margin = Low Profit
  },
};

export const getProfitLevel = (profitMarginPercentage: number): ProfitLevel => {
  if (profitMarginPercentage >= 50) return "high";
  if (profitMarginPercentage >= 40) return "medium";
  return "low";
};

// Fallback function for products without profitLevel
export const calculateProfitLevel = (
  buy_price: number,
  sell_price: number
): ProfitLevel => {
  const margin = sell_price - buy_price;
  const profitMarginPercentage = (margin / sell_price) * 100;
  return getProfitLevel(profitMarginPercentage);
};

export const getProfitLevelConfig = (
  profitLevel: ProfitLevel
): ProfitLevelConfig => {
  return PROFIT_LEVELS[profitLevel];
};

// Simple function to get profit text color
export const getProfitTextColor = (profitLevel: ProfitLevel): string => {
  switch (profitLevel) {
    case "high":
      return "text-green-600";
    case "medium":
      return "text-amber-600";
    case "low":
      return "text-red-600";
    default:
      return "text-green-600";
  }
};
