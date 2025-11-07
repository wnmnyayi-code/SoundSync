"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { z } from "zod"

const requestSchema = z.object({ email: z.string().email("Please enter a valid email") })

export default function ResetRequestPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      requestSchema.parse({ email })
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors({ email: err.issues[0]?.message })
      }
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        toast({ title: "Error", description: payload?.error || "Failed to request reset", className: "bg-destructive" })
        return
      }

      // For dev the token is logged server-side; instruct the user
      toast({ title: "Reset requested", description: "If the email exists, a reset token was created. Check server logs or your email.", className: "bg-primary" })
      router.push("/login")
    } catch (err) {
      console.error("Reset request error", err)
      toast({ title: "Error", description: "Server error", className: "bg-destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
      <Card className="w-full max-w-md bg-dark-800 border-primary-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Password Reset</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              type="email"
              className={`bg-dark-700 border-primary-600 text-white ${errors.email ? 'border-destructive' : ''}`}
              required
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}

            <Button type="submit" className="w-full bg-primary-600" disabled={isLoading}>
              {isLoading ? <><Spinner className="mr-2"/> Requesting...</> : 'Request reset'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
