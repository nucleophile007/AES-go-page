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

    const items: Array<{ date: string; program: string; times: string[] | null | undefined }> = Array.isArray(body)
      ? body
      : Array.isArray(body?.items)
        ? body.items
        : body?.date && body?.program
          ? [{ date: body.date, program: body.program, times: body.times }]
          : []

    if (!items.length) {
      return Response.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const ops: any[] = []
    const deletedDates: string[] = []

    for (const it of items) {
      if (!it?.date || !it?.program) {
        return Response.json({ error: 'Invalid item in payload - date and program required' }, { status: 400 })
      }
      const timesArr = Array.isArray(it?.times) ? it!.times! : []
      if (timesArr.length === 0) {
        // delete the specific date+program combination
        ops.push(prisma.availabilityDay.deleteMany({ where: { date: it.date, program: it.program } }))
        
        // Check if this was the last program for this date
        const remainingForDate = await prisma.availabilityDay.count({
          where: { 
            date: it.date,
            program: { not: it.program }
          }
        })
        if (remainingForDate === 0 && !deletedDates.includes(it.date)) {
          deletedDates.push(it.date)
        }
      } else {
        ops.push(
          prisma.availabilityDay.upsert({
            where: { 
              date_program: { 
                date: it.date, 
                program: it.program 
              } 
            },
            update: { times: timesArr },
            create: { date: it.date, program: it.program, times: timesArr },
          })
        )
      }
    }

    const results = await prisma.$transaction(ops)

    // Upserts return records; deleteMany returns { count }. Build upserted days separately
    const days = Array.isArray(results)
      ? results.filter((r: any) => r && r.id && r.date && r.program).map((d: any) => d)
      : []

    return Response.json({ days, deletedDates })
  } catch (e) {
    console.error('Availability POST error', e)
    return Response.json({ error: 'Failed to save availability' }, { status: 500 })
  }
}
