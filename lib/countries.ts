// Global Country Configuration for SoundSync
export interface CountryConfig {
  code: string;
  name: string;
  currency: { code: string; symbol: string; name: string; locale: string };
  tax: { type: 'VAT' | 'GST' | 'Sales Tax' | 'None'; rate: number; name: string; included: boolean };
  music: { performanceRights: string[]; mechanicalRights: string[]; regulations: string[]; copyrightTerm: string };
  withdrawalThreshold: number;
}

export const COUNTRIES: Record<string, CountryConfig> = {
  ZA: {
    code: 'ZA', name: 'South Africa',
    currency: { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
    tax: { type: 'VAT', rate: 0.15, name: 'Value Added Tax', included: true },
    music: { performanceRights: ['SAMRO', 'CAPASSO'], mechanicalRights: ['CAPASSO'], regulations: ['Copyright Act 98 of 1978', 'Performers Protection Act 11 of 1967'], copyrightTerm: 'Life + 50 years' },
    withdrawalThreshold: 1000
  },
  US: {
    code: 'US', name: 'United States',
    currency: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
    tax: { type: 'Sales Tax', rate: 0.00, name: 'Sales Tax', included: false },
    music: { performanceRights: ['ASCAP', 'BMI', 'SESAC'], mechanicalRights: ['Harry Fox Agency', 'MLC'], regulations: ['Copyright Act of 1976', 'DMCA', 'Music Modernization Act'], copyrightTerm: 'Life + 70 years' },
    withdrawalThreshold: 100
  },
  GB: {
    code: 'GB', name: 'United Kingdom',
    currency: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
    tax: { type: 'VAT', rate: 0.20, name: 'Value Added Tax', included: true },
    music: { performanceRights: ['PRS for Music', 'PPL'], mechanicalRights: ['MCPS'], regulations: ['Copyright, Designs and Patents Act 1988'], copyrightTerm: 'Life + 70 years' },
    withdrawalThreshold: 100
  },
  CA: {
    code: 'CA', name: 'Canada',
    currency: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
    tax: { type: 'GST', rate: 0.05, name: 'Goods and Services Tax', included: false },
    music: { performanceRights: ['SOCAN'], mechanicalRights: ['CMRRA', 'SODRAC'], regulations: ['Copyright Act (R.S.C., 1985, c. C-42)'], copyrightTerm: 'Life + 70 years' },
    withdrawalThreshold: 100
  },
  AU: {
    code: 'AU', name: 'Australia',
    currency: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
    tax: { type: 'GST', rate: 0.10, name: 'Goods and Services Tax', included: true },
    music: { performanceRights: ['APRA', 'PPCA'], mechanicalRights: ['AMCOS'], regulations: ['Copyright Act 1968'], copyrightTerm: 'Life + 70 years' },
    withdrawalThreshold: 100
  },
  DE: {
    code: 'DE', name: 'Germany',
    currency: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
    tax: { type: 'VAT', rate: 0.19, name: 'Mehrwertsteuer', included: true },
    music: { performanceRights: ['GEMA'], mechanicalRights: ['GEMA'], regulations: ['Urheberrechtsgesetz'], copyrightTerm: 'Life + 70 years' },
    withdrawalThreshold: 100
  },
  FR: {
    code: 'FR', name: 'France',
    currency: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'fr-FR' },
    tax: { type: 'VAT', rate: 0.20, name: 'TVA', included: true },
    music: { performanceRights: ['SACEM'], mechanicalRights: ['SDRM'], regulations: ['Code de la propriété intellectuelle'], copyrightTerm: 'Life + 70 years' },
    withdrawalThreshold: 100
  },
  IN: {
    code: 'IN', name: 'India',
    currency: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
    tax: { type: 'GST', rate: 0.18, name: 'Goods and Services Tax', included: true },
    music: { performanceRights: ['IPRS', 'PPL India'], mechanicalRights: ['IPRS'], regulations: ['Copyright Act 1957 (amended 2012)'], copyrightTerm: 'Life + 60 years' },
    withdrawalThreshold: 5000
  },
  JP: {
    code: 'JP', name: 'Japan',
    currency: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
    tax: { type: 'VAT', rate: 0.10, name: 'Consumption Tax', included: true },
    music: { performanceRights: ['JASRAC', 'NexTone'], mechanicalRights: ['JASRAC'], regulations: ['Copyright Act (Act No. 48 of 1970)'], copyrightTerm: 'Life + 70 years' },
    withdrawalThreshold: 10000
  },
  BR: {
    code: 'BR', name: 'Brazil',
    currency: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
    tax: { type: 'VAT', rate: 0.17, name: 'ICMS', included: true },
    music: { performanceRights: ['ECAD'], mechanicalRights: ['UBC'], regulations: ['Lei de Direitos Autorais (Law 9.610/98)'], copyrightTerm: 'Life + 70 years' },
    withdrawalThreshold: 500
  },
  MX: {
    code: 'MX', name: 'Mexico',
    currency: { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', locale: 'es-MX' },
    tax: { type: 'VAT', rate: 0.16, name: 'IVA', included: true },
    music: { performanceRights: ['SACM'], mechanicalRights: ['SACM'], regulations: ['Ley Federal del Derecho de Autor'], copyrightTerm: 'Life + 100 years' },
    withdrawalThreshold: 1000
  },
  NG: {
    code: 'NG', name: 'Nigeria',
    currency: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', locale: 'en-NG' },
    tax: { type: 'VAT', rate: 0.075, name: 'Value Added Tax', included: true },
    music: { performanceRights: ['COSON', 'MCSN'], mechanicalRights: ['MCSN'], regulations: ['Copyright Act 2022'], copyrightTerm: 'Life + 70 years' },
    withdrawalThreshold: 50000
  },
};

export const DEFAULT_COUNTRY = 'US';

export function getCountryConfig(code: string): CountryConfig {
  return COUNTRIES[code.toUpperCase()] || COUNTRIES[DEFAULT_COUNTRY];
}

export function getAllCountries(): CountryConfig[] {
  return Object.values(COUNTRIES);
}

export function detectCountryFromBrowser(): string {
  if (typeof window === 'undefined') return DEFAULT_COUNTRY;
  const locale = navigator.language || (navigator as any).userLanguage;
  if (locale) {
    const parts = locale.split('-');
    if (parts.length > 1 && COUNTRIES[parts[1].toUpperCase()]) {
      return parts[1].toUpperCase();
    }
  }
  return DEFAULT_COUNTRY;
}