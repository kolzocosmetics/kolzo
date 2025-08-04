/**
 * Utility functions for formatting prices in Indian Rupees
 */

/**
 * Formats a price number to Indian Rupees with proper formatting
 * @param price - The price as a number
 * @returns Formatted price string with ₹ symbol
 */
export const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null) {
    return '₹0';
  }
  return `₹${price.toLocaleString('en-IN')}`;
};

/**
 * Formats a price number to Indian Rupees with decimal places for cents
 * @param price - The price as a number
 * @returns Formatted price string with ₹ symbol and decimal places
 */
export const formatPriceWithDecimal = (price: number | undefined | null): string => {
  if (price === undefined || price === null) {
    return '₹0.00';
  }
  return `₹${price.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Converts USD prices to INR (assuming 1 USD = 83 INR for conversion)
 * @param usdPrice - Price in USD
 * @returns Price in INR
 */
export const convertUSDToINR = (usdPrice: number | undefined | null): number => {
  if (usdPrice === undefined || usdPrice === null) {
    return 0;
  }
  const exchangeRate = 83; // 1 USD = 83 INR (approximate)
  return Math.round(usdPrice * exchangeRate);
};

/**
 * Formats a price that was originally in USD to INR
 * @param usdPrice - Price in USD
 * @returns Formatted price string in INR
 */
export const formatUSDToINR = (usdPrice: number | undefined | null): string => {
  const inrPrice = convertUSDToINR(usdPrice);
  return formatPrice(inrPrice);
}; 