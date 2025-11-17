import { getAllCountries, getCountryConfig } from './countries'

export type CurrencyCode = ReturnType<typeof getAllCountries>[number]['currency']['code']

export interface ExchangeRates {
  base: 'ZAR'
  timestamp: number
  rates: Record<string, number>
  source: string
}

const DEFAULT_EXCHANGE_RATES: ExchangeRates = {
  base: 'ZAR',
  timestamp: Date.now(),
  source: 'fallback-static',
  rates: {
    ZAR: 1,
    USD: 0.054,
    EUR: 0.050,
    GBP: 0.043,
    CAD: 0.073,
    AUD: 0.081,
    NGN: 82,
    INR: 4.5,
    JPY: 8.6,
    BRL: 0.30,
    MXN: 0.98,
  },
}

const EXCHANGE_RATE_TTL_MS = 60 * 60 * 1000 // 1 hour
const FETCH_TIMEOUT_MS = 7_000

let cachedRates: ExchangeRates | null = null
let lastFetch = 0

const RATE_ENDPOINT =
  process.env.EXCHANGE_RATE_API_URL ??
  process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_URL ??
  'https://open.er-api.com/v6/latest/ZAR'

export async function getExchangeRates(force = false): Promise<ExchangeRates> {
  const now = Date.now()
  if (!force && cachedRates && now - lastFetch < EXCHANGE_RATE_TTL_MS) {
    return cachedRates
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    const response = await fetch(RATE_ENDPOINT, {
      signal: controller.signal,
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`Exchange rate fetch failed with ${response.status}`)
    }

    const data = await response.json()
    const rates = normalizeRates(data)

    cachedRates = rates
    lastFetch = now
    return rates
  } catch (error) {
    console.warn('Falling back to default exchange rates:', (error as Error).message)
    if (cachedRates) {
      return cachedRates
    }
    return DEFAULT_EXCHANGE_RATES
  }
}

function normalizeRates(payload: any): ExchangeRates {
  if (payload?.rates && typeof payload.rates === 'object') {
    return {
      base: payload.base_code || payload.base || 'ZAR',
      timestamp: payload.time_last_update_unix
        ? payload.time_last_update_unix * 1000
        : Date.now(),
      source: payload.provider || 'api',
      rates: payload.rates,
    }
  }

  if (payload?.data?.rates) {
    return {
      base: payload.data.base || 'ZAR',
      timestamp: payload.data.timestamp ? payload.data.timestamp * 1000 : Date.now(),
      source: payload.data.provider || 'api',
      rates: payload.data.rates,
    }
  }

  return DEFAULT_EXCHANGE_RATES
}

export function convertFromZar(
  amountInZar: number,
  targetCurrency: string,
  rates?: ExchangeRates
) {
  const effectiveRates = rates ?? cachedRates ?? DEFAULT_EXCHANGE_RATES
  const rate = effectiveRates.rates[targetCurrency] ?? 1
  return {
    amount: amountInZar * rate,
    rate,
    currency: targetCurrency,
    source: effectiveRates.source,
    timestamp: effectiveRates.timestamp,
  }
}

export function convertToCountryCurrency(
  amountInZar: number,
  countryCode: string,
  rates?: ExchangeRates
) {
  const country = getCountryConfig(countryCode)
  return convertFromZar(amountInZar, country.currency.code, rates)
}

export function formatCurrencyAmount(
  amount: number,
  currencyCode: string,
  locale = 'en-ZA'
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
  }).format(amount)
}

export function getSupportedCurrencies(): CurrencyCode[] {
  const unique = new Set<CurrencyCode>()
  getAllCountries().forEach((country) => unique.add(country.currency.code as CurrencyCode))
  return Array.from(unique).sort()
}

