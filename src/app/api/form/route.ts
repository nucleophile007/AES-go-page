// src/app/api/admin/webinar-registrations/route.ts
import { PrismaClient } from '@/generated/prisma'
import nodemailer from 'nodemailer';

const prisma = new PrismaClient()

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

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
    const registration = await prisma.webinarRegistration.create({
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

    // 2️⃣ Send success response immediately after DB save
    const responsePromise = Response.json({ message: 'Registration successful' }, { status: 200 });

    // 3️⃣ Handle async operations (Google Sheets and Emails) after sending response
    Promise.all([
      // Google Sheets request
      fetch(process.env.GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbzZwe2n5JA1OxzcSLPuDxa9V9kZ_JkDDlLOtiZ8gDvN0izpCtgc5cqQ4rKp4tk_62zgxA/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).catch(error => {
        console.error('Google Sheets Fetch Error:', error);
      }),

      // Send admin notification email
      transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `New Webinar Registration - ${studentName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a2b4d;">New Webinar Registration</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
              <h3>Student Information</h3>
              <p><strong>Name:</strong> ${studentName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Grade:</strong> ${studentGrade}</p>
              <p><strong>School:</strong> ${schoolName || 'N/A'}</p>
              
              <h3>Parent Information</h3>
              <p><strong>Name:</strong> ${parentName}</p>
              <p><strong>Email:</strong> ${parentEmail}</p>
              <p><strong>Contact:</strong> ${parentContact}</p>
              
              <h3>Program Details</h3>
              <p><strong>Program:</strong> ${program}</p>
              <p><strong>Preferred Time:</strong> ${preferredTime}</p>
            </div>
          </div>
        `,
        replyTo: parentEmail,
      }).catch(error => {
        console.error('Admin Email Error:', error);
      }),

      // Send confirmation email to parent
      transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: parentEmail,
        subject: 'U-ACHIEVE Registration Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a2b4d;">Registration Confirmation</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
              <p>Dear ${parentName},</p>
              <p>Thank you for registering for our ${program} program. We have received your registration for:</p>
              <p><strong>Student:</strong> ${studentName}</p>
              <p><strong>Scheduled Time:</strong> ${preferredTime}</p>
              <p>Our team will review your registration and contact you shortly to confirm the session.</p>
              <p>If you have any questions in the meantime, please don't hesitate to reach out to us.</p>
              <p style="margin-top: 20px;">Best regards,<br>The U-ACHIEVE Team</p>
            </div>
          </div>
        `,
      }).catch(error => {
        console.error('Parent Email Error:', error);
      }),
    ]).catch(error => {
      console.error('Async operations error:', error);
    });

    return responsePromise

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