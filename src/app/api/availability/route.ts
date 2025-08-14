import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  // Public endpoint to provide availability mapping for the calendar
  const days = await prisma.availabilityDay.findMany()

  const mapping: Record<string, string[]> = {}
  for (const d of days) {
    // d.times is Json value; cast to string[]
    mapping[d.date] = (d.times as unknown as string[]) || []
  }

  return Response.json({ availability: mapping })
}
