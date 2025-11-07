'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Spinner } from '@/components/ui/spinner'
import { PasswordStrength } from '@/components/ui/password-strength'
import { Eye, EyeOff } from 'lucide-react'
import { registerSchema, type RegisterFormData } from '@/types/auth'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState<RegisterFormData>({
    email: '',
    password: '',
    artistName: '',
    role: 'FAN'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // Clear artist name when switching to fan
    if (form.role === 'FAN') {
      setForm(prev => ({ ...prev, artistName: '' }))
    }
    // Clear any existing artist name errors
    setErrors(prev => ({ ...prev, artistName: '' }))
  }, [form.role])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error on input change
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const result = registerSchema.safeParse(form)
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0])
        newErrors[key] = issue.message
      })
      setErrors(newErrors)
      return false
    }
    
    if (form.role === 'CREATOR' && !form.artistName?.trim()) {
      setErrors({ artistName: 'Artist name is required for creators' })
      return false
    }

    setErrors({})
    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || isLoading) return
    
    setIsLoading(true)
    try {
      const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      if (!csrfToken) {
        throw new Error('CSRF token not found')
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 429) {
          const retryAfter = res.headers.get('Retry-After') || '60'
          toast({
            title: 'Registration rate limit exceeded',
            description: `Please wait ${retryAfter} seconds before trying again.`
          })
          return
        } 
        
        if (data.code === 'EMAIL_EXISTS') {
          setErrors({ email: 'This email is already registered' })
          toast({
            title: 'Registration failed',
            description: 'An account with this email already exists. Please login or reset your password.'
          })
        } else {
          toast({
            title: 'Registration failed',
            description: data.error || 'Unknown error occurred'
          })
        }
        return
      }

      toast({
        title: 'Account created',
        description: 'Please check your email for verification instructions.'
      })
      
      router.push('/login?email=' + encodeURIComponent(form.email))
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
      <Card className="w-full max-w-md bg-dark-800 border-primary-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Create your SoundSync account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6" noValidate>
            <div className="space-y-4">
              <div>
                <label htmlFor="role" className="text-sm text-gray-300 mb-1 block">
                  I want to...
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleInputChange}
                className="w-full bg-dark-700 border-primary-600 text-white rounded-md p-2"
                disabled={isLoading}
              >
                <option value="FAN">Listen to music</option>
                <option value="CREATOR">Share my music</option>
              </select>
            </div>

            {form.role === 'CREATOR' && (
              <div>
                <label htmlFor="artistName" className="text-sm text-gray-300 mb-1 block">
                  Artist Name
                </label>
                <Input
                  id="artistName"
                  name="artistName"
                  type="text"
                  value={form.artistName}
                  onChange={handleInputChange}
                  placeholder="Your stage name"
                  aria-describedby={errors.artistName ? 'artistName-error' : undefined}
                  className={errors.artistName ? 'border-destructive' : ''}
                  required
                  disabled={isLoading}
                />
                {errors.artistName && (
                  <p id="artistName-error" className="text-destructive text-sm mt-1" role="alert">
                    {errors.artistName}
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-sm text-gray-300 mb-1 block">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`bg-dark-700 border-primary-600 text-white ${errors.email ? 'border-destructive' : ''}`}
                required
                autoComplete="email"
                disabled={isLoading}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p id="email-error" className="text-destructive text-sm mt-1" role="alert">
                  {errors.email}
                </p>
              )}
              {errors.email && (
                <p id="email-error" className="text-destructive text-sm mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="text-sm text-gray-300 mb-1 block">
                Password
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder="Create a secure password"
                    className={`bg-dark-700 border-primary-600 text-white ${errors.password ? 'border-destructive' : ''}`}
                    required
                    minLength={8}
                    disabled={isLoading}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : 'password-requirements'}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password ? (
                  <p id="password-error" className="text-destructive text-sm" role="alert">
                    {errors.password}
                  </p>
                ) : (
                  <p id="password-requirements" className="text-gray-400 text-sm">
                    Password must be at least 8 characters long
                  </p>
                )}
                <PasswordStrength password={form.password} />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 transition-colors"
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

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-primary-400 hover:text-primary-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-400 hover:text-primary-300">
                  Privacy Policy
                </Link>
              </p>
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary-400 hover:text-primary-300">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}