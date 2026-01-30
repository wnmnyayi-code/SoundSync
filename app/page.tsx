import Link from 'next/link'
import { Music, Users, ShoppingBag, TrendingUp, Radio, Coins, Upload, BarChart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6 gradient-text text-glow animate-fade-in">
              Empower Your Music Journey
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Upload tracks, host live listening parties, connect with fans, and monetize your creativity. 
              SoundSync brings artists, fans, merchants, and influencers together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Link href="/auth/register">
                <Button size="lg" className="gradient-primary hover:opacity-90 shadow-glow text-lg px-8 py-6">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-card">
                  Explore Music
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                <span>10,000+ Tracks</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>5,000+ Artists</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-primary" />
                <span>Live Sessions Daily</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Roles Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Four Ways to Thrive</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose your path or combine roles to maximize your earnings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Artist */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:shadow-glow transition-all card-hover group">
              <div className="role-artist w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-glow">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:gradient-text transition-all">Artist</h3>
              <p className="text-muted-foreground mb-4">
                Upload your music, host live sessions, and earn 60% revenue on every stream
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-primary" />
                  <span>Upload MP3, WAV, FLAC</span>
                </li>
                <li className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-primary" />
                  <span>Host live listening parties</span>
                </li>
                <li className="flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-primary" />
                  <span>Track analytics & earnings</span>
                </li>
              </ul>
              <Link href="/auth/register?role=artist" className="mt-6 block">
                <Button className="w-full role-artist hover:opacity-90">
                  Start as Artist
                </Button>
              </Link>
            </Card>

            {/* Fan */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:shadow-glow transition-all card-hover group">
              <div className="role-fan w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-glow">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:gradient-text transition-all">Fan</h3>
              <p className="text-muted-foreground mb-4">
                Stream unlimited music, attend live parties, and support your favorite artists
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-blue-500" />
                  <span>Stream high-quality audio</span>
                </li>
                <li className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-blue-500" />
                  <span>Join exclusive live sessions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-blue-500" />
                  <span>Tip artists directly</span>
                </li>
              </ul>
              <Link href="/auth/register?role=fan" className="mt-6 block">
                <Button className="w-full role-fan hover:opacity-90">
                  Join as Fan
                </Button>
              </Link>
            </Card>

            {/* Merchant */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:shadow-glow transition-all card-hover group">
              <div className="role-merchant w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-glow">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:gradient-text transition-all">Merchant</h3>
              <p className="text-muted-foreground mb-4">
                Sell equipment and digital products, keep 90% of every sale
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-green-500" />
                  <span>List physical & digital products</span>
                </li>
                <li className="flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-green-500" />
                  <span>Track sales & analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-green-500" />
                  <span>90% revenue share</span>
                </li>
              </ul>
              <Link href="/auth/register?role=merchant" className="mt-6 block">
                <Button className="w-full role-merchant hover:opacity-90">
                  Sell on SoundSync
                </Button>
              </Link>
            </Card>

            {/* Influencer */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:shadow-glow transition-all card-hover group">
              <div className="role-influencer w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-glow">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:gradient-text transition-all">Influencer</h3>
              <p className="text-muted-foreground mb-4">
                Promote artists and products, earn 10% commission on every referral
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span>Get unique referral links</span>
                </li>
                <li className="flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-orange-500" />
                  <span>Track conversions & earnings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-orange-500" />
                  <span>10% commission rate</span>
                </li>
              </ul>
              <Link href="/auth/register?role=influencer" className="mt-6 block">
                <Button className="w-full role-influencer hover:opacity-90">
                  Become Influencer
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Coin Economy Section */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary mb-6 shadow-glow">
              <Coins className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Simple Coin Economy</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Buy coins once, use them for tips, RSVPs, purchases, and more
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-card border-border hover:shadow-glow transition-all">
                <div className="text-3xl font-bold gradient-text mb-2">R10</div>
                <div className="text-4xl font-black mb-2">200 coins</div>
                <div className="text-sm text-muted-foreground">R0.05 per coin</div>
              </Card>
              
              <Card className="p-6 bg-card border-primary border-2 shadow-glow relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  Popular
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">R25</div>
                <div className="text-4xl font-black mb-2">500 coins</div>
                <div className="text-sm text-muted-foreground">R0.05 per coin</div>
              </Card>
              
              <Card className="p-6 bg-card border-border hover:shadow-glow transition-all">
                <div className="text-3xl font-bold gradient-text mb-2">R50</div>
                <div className="text-4xl font-black mb-2">1000 coins</div>
                <div className="text-sm text-muted-foreground">R0.05 per coin</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Flexible pricing to match your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Tier */}
            <Card className="p-8 bg-card border-border hover:shadow-glow transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Basic</h3>
                <div className="text-4xl font-black mb-4">
                  <span className="gradient-text">Free</span>
                </div>
                <p className="text-muted-foreground">Perfect to get started</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">1 user role</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Basic platform features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Community support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Basic analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">100 coin welcome bonus</span>
                </li>
              </ul>
              
              <Link href="/auth/register" className="block">
                <Button className="w-full border-2 border-primary hover:bg-primary/10">
                  Get Started Free
                </Button>
              </Link>
            </Card>

            {/* Standard Tier */}
            <Card className="p-8 bg-card border-primary border-2 shadow-glow relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white text-sm px-4 py-1 rounded-full font-semibold">
                Most Popular
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Standard</h3>
                <div className="text-4xl font-black mb-1">
                  <span className="gradient-text">R99</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">per month</p>
                <p className="text-muted-foreground">For serious creators</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm font-medium">2 user roles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Advanced features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Enhanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Early access to features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">500 bonus coins monthly</span>
                </li>
              </ul>
              
              <Link href="/auth/register?tier=standard" className="block">
                <Button className="w-full gradient-primary hover:opacity-90 shadow-glow">
                  Start Standard Plan
                </Button>
              </Link>
            </Card>

            {/* Premium Tier */}
            <Card className="p-8 bg-card border-border hover:shadow-glow transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-black mb-1">
                  <span className="gradient-text">R199</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">per month</p>
                <p className="text-muted-foreground">For professionals</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm font-medium">All 4 user roles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Premium features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">VIP support (24/7)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Advanced analytics & insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Beta features access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">1000 bonus coins monthly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">Performance bonuses</span>
                </li>
              </ul>
              
              <Link href="/auth/register?tier=premium" className="block">
                <Button className="w-full gradient-primary hover:opacity-90">
                  Start Premium Plan
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to succeed in the music industry
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Audio Processing</h3>
              <p className="text-muted-foreground">
                Automated mastering, LUFS normalization, and high-quality encoding
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Radio className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Live Sessions</h3>
              <p className="text-muted-foreground">
                Host real-time listening parties with chat and tipping
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <BarChart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-muted-foreground">
                Track streams, earnings, and audience insights in real-time
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Marketplace</h3>
              <p className="text-muted-foreground">
                Buy and sell music equipment, plugins, and digital products
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fair Revenue</h3>
              <p className="text-muted-foreground">
                Artists keep 60%, merchants keep 90% of their earnings
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Social Integration</h3>
              <p className="text-muted-foreground">
                Connect your social media and grow your audience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Music Career?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of artists, fans, merchants, and influencers already thriving on SoundSync
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="gradient-primary hover:opacity-90 shadow-glow text-lg px-12 py-6">
                Get Started Today - It's Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
