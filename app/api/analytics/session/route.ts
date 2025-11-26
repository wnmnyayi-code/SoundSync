import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Get IP
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'

        // Mock GeoIP lookup for now (In production, use a library like geoip-lite or maxmind)
        // For demo purposes, we'll randomize slightly or default to South Africa
        const countries = ['South Africa', 'United Kingdom', 'United States', 'Nigeria', 'Kenya']
        const mockCountry = countries[Math.floor(Math.random() * countries.length)]

        // Update User
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                lastLoginIp: ip,
                country: mockCountry // In a real app, resolve this from IP
            }
        })

        return NextResponse.json({ success: true, country: mockCountry })
    } catch (error) {
        console.error('Analytics error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
