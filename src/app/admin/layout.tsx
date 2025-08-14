// app/admin/layout.tsx
import type { ReactNode } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions, allowedEmails } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import AdminProviders from './AdminProviders'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent('/admin')}`)
  }
  const email = session.user?.email || ''
  if (!allowedEmails.includes(email)) {
    redirect('/')
  }
  return <AdminProviders>{children}</AdminProviders>
}
