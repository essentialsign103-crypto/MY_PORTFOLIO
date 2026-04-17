import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { to, clientName, message, ownerEmail, ownerPhone } = await request.json();

    if (!to || !clientName || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create transporter using Gmail or your email service
    // For production, use environment variables for credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailContent = `
      <h2>Hello ${clientName},</h2>
      <p>Thank you for reaching out! Here's a message from Hamza Teha:</p>
      <div style="background: #f5f1e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p>${message.replace(/\n/g, "<br>")}</p>
      </div>
      <p><strong>Contact Information:</strong></p>
      <p>Email: ${ownerEmail}</p>
      <p>Phone: ${ownerPhone}</p>
      <p>Best regards,<br>Hamza Teha<br>TEHA TECH</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: `Reply from Hamza Teha - TEHA TECH`,
      html: emailContent,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
