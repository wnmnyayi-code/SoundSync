import { NextResponse } from 'next/server'
import { getExchangeRates } from '@/lib/currency'

export async function GET() {
  try {
    const rates = await getExchangeRates()
    return NextResponse.json(rates, { status: 200 })
  } catch (error) {
    console.error('Failed to load exchange rates', error)
    return NextResponse.json(
      { error: 'Unable to load exchange rates' },
      { status: 500 }
    )
  }
}

