import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { getSupabaseClient } from "@/lib/supabase";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  websiteType: z.string().optional(),
  budget: z.string().min(1),
  launchDate: z.string().optional(),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, websiteType, budget, launchDate, message } = parsed.data;

    // Save to leads table
    const { error: dbError } = await getSupabaseClient()
      .from("leads")
      .insert({
        name,
        email,
        website_type: websiteType || null,
        budget,
        launch_date: launchDate || null,
        message,
        status: "new",
      });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
    }

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"byBrian Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New lead: ${name} — ${websiteType || budget}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Website Type: ${websiteType || "Not specified"}`,
        `Budget: ${budget}`,
        `Launch Date: ${launchDate || "Not specified"}`,
        "",
        "Message:",
        message,
        "",
        "---",
        "View in admin: https://your-site.vercel.app/admin",
      ].join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
