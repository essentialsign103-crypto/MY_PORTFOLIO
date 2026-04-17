import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { clientName, clientPhone, clientEmail, services, projectBrief } = await request.json();

    if (!clientName || !clientPhone || !clientEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create transporter using Gmail or your email service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL || "hamzatehafeko8@gmail.com";

    const emailContent = `
      <h2>New Client Inquiry</h2>
      <p><strong>Client Name:</strong> ${clientName}</p>
      <p><strong>Phone:</strong> ${clientPhone}</p>
      <p><strong>Email:</strong> ${clientEmail}</p>
      <p><strong>Services Requested:</strong> ${services.join(", ")}</p>
      <p><strong>Project Brief:</strong></p>
      <p>${projectBrief.replace(/\n/g, "<br>")}</p>
      <hr>
      <p>This inquiry has been saved to your admin dashboard. You can reply to the client from there.</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New Client Inquiry from ${clientName}`,
      html: emailContent,
    });

    return NextResponse.json({ success: true, message: "Inquiry email sent to admin" });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
