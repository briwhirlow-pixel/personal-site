import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const { password } = await request.json();

    const { data, error } = await getSupabaseAdmin()
      .from("projects")
      .select("id, name, client_name, client_email, drive_link, delivery_password, delivery_expires_at, files_downloaded, client_credentials, delivery_type, monthly_rate")
      .eq("delivery_token", token)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Delivery page not found." }, { status: 404 });
    }

    if (data.delivery_password !== password) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const expires = data.delivery_expires_at ? new Date(data.delivery_expires_at) : null;
    const now = new Date();
    if (expires && now > expires) {
      return NextResponse.json({ error: "This delivery link has expired. Contact Brian for assistance." }, { status: 410 });
    }

    const daysLeft = expires ? Math.max(0, Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : null;

    return NextResponse.json({
      projectName: data.name,
      clientName: data.client_name,
      driveLink: data.drive_link,
      credentials: data.client_credentials,
      daysLeft,
      expiresAt: data.delivery_expires_at,
      deliveryType: data.delivery_type,
      monthlyRate: data.monthly_rate,
    });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const body = await request.json().catch(() => ({}));

    const update = body.requestHosting
      ? { hosting_requested: true }
      : { files_downloaded: true };

    await getSupabaseAdmin()
      .from("projects")
      .update(update)
      .eq("delivery_token", token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
