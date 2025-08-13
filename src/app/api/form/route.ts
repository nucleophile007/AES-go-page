// src/app/api/admin/webinar-registrations/route.ts
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

// POST - create a new registration
export async function POST(req: Request) {
  try {
    // Get the data from the request body
    const body = await req.json()
    const {
      email,
      parentName,
      parentEmail,
      parentContact,
      studentName,
      studentGrade,
      program,
      preferredTime,
      schoolName,
    } = body

    // 1️⃣ Save to your primary database (Prisma)
    // This part is awaited to ensure data is saved before responding.
    await prisma.webinarRegistration.create({
      data: {
        email,
        parentName,
        parentEmail,
        parentPhone: parentContact,
        studentName,
        grade: studentGrade,
        schoolName: schoolName || 'N/A',
        program,
        preferredTime,
      },
    })

    // 2️⃣ "Fire-and-forget" the request to Google Sheets
    // The 'await' keyword is removed so your server doesn't wait.
    const googleScriptUrl = "https://script.google.com/macros/s/AKfycbzZwe2n5JA1OxzcSLPuDxa9V9kZ_JkDDlLOtiZ8gDvN0izpCtgc5cqQ4rKp4tk_62zgxA/exec";
    fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Correct header
      },
      body: JSON.stringify(body), // Send the original body directly
    }).catch(error => {
      // Optional: Log any errors from the fetch call itself on the server
      console.error('Google Sheets Fetch Error:', error);
    });

    // 3️⃣ Immediately return a success message to the user
    return Response.json({ message: 'Registration successful' }, { status: 200 })

  } catch (error) {
    console.error('API Error:', error)
    return Response.json({ error: 'An error occurred processing your request' }, { status: 500 })
  }
}

// You can keep your GET function as it was
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