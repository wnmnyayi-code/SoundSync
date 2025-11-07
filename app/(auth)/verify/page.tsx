"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams?.get('token') ?? ''
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const run = async () => {
      if (!token) return
      setIsLoading(true)
      try {
        const res = await fetch('/api/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
        const payload = await res.json()
        if (!res.ok) {
          toast({ title: 'Verification failed', description: payload?.error || 'Invalid token', className: 'bg-destructive' })
          return
        }
        toast({ title: 'Verified', description: 'Your account is now verified', className: 'bg-success' })
        router.push('/login')
      } catch (err) {
        console.error('Verify error', err)
        toast({ title: 'Error', description: 'Server error', className: 'bg-destructive' })
      } finally { setIsLoading(false) }
    }
    run()
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
      <Card className="w-full max-w-md bg-dark-800 border-primary-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Verifying account</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          {isLoading ? <><Spinner size="lg"/><p className="mt-4 text-gray-300">Verifying...</p></> : <p className="text-gray-300">Processing...</p>}
          <div className="mt-6">
            <Button onClick={() => router.push('/login')}>Go to login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
