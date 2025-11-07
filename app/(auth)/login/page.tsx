'use client'
import { signIn, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { Spinner } from '@/components/ui/spinner'
import { Eye, EyeOff } from 'lucide-react'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      const route = session.user.role === 'CREATOR' ? '/creator/dashboard' : 
                   session.user.role === 'ADMIN' ? '/admin/dashboard' : 
                   '/fan/discover'
      router.push(route)
    }
  }, [status, session, router])

  const validateForm = () => {
    try {
      loginSchema.parse(formData)
      setErrors({})
      return true
    } catch (caught) {
      if (caught instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {}
        caught.issues.forEach((issue: z.ZodIssue) => {
          const key = String(issue.path?.[0] ?? 'form')
          newErrors[key] = issue.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || isLoading) return
    
    setIsLoading(true)
    try {
      // Get CSRF token from meta tag
      const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      if (!csrfToken) {
        throw new Error('CSRF token not found')
      }

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        csrfToken,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Invalid credentials',
            description: 'Please check your email and password and try again.',
            variant: 'destructive'
          })
        } else if (result.error === 'TooManyRequests') {
          const retryAfter = result.headers?.get('Retry-After') || '60'
          toast({
            title: 'Too many attempts',
            description: `Please wait ${retryAfter} seconds before trying again.`,
            variant: 'destructive'
          })
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive'
          })
        }
        return
      }

      // Login successful
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl')
      router.push(returnUrl || '/dashboard')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during sign in. Please try again.',
        variant: 'destructive'
      })
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
      <Card className="w-full max-w-md bg-dark-800 border-primary-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Login to SoundSync</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`bg-dark-700 border-primary-600 text-white ${
                  errors.email ? 'border-destructive' : ''
                }`}
                aria-invalid={!!errors.email}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email}</p>
              )}
            </div>
            <div className="space-y-1">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className={`bg-dark-700 border-primary-600 text-white pr-10 ${
                    errors.password ? 'border-destructive' : ''
                  }`}
                  aria-invalid={!!errors.password}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700"
              disabled={isLoading}
            >
              {isLoading ? <Spinner className="mr-2" /> : null}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}