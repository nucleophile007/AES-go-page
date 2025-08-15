import { PrismaClient } from '@/generated/prisma';
import { qstash } from '@/lib/qstash';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const registration = await prisma.webinarRegistration.create({
      data: {
        email: body.email,
        parentName: body.parentName,
        parentEmail: body.parentEmail,
        parentPhone: body.parentContact,
        studentName: body.studentName,
        grade: body.studentGrade,
        schoolName: body.schoolName || 'N/A',
        program: body.program,
        preferredTime: body.preferredTime,
      },
    });

    console.log("✅ Registration saved:", registration.id);

    // Publish separate jobs - Google Sheets first (no retry), then emails (can retry)
    await qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/update-sheet`,
      body,
      retries: 3, // No retries for sheets to avoid duplicates
    });

    await qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/send-emails`,
      body,
      retries: 3, // Allow retries for emails
    });

    return Response.json({ message: 'Registration successful' }, { status: 200 });
  } catch (error) {
    console.error("❌ API Error:", error);
    return Response.json({ error: 'An error occurred' }, { status: 500 });
  }
}