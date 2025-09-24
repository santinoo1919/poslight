// Simple SKU Generator for F&B businesses
// Format: CATEGORY-PRODUCT-SIZE

export interface ProductInput {
  name: string;
  category: string;
  size?: string;
}

// Category mapping
const CATEGORY_CODES: Record<string, string> = {
  produce: "PRO",
  vegetables: "PRO",
  fruits: "PRO",
  dairy: "DAI",
  milk: "DAI",
  cheese: "DAI",
  meat: "MEA",
  chicken: "MEA",
  beef: "MEA",
  pork: "MEA",
  beverage: "BEV",
  drinks: "BEV",
  soda: "BEV",
  pantry: "PAN",
  grains: "PAN",
  spices: "PAN",
  frozen: "FRO",
  wine: "WIN",
  beer: "BEER",
  spirits: "SPI",
  general: "GEN",
};

// Size normalization
const SIZE_MAP: Record<string, string> = {
  small: "S",
  medium: "M",
  large: "L",
  "extra large": "XL",
  "1lb": "1LB",
  "2lb": "2LB",
  "5lb": "5LB",
  "10lb": "10LB",
  "12oz": "12OZ",
  "16oz": "16OZ",
  "32oz": "32OZ",
  "1gal": "1GAL",
  "1l": "1L",
  "750ml": "750ML",
  "1kg": "1KG",
  "500g": "500G",
};

export function generateSimpleSKU(input: ProductInput): string {
  // Get category code
  const categoryCode = getCategoryCode(input.category);

  // Get product code (first 3-4 letters, uppercase, no spaces)
  const productCode = getProductCode(input.name);

  // Get size code
  const sizeCode = getSizeCode(input.size);

  return `${categoryCode}-${productCode}-${sizeCode}`;
}

function getCategoryCode(category: string): string {
  const normalized = category.toLowerCase().trim();

  // Direct match
  if (CATEGORY_CODES[normalized]) {
    return CATEGORY_CODES[normalized];
  }

  // Partial match
  for (const [key, code] of Object.entries(CATEGORY_CODES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return code;
    }
  }

  // Default to general
  return "GEN";
}

function getProductCode(name: string): string {
  // Remove common words
  const cleanName = name
    .toLowerCase()
    .replace(/\b(the|a|an|and|or|of|in|on|at|to|for|with|by)\b/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();

  // Get first 3-4 meaningful characters
  const words = cleanName.split(/\s+/).filter((word) => word.length > 0);

  if (words.length === 1) {
    return words[0].substring(0, 4).toUpperCase();
  }

  // Use first letter of each word, max 4 chars
  const code = words
    .map((word) => word.charAt(0))
    .join("")
    .substring(0, 4)
    .toUpperCase();

  return code || "ITEM";
}

function getSizeCode(size?: string): string {
  if (!size) return "REG";

  const normalized = size.toLowerCase().trim();

  // Direct match
  if (SIZE_MAP[normalized]) {
    return SIZE_MAP[normalized];
  }

  // Partial match
  for (const [key, code] of Object.entries(SIZE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return code;
    }
  }

  // Default
  return "REG";
}

// Validation function
export function validateSKU(sku: string): {
  isValid: boolean;
  message: string;
} {
  const parts = sku.split("-");

  if (parts.length !== 3) {
    return {
      isValid: false,
      message: "SKU must have 3 parts: CATEGORY-PRODUCT-SIZE",
    };
  }

  const [category, product, size] = parts;

  if (category.length < 2 || category.length > 4) {
    return { isValid: false, message: "Category code must be 2-4 characters" };
  }

  if (product.length < 2 || product.length > 6) {
    return { isValid: false, message: "Product code must be 2-6 characters" };
  }

  if (size.length < 1 || size.length > 6) {
    return { isValid: false, message: "Size code must be 1-6 characters" };
  }

  return { isValid: true, message: "Valid SKU format" };
}

// Check for duplicates
export function checkSKUUniqueness(
  sku: string,
  existingSKUs: string[]
): boolean {
  return !existingSKUs.includes(sku);
}

// Examples for testing
export const EXAMPLE_SKUS = [
  "PRO-ONION-5LB",
  "DAI-MILK-1GAL",
  "MEA-CHICKEN-2LB",
  "BEV-COKE-12OZ",
  "PAN-RICE-10LB",
  "FRO-VEG-2LB",
  "WIN-RED-750ML",
  "BEER-LAGER-12PK",
];
