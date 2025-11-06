'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: '',
    artistName: '',
    role: 'FAN',
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        password: form.password, // In production, hash this!
      })
    })

    if (res.ok) {
      router.push('/login')
    } else {
      alert('Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
      <Card className="w-full max-w-md bg-dark-800 border-primary-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Join SoundSync</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="bg-dark-700 border-primary-600 text-white"
            />
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="bg-dark-700 border-primary-600 text-white"
            />
            <select
              onChange={(e) => setForm({...form, role: e.target.value})}
              className="w-full p-2 bg-dark-700 border border-primary-600 text-white rounded"
            >
              <option value="FAN">Fan</option>
              <option value="CREATOR">Creator</option>
            </select>
            {form.role === 'CREATOR' && (
              <Input
                placeholder="Artist Name"
                onChange={(e) => setForm({...form, artistName: e.target.value})}
                className="bg-dark-700 border-primary-600 text-white"
              />
            )}
            <Button type="submit" className="w-full bg-primary-600">
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}