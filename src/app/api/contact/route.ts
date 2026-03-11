import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { getSupabaseClient } from "@/lib/supabase";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  budget: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, budget, message } = parsed.data;

    // Save to Supabase
    const { error: dbError } = await getSupabaseClient()
      .from("contact_submissions")
      .insert({ name, email, budget, message });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      // Don't fail the request — still attempt to send email
    }

    // Send email via Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Budget: ${budget}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
