// SoundSync Revenue Model - South Africa Only
// Based on SoundSync_Revenue_Structure.txt

export interface RevenueBreakdown {
  artist: number;      // 60% of total
  influencer: number;   // 10% of total
  platform: number;   // 15% of total
  vat: number;        // 15% of total
}

export interface UserWithdrawalThresholds {
  artist: number;
  influencer: number;
  merchant: number;
}

export const REVENUE_CONSTANTS = {
  // Revenue distribution percentages
  ARTIST_SHARE: 0.60,      // 60%
  INFLUENCER_SHARE: 0.10,  // 10%
  PLATFORM_SHARE: 0.15,    // 15%
  VAT_RATE: 0.15,          // 15% (South African VAT)
  
  // Withdrawal thresholds in ZAR (updated per structure.txt)
  WITHDRAWAL_THRESHOLDS: {
    artist: 1000,
    influencer: 1000,
    merchant: 1000,
  } as UserWithdrawalThresholds,
  
  // Currency and location settings
  CURRENCY: 'ZAR',
  LOCATION_RESTRICTION: 'South Africa Only',
  VAT_RATE_DISPLAY: '15%',
} as const;

/**
 * Calculate revenue breakdown for a given amount
 * @param totalAmount - Total amount in ZAR (including VAT)
 * @returns RevenueBreakdown object with amounts for each party
 */
export function calculateRevenueBreakdown(totalAmount: number): RevenueBreakdown {
  const vatAmount = totalAmount * REVENUE_CONSTANTS.VAT_RATE;
  const netAmount = totalAmount - vatAmount;
  
  return {
    artist: netAmount * REVENUE_CONSTANTS.ARTIST_SHARE,
    influencer: netAmount * REVENUE_CONSTANTS.INFLUENCER_SHARE,
    platform: netAmount * REVENUE_CONSTANTS.PLATFORM_SHARE,
    vat: vatAmount,
  };
}

/**
 * Calculate net amount before VAT from gross amount
 * @param grossAmount - Total amount including VAT
 * @returns Net amount excluding VAT
 */
export function calculateNetAmount(grossAmount: number): number {
  return grossAmount / (1 + REVENUE_CONSTANTS.VAT_RATE);
}

/**
 * Calculate VAT amount from gross amount
 * @param grossAmount - Total amount including VAT
 * @returns VAT amount
 */
export function calculateVATAmount(grossAmount: number): number {
  return grossAmount - calculateNetAmount(grossAmount);
}

/**
 * Check if user can withdraw based on their role and balance
 * @param role - User role (artist, influencer, merchant)
 * @param balance - Current balance in ZAR
 * @returns Boolean indicating if withdrawal is allowed
 */
export function canWithdraw(role: keyof UserWithdrawalThresholds, balance: number): boolean {
  const threshold = REVENUE_CONSTANTS.WITHDRAWAL_THRESHOLDS[role];
  return balance >= threshold;
}

/**
 * Get withdrawal threshold for a specific role
 * @param role - User role (artist, influencer, merchant)
 * @returns Withdrawal threshold amount in ZAR
 */
export function getWithdrawalThreshold(role: keyof UserWithdrawalThresholds): number {
  return REVENUE_CONSTANTS.WITHDRAWAL_THRESHOLDS[role];
}

/**
 * Format currency amount in ZAR format
 * @param amount - Amount in cents or rands
 * @param inCents - Whether the amount is in cents (default: false)
 * @returns Formatted currency string
 */
export function formatZAR(amount: number, inCents = false): string {
  const randAmount = inCents ? amount / 100 : amount;
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(randAmount);
}

/**
 * Validate if amount is valid for South African market
 * @param amount - Amount to validate
 * @returns Object with validity status and error message if invalid
 */
export function validateAmount(amount: number): { valid: boolean; error?: string } {
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than zero' };
  }
  
  if (amount > 1000000) { // R1 million max for single transaction
    return { valid: false, error: 'Amount exceeds maximum transaction limit' };
  }
  
  if (!Number.isFinite(amount)) {
    return { valid: false, error: 'Amount must be a valid number' };
  }
  
  return { valid: true };
}

/**
 * Example usage and testing
 */
export function exampleRevenueCalculation(): void {
  const purchaseAmount = 100; // R100
  const breakdown = calculateRevenueBreakdown(purchaseAmount);
  
  console.log(`Revenue breakdown for R${purchaseAmount}:`);
  console.log(`Artist (60%): ${formatZAR(breakdown.artist)}`);
  console.log(`Influencer (10%): ${formatZAR(breakdown.influencer)}`);
  console.log(`Platform (15%): ${formatZAR(breakdown.platform)}`);
  console.log(`VAT (15%): ${formatZAR(breakdown.vat)}`);
  console.log(`Total: ${formatZAR(Object.values(breakdown).reduce((sum, val) => sum + val, 0))}`);
  
  // Test withdrawal eligibility
  console.log(`\nWithdrawal eligibility:`);
  console.log(`Artist with R500: ${canWithdraw('artist', 500)}`);
  console.log(`Artist with R1500: ${canWithdraw('artist', 1500)}`);
  console.log(`Influencer with R800: ${canWithdraw('influencer', 800)}`);
}