"use client"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { z } from "zod"

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm: z.string().min(8),
})

export default function ResetPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams?.get("token") ?? ''

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      toast({ title: 'Missing token', description: 'No reset token provided', className: 'bg-destructive' })
      router.push('/reset/request')
    }
  }, [token, router])

  const validate = () => {
    setErrors({})
    try {
      resetSchema.parse({ password, confirm })
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.issues.forEach(issue => {
          const key = String(issue.path[0] ?? 'form')
          setErrors(prev => ({ ...prev, [key]: issue.message }))
        })
      }
      return false
    }

    if (password !== confirm) {
      setErrors({ confirm: 'Passwords do not match' })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      const payload = await res.json()
      if (!res.ok) {
        toast({ title: 'Error', description: payload?.error || 'Reset failed', className: 'bg-destructive' })
        return
      }

      toast({ title: 'Password reset', description: 'You can now sign in with your new password', className: 'bg-success' })
      router.push('/login')
    } catch (err) {
      console.error('Reset error', err)
      toast({ title: 'Error', description: 'Server error', className: 'bg-destructive' })
    } finally { setIsLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
      <Card className="w-full max-w-md bg-dark-800 border-primary-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Set a new password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className={`bg-dark-700 border-primary-600 text-white ${errors.password ? 'border-destructive' : ''}`} required />
            {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}

            <Input type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={`bg-dark-700 border-primary-600 text-white ${errors.confirm ? 'border-destructive' : ''}`} required />
            {errors.confirm && <p className="text-destructive text-sm">{errors.confirm}</p>}

            <Button type="submit" className="w-full bg-primary-600" disabled={isLoading}>{isLoading ? <><Spinner className="mr-2" /> Applying...</> : 'Set password'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
