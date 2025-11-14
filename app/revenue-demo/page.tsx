import { RevenueCalculator, RevenueBreakdownDisplay } from '@/components/RevenueCalculator';
import { formatZAR } from '@/lib/revenue';
import { Card } from '@/components/ui/card';

export default function RevenueDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            SoundSync Revenue Model
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparent revenue distribution for South African artists, influencers, and creators
          </p>
        </div>

        {/* Revenue Calculator */}
        <section className="mb-12">
          <RevenueCalculator />
        </section>

        {/* Example Revenue Breakdowns */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Example Revenue Breakdowns
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Small Purchase (R50)
              </h3>
              <RevenueBreakdownDisplay amount={50} />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Medium Purchase (R200)
              </h3>
              <RevenueBreakdownDisplay amount={200} />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Large Purchase (R500)
              </h3>
              <RevenueBreakdownDisplay amount={500} />
            </div>
          </div>
        </section>

        {/* Revenue Model Information */}
        <section className="mb-12">
          <Card className="p-8 bg-card border-border shadow-card">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">
              Revenue Distribution Model
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Revenue Shares
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Artist: 60% of net amount</li>
                  <li>• Influencer: 10% of net amount</li>
                  <li>• SoundSync Platform: 15% of net amount</li>
                  <li>• SARS VAT: 15% of gross amount</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Withdrawal Thresholds
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Artists: {formatZAR(1000)} minimum</li>
                  <li>• Influencers: {formatZAR(1000)} minimum</li>
                  <li>• Merchants: {formatZAR(1000)} minimum</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-glow rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                All transactions are processed in South African Rand (ZAR) with 15% VAT applied.
                This model ensures fair compensation for all parties while maintaining tax compliance.
              </p>
            </div>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join SoundSync and start monetizing your music today
          </p>
          <div className="space-x-4">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 shadow-glow">
              Sign Up as Artist
            </button>
            <button className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary hover:text-primary-foreground">
              Learn More
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}