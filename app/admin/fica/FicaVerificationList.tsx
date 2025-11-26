'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle, XCircle, FileText, ExternalLink, Calendar } from 'lucide-react'
import Link from 'next/link'

type Application = {
    id: string
    name: string | null
    email: string | null
    image: string | null
    ficaDocumentUrl: string | null
    ficaSubmittedAt: Date | null
}

export function FicaVerificationList({ applications }: { applications: Application[] }) {
    const router = useRouter()
    const { toast } = useToast()
    const [processingId, setProcessingId] = useState<string | null>(null)

    const handleVerify = async (userId: string, approved: boolean, storeType: 'RENTED' | 'PERMANENT' = 'RENTED') => {
        setProcessingId(userId)
        try {
            const res = await fetch('/api/admin/fica/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, approved, storeType })
            })

            if (!res.ok) throw new Error('Verification failed')

            toast({
                title: approved ? "Application Approved" : "Application Rejected",
                description: `User has been ${approved ? 'verified' : 'rejected'}.`,
            })

            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive"
            })
        } finally {
            setProcessingId(null)
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">FICA Verification</h1>
                    <p className="text-muted-foreground">Review and approve store applications.</p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                    {applications.length} Pending
                </Badge>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/10">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">All caught up!</h3>
                    <p className="text-muted-foreground">No pending FICA applications to review.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map((app) => (
                        <Card key={app.id}>
                            <CardHeader className="flex flex-row items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={app.image || undefined} />
                                        <AvatarFallback>{app.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle>{app.name}</CardTitle>
                                        <CardDescription>{app.email}</CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                    <Calendar className="w-4 h-4" />
                                    Submitted {app.ficaSubmittedAt ? new Date(app.ficaSubmittedAt).toLocaleDateString() : 'Unknown'}
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/30">
                                    <FileText className="w-8 h-8 text-primary" />
                                    <div className="flex-1">
                                        <p className="font-medium">FICA Documents</p>
                                        <p className="text-xs text-muted-foreground">ID and Proof of Address</p>
                                    </div>
                                    {app.ficaDocumentUrl && (
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={app.ficaDocumentUrl} target="_blank">
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                View Documents
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-end gap-3 border-t bg-muted/10 pt-4">
                                <Button
                                    variant="destructive"
                                    onClick={() => handleVerify(app.id, false)}
                                    disabled={processingId === app.id}
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="border-green-600 text-green-600 hover:bg-green-50"
                                        onClick={() => handleVerify(app.id, true, 'RENTED')}
                                        disabled={processingId === app.id}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve (Rented)
                                    </Button>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleVerify(app.id, true, 'PERMANENT')}
                                        disabled={processingId === app.id}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve (Permanent)
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
