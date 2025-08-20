import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  // Public endpoint to provide availability mapping for College Prep program only
  const days = await prisma.availabilityDay.findMany({
    where: {
      program: "College Prep"
    }
  })

  // Build simple mapping: date -> times for College Prep only
  const availability: Record<string, string[]> = {}
  
  for (const d of days) {
    // d.times is Json value; cast to string[]
    const times = (d.times as unknown as string[]) || []
    availability[d.date] = times.sort((a, b) => a.localeCompare(b))
  }

  return Response.json({ 
    availability  // Only College Prep availability
  })
}
