import { PrismaClient } from '@/generated/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { qstash } from '@/lib/qstash'

const prisma = new PrismaClient()

function parsePreferred(preferredTime: string): { date: string | null; time: string | null } {
  if (!preferredTime) return { date: null, time: null }
  const parts = preferredTime.split(' at ')
  if (parts.length !== 2) return { date: null, time: null }
  const [date, time] = parts
  return { date, time }
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'admin') {
    return Response.json({ error: 'You are not authorized' }, { status: 403 })
  }

  const { id } = await params
  const numId = Number(id)
  if (Number.isNaN(numId)) return Response.json({ error: 'Invalid id' }, { status: 400 })

  const reg = await prisma.webinarRegistration.findUnique({ where: { id: numId } })
  if (!reg) return Response.json({ error: 'Not found' }, { status: 404 })

  if (!reg.approved) {
    await prisma.webinarRegistration.update({ where: { id: numId }, data: { approved: true } })
  }

  // Remove the booked slot from availability
  const { date, time } = parsePreferred(reg.preferredTime)
  if (date && time) {
    const day = await prisma.availabilityDay.findUnique({ where: { date } })
    if (day) {
      const currentTimes = (day.times as string[]) || []
      const nextTimes = currentTimes.filter((t) => t !== time)
      if (nextTimes.length > 0) {
        await prisma.availabilityDay.update({ where: { id: day.id }, data: { times: nextTimes } })
      } else {
        await prisma.availabilityDay.delete({ where: { id: day.id } })
      }
    }
  }

  // Publish approval email job via QStash
  try {
    await qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_BASE_URL?.trim()}/api/jobs/send-approval-email`,
      body: {
        parentEmail: reg.parentEmail,
        parentName: reg.parentName,
        studentName: reg.studentName,
        program: reg.program,
        preferredTime: reg.preferredTime,
      },
    })
  } catch (e) {
    console.error('Failed to enqueue approval email', e)
  }

  const updated = await prisma.webinarRegistration.findUnique({ where: { id: numId } })
  return Response.json({ registration: updated })
}
