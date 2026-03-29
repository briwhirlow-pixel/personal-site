import { NextResponse } from "next/server";
import { Resend } from "resend";
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

const DEFAULTS = {
  email_quote_subject:  "You're in good hands, {{firstName}} — here's what's next",
  email_quote_greeting: "Hey {{firstName}}!",
  email_quote_intro:    "I've received your quote request and I'm looking forward to learning more about your project.",
  email_quote_closing:  "You made a great decision reaching out — I can't wait to bring your vision to life. If anything comes to mind before then, just reply to this email. I'm always happy to chat.",
};

async function getEmailSettings(): Promise<typeof DEFAULTS> {
  try {
    const { data } = await getSupabaseAdmin().from("settings").select("key, value");
    if (!data) return DEFAULTS;
    const map: Record<string, string> = {};
    for (const row of data) map[row.key] = row.value;
    return {
      email_quote_subject:  map.email_quote_subject  ?? DEFAULTS.email_quote_subject,
      email_quote_greeting: map.email_quote_greeting ?? DEFAULTS.email_quote_greeting,
      email_quote_intro:    map.email_quote_intro    ?? DEFAULTS.email_quote_intro,
      email_quote_closing:  map.email_quote_closing  ?? DEFAULTS.email_quote_closing,
    };
  } catch {
    return DEFAULTS;
  }
}

function applyVars(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

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

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromDomain = process.env.RESEND_FROM_DOMAIN || "builtbybwhirl.com";
    const firstName = name.split(" ")[0];
    const vars = { firstName, name, email, websiteType: websiteType || "Not specified", budget, launchDate: launchDate || "Not specified" };

    // Fetch editable template from Supabase
    const tpl = await getEmailSettings();
    const subject  = applyVars(tpl.email_quote_subject,  vars);
    const greeting = applyVars(tpl.email_quote_greeting, vars);
    const intro    = applyVars(tpl.email_quote_intro,    vars);
    const closing  = applyVars(tpl.email_quote_closing,  vars);

    // Notify Brian
    await resend.emails.send({
      from: `byBrian Contact Form <noreply@${fromDomain}>`,
      to: process.env.CONTACT_TO_EMAIL!,
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
        `View in admin: ${process.env.NEXT_PUBLIC_SITE_URL}/admin`,
      ].join("\n"),
    });

    // Send personalized confirmation to the lead
    await resend.emails.send({
      from: `Brian <brian@${fromDomain}>`,
      to: email,
      replyTo: `brian@${fromDomain}`,
      subject,
      text: [
        greeting,
        "",
        intro,
        "",
        "Here's a quick recap of what you submitted:",
        `  • Website type: ${websiteType || "Not specified"}`,
        `  • Budget: ${budget}`,
        `  • Target launch: ${launchDate || "Not specified"}`,
        "",
        "Here's what happens from here:",
        "  1. I'll personally review your request and reach out within 1–2 business days.",
        "  2. We'll have a quick discovery call to get aligned on your vision and goals.",
        "  3. I'll craft a tailored proposal and we'll hit the ground running.",
        "",
        closing,
        "",
        "Talk soon,",
        "Brian",
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1A1A1A;">
          <div style="background: #2563EB; padding: 28px 32px; border-radius: 12px 12px 0 0;">
            <p style="margin: 0; color: white; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">byBrian <span style="color: rgba(255,255,255,0.6); font-weight: 400; font-size: 13px;">WEB DESIGN</span></p>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #E5E4DF; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; margin: 0 0 16px;">${greeting}</p>
            <p style="font-size: 15px; color: #444; line-height: 1.6; margin: 0 0 24px;">${intro}</p>

            <div style="background: #F8F8F6; border-radius: 10px; padding: 20px 24px; margin-bottom: 28px;">
              <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #AEACA6;">Your Quote Summary</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; font-size: 13px; color: #737373; width: 40%;">Website type</td><td style="padding: 6px 0; font-size: 13px; font-weight: 600;">${websiteType || "Not specified"}</td></tr>
                <tr><td style="padding: 6px 0; font-size: 13px; color: #737373;">Budget</td><td style="padding: 6px 0; font-size: 13px; font-weight: 600;">${budget}</td></tr>
                <tr><td style="padding: 6px 0; font-size: 13px; color: #737373;">Target launch</td><td style="padding: 6px 0; font-size: 13px; font-weight: 600;">${launchDate || "Not specified"}</td></tr>
              </table>
            </div>

            <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #AEACA6;">Here's What Happens Next</p>
            <div style="margin-bottom: 28px;">
              ${[
                ["📬", "I'll <strong>personally review</strong> your request and reach out within 1–2 business days."],
                ["📞", "We'll hop on a quick <strong>discovery call</strong> to get aligned on your vision and goals."],
                ["⚡", "I'll craft a tailored <strong>proposal</strong> and we'll hit the ground running."],
              ].map(([icon, text]) => `
                <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; background: #fff; border: 1px solid #E5E4DF; border-radius: 8px; margin-bottom: 8px;">
                  <span style="font-size: 18px; line-height: 1.4;">${icon}</span>
                  <p style="margin: 0; font-size: 14px; color: #444; line-height: 1.5;">${text}</p>
                </div>
              `).join("")}
            </div>

            <p style="font-size: 15px; color: #444; line-height: 1.6; margin: 0 0 24px;">${closing}</p>

            <p style="font-size: 15px; margin: 0;">Talk soon,<br/>
            <strong>Brian</strong></p>
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
