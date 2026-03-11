import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  budget: z.string().min(1),
  message: z.string().min(1),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, budget, message } = parsed.data;

    // Save to Supabase
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({ name, email, budget, message });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      // Don't fail the request — still attempt to send email
    }

    // Send email notification via Resend
    const { error: emailError } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL!,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Budget: ${budget}`,
        "",
        `Message:`,
        message,
      ].join("\n"),
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
