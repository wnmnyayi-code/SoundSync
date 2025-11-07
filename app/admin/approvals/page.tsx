'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X, Search, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

interface Creator {
  id: string
  name: string
  email: string
  idVerified: boolean
  createdAt: string
  socialLinks: string[]
  verificationDocuments: string[]
}

export default function AdminApprovals() {
  const { data: session, status } = useSession()
  const [creators, setCreators] = useState<Creator[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [adminNote, setAdminNote] = useState<string>('')

  // Protect admin route
  if (status === 'loading') return null
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  useEffect(() => {
    fetchCreators()
  }, [])

  const fetchCreators = async () => {
    try {
      const res = await fetch('/api/admin/pending-creators')
      if (!res.ok) throw new Error('Failed to fetch creators')
      const data = await res.json()
      setCreators(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load pending creators',
        className: 'bg-destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproval = async (creatorId: string, approved: boolean) => {
    setProcessingId(creatorId)
    try {
      const res = await fetch('/api/admin/verify-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          creatorId, 
          approved,
          adminNote 
        })
      })

      if (!res.ok) throw new Error('Failed to process approval')
      
      setCreators(prev => prev.filter(c => c.id !== creatorId))
      toast({
        title: 'Success',
        description: `Creator ${approved ? 'approved' : 'rejected'} successfully`,
        className: 'bg-success'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process approval',
        className: 'bg-destructive'
      })
    } finally {
      setProcessingId(null)
    }
  }

  const filteredCreators = creators.filter(creator => 
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen p-8 bg-gradient-primary">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Creator Approvals</h1>
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search creators..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredCreators.map(creator => (
            <Card key={creator.id} className="bg-dark-800 border-primary-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{creator.name}</h3>
                    <p className="text-gray-400">{creator.email}</p>
                    <p className="text-green-400 text-sm mt-1">✓ ID Verified</p>
                  </div>
                  <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproval(creator.id, true)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleApproval(creator.id, false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}