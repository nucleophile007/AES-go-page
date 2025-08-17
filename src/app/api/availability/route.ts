import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  // Public endpoint to provide availability mapping for the calendar
  const days = await prisma.availabilityDay.findMany()

  // Build mapping: date -> program -> times, then flatten to date -> all_times
  const programMapping: Record<string, Record<string, string[]>> = {}
  const flatMapping: Record<string, string[]> = {}
  
  for (const d of days) {
    // d.times is Json value; cast to string[]
    const times = (d.times as unknown as string[]) || []
    
    if (!programMapping[d.date]) programMapping[d.date] = {}
    programMapping[d.date][d.program] = times
    
    // For backward compatibility, also create flattened mapping with all times for a date
    if (!flatMapping[d.date]) flatMapping[d.date] = []
    flatMapping[d.date].push(...times)
  }
  
  // Remove duplicates and sort times in flattened mapping
  for (const date in flatMapping) {
    flatMapping[date] = [...new Set(flatMapping[date])].sort((a, b) => a.localeCompare(b))
  }

  return Response.json({ 
    availability: flatMapping,           // For backward compatibility
    programAvailability: programMapping  // New program-specific mapping
  })
}
