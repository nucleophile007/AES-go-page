import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

async function handler(req: Request) {
  try {
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
    } = await req.json();

    console.log("📊 Processing Google Sheets job for:", studentName);

    // Google Sheets only
    const sheetRes = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        parentName,
        parentEmail,
        parentContact,
        studentName,
        studentGrade,
        program,
        preferredTime,
        schoolName
      }),
    });

    if (!sheetRes.ok) {
      throw new Error(`Google Sheets returned ${sheetRes.status}`);
    }

    console.log("✅ Google Sheets updated successfully");
    return Response.json({ success: true });
  } catch (error) {
    console.error("❌ Google Sheets job failed:", error);
    return Response.json({ error: 'Failed to update sheet' }, { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(handler);
