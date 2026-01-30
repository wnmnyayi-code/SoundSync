'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Music, Users, ShoppingBag, TrendingUp } from 'lucide-react'

const ROLES = [
  {
    id: 'ARTIST',
    name: 'Artist',
    icon: Music,
    description: 'Upload music and host live sessions',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'FAN',
    name: 'Fan',
    icon: Users,
    description: 'Stream music and support artists',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'MERCHANT',
    name: 'Merchant',
    icon: ShoppingBag,
    description: 'Sell products and equipment',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'INFLUENCER',
    name: 'Influencer',
    icon: TrendingUp,
    description: 'Promote and earn commissions',
    color: 'from-orange-500 to-red-500',
  },
]

export default function SignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: [] as string[],
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(r => r !== roleId)
        : [...prev.roles, roleId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.roles.length === 0) {
      setError('Please select at least one role')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          roles: formData.roles,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Auto sign in after registration
      router.push('/signin?registered=true')
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold gradient-text mb-4">
            <Music className="w-8 h-8" />
            SoundSync
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Join thousands of artists, fans, and creators</p>
        </div>

        <div className="bg-card border-border rounded-2xl p-8 shadow-card">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 1 ? 'border-primary bg-primary/20' : 'border-muted'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Account</span>
            </div>
            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 2 ? 'border-primary bg-primary/20' : 'border-muted'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Roles</span>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-input border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-input border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 bg-input border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-muted-foreground mt-1">At least 8 characters</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-input border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full gradient-primary hover:opacity-90 shadow-glow text-lg py-6"
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Choose Your Role(s)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select one or more roles. You can add more later with a subscription.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ROLES.map((role) => {
                      const Icon = role.icon
                      const isSelected = formData.roles.includes(role.id)

                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => handleRoleToggle(role.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'border-primary shadow-glow bg-primary/10'
                              : 'border-border hover:border-primary/50 bg-card'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-r ${role.color}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-bold mb-1">{role.name}</h4>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || formData.roles.length === 0}
                    className="flex-1 gradient-primary hover:opacity-90 shadow-glow"
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/signin" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
