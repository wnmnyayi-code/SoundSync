// app/unauthorized/page.tsx
'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Unauthorized() {
  const router = useRouter()
  
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">401</h1>
      <h2 className="text-2xl">Unauthorized</h2>
      <p className="text-muted-foreground">
        You don't have permission to view this page.
      </p>
      <div className="flex space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          Go back
        </Button>
        <Button onClick={() => router.push('/')}>Go home</Button>
      </div>
    </div>
  )
}