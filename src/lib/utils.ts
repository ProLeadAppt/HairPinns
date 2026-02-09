import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price with currency symbol
 */
export function formatPrice(amount: number | string, currencyCode: string = "AUD"): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Currency formatting based on code
  const currencySymbols: Record<string, string> = {
    AUD: '$',
    USD: '$',
    EUR: '€',
    GBP: '£',
    NZD: 'NZ$',
  };

  const symbol = currencySymbols[currencyCode] || currencyCode;
  
  // Format to 2 decimal places, remove trailing zeros
  const formatted = numAmount.toFixed(2).replace(/\.?0+$/, '');
  
  return `${symbol}${formatted}`;
}