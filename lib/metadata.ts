// src/lib/metadata.ts
import { headers } from 'next/headers'

export async function generateCsrfMetaTags() {
  const headersList = await headers()
  const csrfToken = headersList.get('x-csrf-token')
  return [
    { name: 'csrf-token', content: csrfToken || '' }
  ]
}