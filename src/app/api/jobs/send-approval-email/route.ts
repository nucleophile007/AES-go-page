import nodemailer from 'nodemailer'
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

async function handler(req: Request) {
  try {
    const { parentEmail, parentName, studentName, program, preferredTime } = await req.json()

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: parentEmail,
      subject: 'Your booking has been approved',
      html: `
        <h2>Booking Approved</h2>
        <p>Dear ${parentName},</p>
        <p>Your booking for ${studentName} (${program}) at <strong>${preferredTime}</strong> has been approved.</p>
        <p>We look forward to speaking with you.</p>
      `,
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Approval email job failed', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

export const POST = verifySignatureAppRouter(handler)
