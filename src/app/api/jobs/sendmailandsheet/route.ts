import nodemailer from 'nodemailer';
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

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

    console.log("📨 Processing job for:", studentName);

    // Google Sheets
    try {
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

      if (!sheetRes.ok) throw new Error(`Google Sheets returned ${sheetRes.status}`);
      console.log("✅ Google Sheets updated");
    } catch (err) {
      console.error("❌ Google Sheets Error:", err);
    }

    // Admin Email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Webinar Registration - ${studentName}`,
      html: `
        <h2>New Webinar Registration</h2>
        <p><strong>Name:</strong> ${studentName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Grade:</strong> ${studentGrade}</p>
        <p><strong>School:</strong> ${schoolName || 'N/A'}</p>
        <p><strong>Parent:</strong> ${parentName} (${parentContact})</p>
        <p><strong>Program:</strong> ${program}</p>
        <p><strong>Preferred Time:</strong> ${preferredTime}</p>
      `,
      replyTo: parentEmail,
    });

    // Parent Email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: parentEmail,
      subject: 'U-ACHIEVE Registration Confirmation',
      html: `
        <h2>Registration Confirmation</h2>
        <p>Dear ${parentName},</p>
        <p>Thank you for registering for our ${program} program. We will contact you soon.</p>
      `,
    });

    console.log("✅ Emails sent successfully");
    return Response.json({ success: true });
  } catch (error) {
    console.error("❌ Email/Sheet job failed:", error);
    return Response.json({ error: 'Failed to send job' }, { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(handler);
