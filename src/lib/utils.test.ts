import { formatCurrency, formatCurrencyNumber } from './utils';

describe('Currency Formatting', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers as INR', () => {
      expect(formatCurrency(1234.56)).toBe('₹1,234.56');
      expect(formatCurrency(1000)).toBe('₹1,000.00');
      expect(formatCurrency(0.99)).toBe('₹0.99');
    });

    it('should handle null and undefined values', () => {
      expect(formatCurrency(null)).toBe('-');
      expect(formatCurrency(undefined)).toBe('-');
    });

    it('should format large numbers with proper grouping', () => {
      expect(formatCurrency(1234567.89)).toBe('₹12,34,567.89');
      expect(formatCurrency(1000000)).toBe('₹10,00,000.00');
    });

    it('should handle zero values', () => {
      expect(formatCurrency(0)).toBe('₹0.00');
    });
  });

  describe('formatCurrencyNumber', () => {
    it('should format numbers without currency symbol', () => {
      expect(formatCurrencyNumber(1234.56)).toBe('1,234.56');
      expect(formatCurrencyNumber(1000)).toBe('1,000.00');
      expect(formatCurrencyNumber(0.99)).toBe('0.99');
    });

    it('should handle null and undefined values', () => {
      expect(formatCurrencyNumber(null)).toBe('-');
      expect(formatCurrencyNumber(undefined)).toBe('-');
    });

    it('should format large numbers with proper grouping', () => {
      expect(formatCurrencyNumber(1234567.89)).toBe('12,34,567.89');
      expect(formatCurrencyNumber(1000000)).toBe('10,00,000.00');
    });

    it('should handle zero values', () => {
      expect(formatCurrencyNumber(0)).toBe('0.00');
    });
  });
}); 