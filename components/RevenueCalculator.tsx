'use client';

import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  calculateRevenueBreakdown,
  formatZAR,
  validateAmount,
} from '@/lib/revenue'
import {
  convertToCountryCurrency,
  formatCurrencyAmount,
  type ExchangeRates,
} from '@/lib/currency'
import {
  detectCountryFromBrowser,
  getAllCountries,
  getCountryConfig,
} from '@/lib/countries'
import { calculateTaxForCountry } from '@/lib/tax'
import { Spinner } from '@/components/ui/spinner'

export function RevenueCalculator() {
  const [amount, setAmount] = useState<string>('100')
  const [breakdown, setBreakdown] = useState(() => calculateRevenueBreakdown(100))
  const [error, setError] = useState<string>('')
  const [countryCode, setCountryCode] = useState<string>('ZA')
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null)
  const [ratesError, setRatesError] = useState<string | null>(null)
  const [ratesLoading, setRatesLoading] = useState<boolean>(false)
  const countryList = useMemo(() => getAllCountries(), [])

  useEffect(() => {
    setCountryCode(detectCountryFromBrowser())
  }, [])

  useEffect(() => {
    let active = true
    async function loadRates() {
      setRatesLoading(true)
      setRatesError(null)
      try {
        const response = await fetch('/api/currency/rates')
        if (!response.ok) {
          throw new Error('Failed to load exchange rates')
        }
        const data = await response.json()
        if (active) {
          setExchangeRates(data)
        }
      } catch (err) {
        console.error('Exchange rate error', err)
        if (active) {
          setRatesError('Using fallback exchange rates.')
          setExchangeRates(null)
        }
      } finally {
        if (active) {
          setRatesLoading(false)
        }
      }
    }
    loadRates()
    return () => {
      active = false
    }
  }, [])

  const handleAmountChange = (value: string) => {
    setAmount(value)
    const numValue = parseFloat(value)
    
    if (isNaN(numValue)) {
      setError('Please enter a valid number')
      return
    }
    
    const validation = validateAmount(numValue)
    if (!validation.valid) {
      setError(validation.error || 'Invalid amount')
      return
    }
    
    setError('')
    setBreakdown(calculateRevenueBreakdown(numValue))
  }

  const purchaseAmount = parseFloat(amount) || 0
  const countryConfig = getCountryConfig(countryCode)
  const conversion = convertToCountryCurrency(
    purchaseAmount,
    countryConfig.code,
    exchangeRates ?? undefined
  )
  const taxSummary = calculateTaxForCountry({
    countryCode: countryConfig.code,
    grossAmountZar: purchaseAmount,
    exchangeRates: exchangeRates ?? undefined,
  })

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <Card className="p-6 bg-card border-border shadow-card">
        <h2 className="text-2xl font-bold text-card-foreground mb-6">Revenue Calculator</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Enter Purchase Amount (ZAR)
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="Enter amount in Rands"
            className="bg-input border-border text-foreground"
            min="0.01"
            step="0.01"
          />
          {error && (
            <p className="text-destructive text-sm mt-2">{error}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Preview Currency & Tax Jurisdiction
          </label>
          <select
            value={countryCode}
            onChange={(event) => setCountryCode(event.target.value)}
            className="w-full rounded-md border border-border bg-background p-2 text-sm"
          >
            {countryList.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.currency.code})
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-2">
            Values shown in {countryConfig.currency.name} using live ZAR FX rates and {countryConfig.tax.name} rules.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gradient-primary rounded-lg">
            <span className="font-medium text-primary-foreground">Artist (60%)</span>
            <span className="text-lg font-bold text-primary-foreground">
              {formatZAR(breakdown.artist)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-accent/20 rounded-lg">
            <span className="font-medium text-accent-foreground">Influencer (10%)</span>
            <span className="text-lg font-bold text-accent-foreground">
              {formatZAR(breakdown.influencer)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
            <span className="font-medium text-secondary-foreground">SoundSync Platform (15%)</span>
            <span className="text-lg font-bold text-secondary-foreground">
              {formatZAR(breakdown.platform)}
            </span>
          </div>
          
          
          <div className="border-t border-border pt-4 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-card-foreground">Total</span>
              <span className="text-xl font-bold text-card-foreground">
                {formatZAR(parseFloat(amount) || 0)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-glow rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            Based on revenue model
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg border border-border bg-muted/20 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Local Currency</p>
              {ratesLoading ? (
                <Spinner size="sm" />
              ) : (
                <span className="text-xs text-muted-foreground">
                  {conversion.rate.toFixed(4)} {conversion.currency} per ZAR
                </span>
              )}
            </div>
            <p className="text-2xl font-semibold text-card-foreground">
              {formatCurrencyAmount(
                conversion.amount,
                countryConfig.currency.code,
                countryConfig.currency.locale
              )}
            </p>
            {ratesError && (
              <p className="text-xs text-destructive">{ratesError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Source: {exchangeRates?.source ?? 'fallback-static'} · Updated{' '}
              {new Date(conversion.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-muted/20 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {countryConfig.tax.name} ({(taxSummary.taxRate * 100).toFixed(1)}%)
            </p>
            <div className="text-card-foreground">
              <p className="text-lg font-semibold">
                Tax:{" "}
                {formatCurrencyAmount(
                  taxSummary.localTaxAmount,
                  countryConfig.currency.code,
                  countryConfig.currency.locale
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                Net:{" "}
                {formatCurrencyAmount(
                  taxSummary.localNetAmount,
                  countryConfig.currency.code,
                  countryConfig.currency.locale
                )}
                {"  ·  "}
                Total:{" "}
                {formatCurrencyAmount(
                  taxSummary.localTotalAmount,
                  countryConfig.currency.code,
                  countryConfig.currency.locale
                )}
              </p>
            </div>
            <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
              {taxSummary.complianceNotes.slice(0, 3).map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function RevenueBreakdownDisplay({ amount }: { amount: number }) {
  const breakdown = calculateRevenueBreakdown(amount);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center p-4 bg-gradient-primary rounded-lg">
        <div className="text-2xl font-bold text-primary-foreground">
          {formatZAR(breakdown.artist)}
        </div>
        <div className="text-sm text-primary-foreground/80">Artist (60%)</div>
      </div>
      
      <div className="text-center p-4 bg-accent/20 rounded-lg">
        <div className="text-2xl font-bold text-accent-foreground">
          {formatZAR(breakdown.influencer)}
        </div>
        <div className="text-sm text-accent-foreground/80">Influencer (10%)</div>
      </div>
      
      <div className="text-center p-4 bg-secondary/20 rounded-lg">
        <div className="text-2xl font-bold text-secondary-foreground">
          {formatZAR(breakdown.platform)}
        </div>
        <div className="text-sm text-secondary-foreground/80">Platform (15%)</div>
      </div>
      
    </div>
  );
}