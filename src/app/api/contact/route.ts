import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { escapeHtml } from "@/lib/htmlEscape";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  websiteType: z.string().optional(),
  budget: z.string().min(1),
  launchDate: z.string().optional(),
  message: z.string().min(1),
});

const DEFAULTS = {
  email_quote_subject:  "Got your message, {{firstName}}",
  email_quote_greeting: "Hey {{firstName}},",
  email_quote_intro:    "Thanks for reaching out. I'll look over your project tonight and reply within a day with next steps (usually sooner).",
  email_quote_closing:  "If you'd rather set up a quick call, just reply with a couple of times that work for you.",
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

    const { name, email, phone, websiteType, budget, launchDate, message } = parsed.data;

    // Save to leads table
    const { error: dbError } = await getSupabaseAdmin()
      .from("leads")
      .insert({
        name,
        email,
        phone: phone || null,
        website_type: websiteType || null,
        budget,
        launch_date: launchDate || null,
        message,
        status: "new",
      });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Could not save your request. Please email brianwhirlowbusiness@gmail.com directly." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const firstName = name.split(" ")[0];
    const vars = { firstName, name, email, websiteType: websiteType || "Not specified", budget, launchDate: launchDate || "Not specified" };

    const tpl = await getEmailSettings();
    const subject  = applyVars(tpl.email_quote_subject,  vars);
    const greeting = applyVars(tpl.email_quote_greeting, vars);
    const intro    = applyVars(tpl.email_quote_intro,    vars);
    const closing  = applyVars(tpl.email_quote_closing,  vars);

    // Notify Brian
    await transporter.sendMail({
      from: `"byBrian Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_TO_EMAIL || process.env.GMAIL_USER,
      replyTo: email,
      subject: `New lead: ${name}: ${websiteType || budget}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
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

    // Send confirmation to the lead , plain, human, signed.
    await transporter.sendMail({
      from: `"Brian Whirlow" <${process.env.GMAIL_USER}>`,
      to: email,
      replyTo: process.env.GMAIL_USER,
      subject,
      text: [
        greeting,
        "",
        intro,
        "",
        `For reference, here's what you sent: ${websiteType || "(type not specified)"}, ${budget} budget, target launch ${launchDate || "(not specified)"}.`,
        "",
        closing,
        "",
        "Brian",
        "brianwhirlowbusiness@gmail.com",
      ].join("\n"),
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; color: #1A1A2E; font-size: 15px; line-height: 1.55;">
          <p style="margin: 0 0 14px;">${escapeHtml(greeting)}</p>
          <p style="margin: 0 0 14px;">${escapeHtml(intro)}</p>
          <p style="margin: 0 0 14px; color: #4A5567; font-size: 14px;">
            For reference, here's what you sent: <strong>${escapeHtml(websiteType || "(type not specified)")}</strong>,
            <strong>${escapeHtml(budget)}</strong> budget, target launch <strong>${escapeHtml(launchDate || "(not specified)")}</strong>.
          </p>
          <p style="margin: 0 0 22px;">${escapeHtml(closing)}</p>
          <p style="margin: 0 0 4px;">Brian</p>
          <p style="margin: 0; color: #64748B; font-size: 13px;">
            <a href="mailto:brianwhirlowbusiness@gmail.com" style="color: #2563EB; text-decoration: none;">brianwhirlowbusiness@gmail.com</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
