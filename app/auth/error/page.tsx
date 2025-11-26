'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function AuthErrorPage() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    let errorMessage = 'An unknown error occurred'

    if (error === 'Configuration') {
        errorMessage = 'There is a problem with the server configuration.'
    } else if (error === 'AccessDenied') {
        errorMessage = 'You do not have permission to sign in.'
    } else if (error === 'Verification') {
        errorMessage = 'The sign in link is no longer valid.'
    } else if (error === 'OAuthSignin') {
        errorMessage = 'Error in constructing an authorization URL.'
    } else if (error === 'OAuthCallback') {
        errorMessage = 'Error in handling the response from an OAuth provider.'
    } else if (error === 'OAuthCreateAccount') {
        errorMessage = 'Could not create OAuth provider user in the database.'
    } else if (error === 'EmailCreateAccount') {
        errorMessage = 'Could not create email provider user in the database.'
    } else if (error === 'Callback') {
        errorMessage = 'Error in the OAuth callback handler route.'
    } else if (error === 'OAuthAccountNotLinked') {
        errorMessage = 'To confirm your identity, sign in with the same account you used originally.'
    } else if (error === 'SessionRequired') {
        errorMessage = 'Please sign in to access this page.'
    }

    return (
        <div className="container flex items-center justify-center min-h-screen py-12">
            <Card className="w-full max-w-md border-destructive/50 shadow-lg">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-destructive/10">
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-destructive">Authentication Error</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                    <div className="p-4 text-sm rounded-md bg-muted text-muted-foreground">
                        {errorMessage}
                        {error && error !== 'undefined' && (
                            <p className="mt-2 text-xs font-mono text-muted-foreground/70">Code: {error}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button asChild className="w-full" size="lg">
                            <Link href="/login">Back to Login</Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full">
                            <Link href="/">Go Home</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
