import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";

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
    const { error: dbError } = await getSupabaseAdmin()
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

    const firstName = name.split(" ")[0];

    // Notify Brian
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

    // Send personalized confirmation to the lead
    await transporter.sendMail({
      from: `"Brian @ byBrian Web Design" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Got your quote request, ${firstName} — here's what's next`,
      text: [
        `Hey ${firstName},`,
        "",
        `Thanks for reaching out! I've received your quote request and I'm excited to learn more about your project.`,
        "",
        "Here's a quick summary of what you submitted:",
        `  • Website type: ${websiteType || "Not specified"}`,
        `  • Budget: ${budget}`,
        `  • Target launch: ${launchDate || "Not specified"}`,
        "",
        "What happens next:",
        "  1. I'll review your request and reach out within 1–2 business days.",
        "  2. We'll hop on a quick discovery call to align on goals and direction.",
        "  3. I'll put together a tailored proposal and we get to work.",
        "",
        "In the meantime, feel free to reply to this email if you have any questions.",
        "",
        "Talk soon,",
        "Brian",
        "byBrian Web Design",
        "builtbybwhirl.com",
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1A1A1A;">
          <div style="background: #2563EB; padding: 28px 32px; border-radius: 12px 12px 0 0;">
            <p style="margin: 0; color: white; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">byBrian <span style="color: rgba(255,255,255,0.6); font-weight: 400; font-size: 13px;">WEB DESIGN</span></p>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #E5E4DF; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; margin: 0 0 16px;">Hey ${firstName},</p>
            <p style="font-size: 15px; color: #444; line-height: 1.6; margin: 0 0 24px;">
              Thanks for reaching out! I've received your quote request and I'm excited to learn more about your project.
            </p>

            <div style="background: #F8F8F6; border-radius: 10px; padding: 20px 24px; margin-bottom: 28px;">
              <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #AEACA6;">Your Quote Summary</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; font-size: 13px; color: #737373; width: 40%;">Website type</td><td style="padding: 6px 0; font-size: 13px; font-weight: 600;">${websiteType || "Not specified"}</td></tr>
                <tr><td style="padding: 6px 0; font-size: 13px; color: #737373;">Budget</td><td style="padding: 6px 0; font-size: 13px; font-weight: 600;">${budget}</td></tr>
                <tr><td style="padding: 6px 0; font-size: 13px; color: #737373;">Target launch</td><td style="padding: 6px 0; font-size: 13px; font-weight: 600;">${launchDate || "Not specified"}</td></tr>
              </table>
            </div>

            <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #AEACA6;">What Happens Next</p>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px;">
              ${[
                ["📬", "I'll review your request and reach out within <strong>1–2 business days</strong>."],
                ["📞", "We'll hop on a quick <strong>discovery call</strong> to align on goals and direction."],
                ["⚡", "I'll put together a tailored <strong>proposal</strong> and we get to work."],
              ].map(([icon, text]) => `
                <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; background: #fff; border: 1px solid #E5E4DF; border-radius: 8px;">
                  <span style="font-size: 18px; line-height: 1;">${icon}</span>
                  <p style="margin: 0; font-size: 14px; color: #444; line-height: 1.5;">${text}</p>
                </div>
              `).join("")}
            </div>

            <p style="font-size: 14px; color: #737373; margin: 0 0 24px;">
              In the meantime, feel free to reply to this email if you have any questions.
            </p>

            <p style="font-size: 15px; margin: 0;">Talk soon,<br/>
            <strong>Brian</strong><br/>
            <span style="color: #737373; font-size: 13px;">byBrian Web Design &mdash; builtbybwhirl.com</span></p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
