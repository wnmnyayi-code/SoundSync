'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Spinner } from '@/components/ui/spinner'
import { PasswordStrength } from '@/components/ui/password-strength'
import { Eye, EyeOff, Music, Users, ShoppingBag, TrendingUp, Shield } from 'lucide-react'

type UserRole = 'FAN' | 'ARTIST' | 'MERCHANT' | 'INFLUENCER'
type SubscriptionTier = 'BASIC' | 'STANDARD' | 'PREMIUM'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState({
    email: '',
    password: '',
    artistName: '',
    primaryRole: 'FAN' as UserRole,
    subscriptionTier: 'BASIC' as SubscriptionTier,
    artistStatus: 'INDEPENDENT' as 'INDEPENDENT' | 'SIGNED' | 'REGISTERED',
    sarsNumber: '',
    sambro: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const roles = [
    { id: 'FAN' as UserRole, name: 'Fan', icon: Users, description: 'Join live parties, follow artists' },
    { id: 'ARTIST' as UserRole, name: 'Artist', icon: Music, description: 'Create playlists, sell music' },
    { id: 'MERCHANT' as UserRole, name: 'Merchant', icon: ShoppingBag, description: 'Sell products & tools' },
    { id: 'INFLUENCER' as UserRole, name: 'Influencer', icon: TrendingUp, description: 'Earn commissions' },
  ]

  const subscriptionTiers = [
    { id: 'BASIC' as SubscriptionTier, name: 'Basic', price: 'Free', roles: 1, description: 'Access one role' },
    { id: 'STANDARD' as SubscriptionTier, name: 'Standard', price: 'R99/mo', roles: 2, description: 'Access two roles' },
    { id: 'PREMIUM' as SubscriptionTier, name: 'Premium', price: 'R199/mo', roles: 4, description: 'Access all roles' },
  ]

  useEffect(() => {
    // Clear role-specific fields when switching roles
    if (form.primaryRole === 'FAN' || form.primaryRole === 'INFLUENCER') {
      setForm(prev => ({ ...prev, artistName: '', sarsNumber: '', sambro: '', artistStatus: 'INDEPENDENT' }))
    }
    setErrors(prev => ({ ...prev, artistName: '', sarsNumber: '', sambro: '' }))
  }, [form.primaryRole])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Valid email is required'
    }
    
    if (!form.password || form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (form.primaryRole === 'ARTIST' && !form.artistName?.trim()) {
      newErrors.artistName = 'Artist name is required for artists'
    }

    if ((form.primaryRole === 'ARTIST' || form.primaryRole === 'MERCHANT') && !form.sarsNumber?.trim()) {
      newErrors.sarsNumber = 'SARS clearance certificate is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || isLoading) return
    
    setIsLoading(true)
    try {
      // For demo: save to localStorage
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email: form.email,
        primaryRole: form.primaryRole,
        roles: [form.primaryRole],
        subscriptionTier: form.subscriptionTier,
        artistName: form.artistName,
        artistStatus: form.artistStatus,
        sarsNumber: form.sarsNumber,
        sambro: form.sambro,
        coins: 0,
        verified: false
      }
      localStorage.setItem('user', JSON.stringify(userData))

      toast({
        title: 'Account created',
        description: 'Welcome to SoundSync! Redirecting to dashboard...'
      })
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (err) {
      console.error('Register error:', err)
      toast({
        title: 'Error',
        description: 'An error occurred during registration.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <Music className="mx-auto h-12 w-12 text-accent" />
          <h2 className="mt-6 text-3xl font-bold text-foreground">Join SoundSync</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            South Africa's premier music platform
          </p>
        </div>

        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Subscription Tier Selection */}
              <div className="space-y-3">
                <Label>Select Subscription Tier</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subscriptionTiers.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, subscriptionTier: tier.id }))}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        form.subscriptionTier === tier.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-lg font-bold text-foreground">{tier.name}</div>
                      <div className="text-sm text-accent font-semibold">{tier.price}</div>
                      <div className="text-xs text-muted-foreground mt-2">{tier.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <Label>Select Your Primary Role</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, primaryRole: role.id }))}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          form.primaryRole === role.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${
                          form.primaryRole === role.id ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <div className="text-sm font-medium text-foreground">{role.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{role.description}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Artist-specific fields */}
              {form.primaryRole === 'ARTIST' && (
                <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                  <div>
                    <Label htmlFor="artistName">Artist Name *</Label>
                    <Input
                      id="artistName"
                      name="artistName"
                      value={form.artistName}
                      onChange={handleInputChange}
                      placeholder="Your stage name"
                      className={errors.artistName ? 'border-destructive' : ''}
                    />
                    {errors.artistName && <p className="text-destructive text-sm mt-1">{errors.artistName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="artistStatus">Artist Status</Label>
                    <select
                      id="artistStatus"
                      name="artistStatus"
                      value={form.artistStatus}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-input rounded-md p-2 text-foreground"
                    >
                      <option value="INDEPENDENT">Independent</option>
                      <option value="SIGNED">Signed</option>
                      <option value="REGISTERED">Registered</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="sarsNumber">SARS Clearance Certificate Number *</Label>
                    <Input
                      id="sarsNumber"
                      name="sarsNumber"
                      value={form.sarsNumber}
                      onChange={handleInputChange}
                      placeholder="SARS certificate number"
                      className={errors.sarsNumber ? 'border-destructive' : ''}
                    />
                    {errors.sarsNumber && <p className="text-destructive text-sm mt-1">{errors.sarsNumber}</p>}
                  </div>

                  <div>
                    <Label htmlFor="sambro">SAMBRO Registration (Optional)</Label>
                    <Input
                      id="sambro"
                      name="sambro"
                      value={form.sambro}
                      onChange={handleInputChange}
                      placeholder="SAMBRO number or leave blank"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Don't have SAMBRO? We can help you apply for a fee
                    </p>
                  </div>
                </div>
              )}

              {/* Merchant-specific fields */}
              {form.primaryRole === 'MERCHANT' && (
                <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                  <div>
                    <Label htmlFor="sarsNumber">SARS Clearance Certificate Number *</Label>
                    <Input
                      id="sarsNumber"
                      name="sarsNumber"
                      value={form.sarsNumber}
                      onChange={handleInputChange}
                      placeholder="SARS certificate number"
                      className={errors.sarsNumber ? 'border-destructive' : ''}
                    />
                    {errors.sarsNumber && <p className="text-destructive text-sm mt-1">{errors.sarsNumber}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      Required for selling physical/digital items
                    </p>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
                <PasswordStrength password={form.password} />
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-white hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-accent hover:text-accent/80">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <div className="flex justify-center items-center space-x-4 mb-2">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-green-400" />
              <span>SARS Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🇿🇦</span>
              <span>South Africa Only</span>
            </div>
          </div>
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
          <p className="mt-1">All prices include 15% VAT</p>
        </div>
      </div>
    </div>
  )
}