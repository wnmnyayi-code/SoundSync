'use client'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

const PENDING_CREATORS = [
  { id: '1', name: 'Lil Nas X', email: 'lil@example.com', idVerified: true },
  { id: '2', name: 'Tyla', email: 'tyla@example.com', idVerified: true },
]

export default function AdminApprovals() {
  const [creators, setCreators] = useState(PENDING_CREATORS)

  const handleApproval = async (creatorId: string, approved: boolean) => {
    // API call to approve/reject
    setCreators(creators.filter(c => c.id !== creatorId))
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-primary">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Creator Approvals</h1>
        
        <div className="space-y-4">
          {creators.map(creator => (
            <Card key={creator.id} className="bg-dark-800 border-primary-700">
              <CardContent className="p-6 flex items-center justify-between">
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}