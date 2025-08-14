import { PrismaClient } from '@/generated/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return Response.json({ error: 'Not authorized' }, { status: 403 })
  }

  const days = await prisma.availabilityDay.findMany({ orderBy: { date: 'asc' } })
  return Response.json({ days })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return Response.json({ error: 'Not authorized' }, { status: 403 })
  }

  try {
    const body = await req.json()

    const items: Array<{ date: string; times: string[] | null | undefined }> = Array.isArray(body)
      ? body
      : Array.isArray(body?.items)
        ? body.items
        : body?.date
          ? [{ date: body.date, times: body.times }]
          : []

    if (!items.length) {
      return Response.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const ops: any[] = []
    const deletedDates: string[] = []

    for (const it of items) {
      if (!it?.date) {
        return Response.json({ error: 'Invalid item in payload' }, { status: 400 })
      }
      const timesArr = Array.isArray(it?.times) ? it!.times! : []
      if (timesArr.length === 0) {
        // delete the date if exists
        ops.push(prisma.availabilityDay.deleteMany({ where: { date: it.date } }))
        deletedDates.push(it.date)
      } else {
        ops.push(
          prisma.availabilityDay.upsert({
            where: { date: it.date },
            update: { times: timesArr },
            create: { date: it.date, times: timesArr },
          })
        )
      }
    }

    const results = await prisma.$transaction(ops)

    // Upserts return records; deleteMany returns { count }. Build upserted days separately
    const days = Array.isArray(results)
      ? results.filter((r: any) => r && r.id && r.date).map((d: any) => d)
      : []

    return Response.json({ days, deletedDates })
  } catch (e) {
    console.error('Availability POST error', e)
    return Response.json({ error: 'Failed to save availability' }, { status: 500 })
  }
}
