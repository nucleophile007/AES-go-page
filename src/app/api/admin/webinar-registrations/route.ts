// src/app/api/admin/webinar-registration/route.ts
import { PrismaClient } from '@/generated/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'admin') {
    return Response.json({ error: 'You are not authorized' }, { status: 403 })
  }

  const registrations = await prisma.webinarRegistration.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return Response.json({ registrations })
}
