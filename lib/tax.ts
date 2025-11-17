import { getCountryConfig } from './countries'
import { convertToCountryCurrency, type ExchangeRates } from './currency'

export type TaxCategory = 'digital_services' | 'physical_goods' | 'subscriptions'

export interface TaxCalculationInput {
  countryCode: string
  grossAmountZar: number
  exchangeRates?: ExchangeRates
  taxCategory?: TaxCategory
  overrideTaxRate?: number
}

export interface TaxCalculationResult {
  countryCode: string
  taxType: string
  taxRate: number
  currencyCode: string
  taxIncluded: boolean
  netAmountZar: number
  taxAmountZar: number
  totalAmountZar: number
  localNetAmount: number
  localTaxAmount: number
  localTotalAmount: number
  complianceNotes: string[]
}

const DEFAULT_COMPLIANCE_NOTES: Record<string, string[]> = {
  ZA: [
    'VAT registration threshold: R1 million rolling 12 months.',
    'Store proof of supply location per SARS requirements.',
  ],
  EU: [
    'Use OSS reporting for EU consumer sales.',
    'Collect two pieces of non-conflicting location evidence.',
  ],
  US: [
    'Apply destination-based sales tax where nexus exists.',
    'Track state-specific thresholds for economic nexus.',
  ],
}

export function calculateTaxForCountry({
  countryCode,
  grossAmountZar,
  exchangeRates,
  taxCategory = 'digital_services',
  overrideTaxRate,
}: TaxCalculationInput): TaxCalculationResult {
  const amount = Math.max(grossAmountZar, 0)
  const country = getCountryConfig(countryCode)
  // Tax disabled - always return 0
  const taxRate = 0
  const taxIncluded = false

  const taxAmountZar = 0
  const netAmountZar = amount
  const totalAmountZar = amount

  const localTotals = convertToCountryCurrency(totalAmountZar, country.code, exchangeRates)
  const localNet = convertToCountryCurrency(netAmountZar, country.code, exchangeRates)
  const localTax = convertToCountryCurrency(taxAmountZar, country.code, exchangeRates)

  return {
    countryCode: country.code,
    taxType: 'None',
    taxRate: 0,
    currencyCode: country.currency.code,
    taxIncluded: false,
    netAmountZar,
    taxAmountZar: 0,
    totalAmountZar,
    localNetAmount: localNet.amount,
    localTaxAmount: 0,
    localTotalAmount: localTotals.amount,
    complianceNotes: [],
  }
}

function extractTax(grossAmount: number, rate: number) {
  if (rate <= 0) return 0
  return grossAmount - grossAmount / (1 + rate)
}

function buildComplianceNotes(countryCode: string, category: TaxCategory) {
  const specific = DEFAULT_COMPLIANCE_NOTES[countryCode]
  if (specific) return specific

  if (countryCode === 'GB' || countryCode === 'DE' || countryCode === 'FR') {
    return DEFAULT_COMPLIANCE_NOTES.EU
  }

  if (countryCode === 'US') {
    return DEFAULT_COMPLIANCE_NOTES.US
  }

  return [
    'Ensure local tax registration before accepting payments.',
    `Track ${category.replace('_', ' ')} transactions for statutory reporting.`,
  ]
}

