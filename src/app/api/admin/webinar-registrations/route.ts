// src/app/api/admin/webinar-registration/route.ts
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const registrations = await prisma.webinarRegistration.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return Response.json({ registrations })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Database error' }, { status: 500 })
  }
}
