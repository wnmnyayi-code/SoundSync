import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Redirect to role-specific dashboard
  const role = session.user.role.toLowerCase()
  const roleMap: Record<string, string> = {
    'admin': '/admin',
    'creator': '/dashboard/artist',
    'merchant': '/dashboard/merchant',
    'influencer': '/dashboard/influencer',
    'fan': '/dashboard/fan'
  }

  const redirectUrl = roleMap[role] || '/dashboard/fan'
  redirect(redirectUrl)
}
