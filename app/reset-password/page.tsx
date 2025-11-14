'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Music, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)

    try {
      // Simulate password reset - replace with actual reset logic
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setMessage('Password reset instructions have been sent to your email address.')
      
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      setError('Failed to send reset instructions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Music className="mx-auto h-12 w-12 text-accent" />
          <h2 className="mt-6 text-3xl font-bold text-foreground">Reset Password</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Password Reset</CardTitle>
            <CardDescription>
              We'll send you an email with reset instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {message && (
                <Alert className="border-green-500 text-green-700">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-border text-foreground"
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-white hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center text-sm text-accent hover:text-accent/80"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Remember your password? <Link href="/login" className="text-accent hover:text-accent/80">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}