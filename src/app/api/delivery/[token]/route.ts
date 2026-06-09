import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyPassword } from "@/lib/passwords";

function sessionSecret(): string {
  return process.env.INVOICE_LINK_SECRET || process.env.ADMIN_PASSWORD || "delivery-fallback-secret";
}

function deriveAccessToken(deliveryToken: string, projectId: string): string {
  return createHmac("sha256", sessionSecret())
    .update(`delivery:${deliveryToken}:${projectId}`)
    .digest("hex");
}

function verifyAccessToken(deliveryToken: string, projectId: string, provided: string | null | undefined): boolean {
  if (!provided) return false;
  const expected = deriveAccessToken(deliveryToken, projectId);
  if (provided.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(provided, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const { password } = await request.json();
    if (typeof password !== "string" || !password) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, client_name, client_email, drive_link, delivery_password, delivery_expires_at, files_downloaded, client_credentials, delivery_type, monthly_rate")
      .eq("delivery_token", token)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Delivery page not found." }, { status: 404 });
    }

    if (!verifyPassword(password, data.delivery_password)) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const expires = data.delivery_expires_at ? new Date(data.delivery_expires_at) : null;
    const now = new Date();
    if (expires && now > expires) {
      return NextResponse.json({ error: "This delivery link has expired. Contact Brian for assistance." }, { status: 410 });
    }

    const daysLeft = expires ? Math.max(0, Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : null;
    const accessToken = deriveAccessToken(token, data.id);

    return NextResponse.json({
      projectName: data.name,
      clientName: data.client_name,
      driveLink: data.drive_link,
      credentials: data.client_credentials,
      daysLeft,
      expiresAt: data.delivery_expires_at,
      deliveryType: data.delivery_type,
      monthlyRate: data.monthly_rate,
      accessToken,
    });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const auth = request.headers.get("authorization");
    const provided = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

    const supabase = getSupabaseAdmin();
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("id")
      .eq("delivery_token", token)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: "Delivery page not found." }, { status: 404 });
    }

    if (!verifyAccessToken(token, project.id, provided)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const update = body.requestHosting
      ? { hosting_requested: true }
      : { files_downloaded: true };

    await supabase
      .from("projects")
      .update(update)
      .eq("id", project.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
