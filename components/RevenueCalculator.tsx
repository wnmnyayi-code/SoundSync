'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  calculateRevenueBreakdown, 
  formatZAR, 
  validateAmount 
} from '@/lib/revenue';

export function RevenueCalculator() {
  const [amount, setAmount] = useState<string>('100');
  const [breakdown, setBreakdown] = useState(() => calculateRevenueBreakdown(100));
  const [error, setError] = useState<string>('');

  const handleAmountChange = (value: string) => {
    setAmount(value);
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }
    
    const validation = validateAmount(numValue);
    if (!validation.valid) {
      setError(validation.error || 'Invalid amount');
      return;
    }
    
    setError('');
    setBreakdown(calculateRevenueBreakdown(numValue));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
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
          
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <span className="font-medium text-muted-foreground">VAT (15%)</span>
            <span className="text-lg font-bold text-muted-foreground">
              {formatZAR(breakdown.vat)}
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
            Based on South African revenue model with 15% VAT
          </p>
        </div>
      </Card>
    </div>
  );
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
      
      <div className="text-center p-4 bg-muted rounded-lg">
        <div className="text-2xl font-bold text-muted-foreground">
          {formatZAR(breakdown.vat)}
        </div>
        <div className="text-sm text-muted-foreground/80">VAT (15%)</div>
      </div>
    </div>
  );
}