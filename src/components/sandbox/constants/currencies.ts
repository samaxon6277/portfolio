import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    label: 'INR (₹)',
    rateMultiplier: 1,
    format: (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'USD ($)',
    rateMultiplier: 0.012,
    format: (amount: number) => `$${Math.round(amount * 0.012).toLocaleString('en-US')}`,
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    label: 'AED (د.إ)',
    rateMultiplier: 0.044,
    format: (amount: number) => `AED ${Math.round(amount * 0.044).toLocaleString('en-US')}`,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    label: 'EUR (€)',
    rateMultiplier: 0.011,
    format: (amount: number) => `€${Math.round(amount * 0.011).toLocaleString('de-DE')}`,
  },
};

export const INITIAL_CURRENCY: CurrencyCode = 'INR';
