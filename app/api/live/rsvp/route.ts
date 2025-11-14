import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Mock RSVP success
    return NextResponse.json({
      success: true,
      message: 'RSVP confirmed',
      sessionId
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process RSVP' },
      { status: 500 }
    )
  }
}