import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { sessionId, licenseRequest } = await req.json()

  // Forward to DRM provider (KeyOS, BuyDRM, etc.)
  const drmResponse = await fetch(process.env.DRM_LICENSE_SERVER!, {
    method: 'POST',
    headers: {
      'X-Session-ID': sessionId,
      'Authorization': `Bearer ${process.env.DRM_API_KEY}`,
    },
    body: new Uint8Array(licenseRequest)
  })

  const license = await drmResponse.arrayBuffer()
  return new NextResponse(license)
}