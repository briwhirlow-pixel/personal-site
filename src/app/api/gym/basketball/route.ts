import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { verifyGymAuth } from "@/lib/gym-auth";

export async function GET(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("basketball_sessions")
    .select("*")
    .eq("profile_id", profile.profileId)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Basketball sessions fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }

  const sessions = (data ?? []).map((row) => ({
    id: row.id,
    date: row.date,
    sessionType: row.session_type,
    templateId: row.template_id,
    drills: row.drills ?? [],
    durationSecs: row.duration_secs,
    notes: row.notes,
    completed: row.completed,
  }));

  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, sessionType, templateId, drills, durationSecs, notes, completed, date } = body;

  const supabase = getSupabase();

  if (id) {
    // Update existing session
    const { data, error } = await supabase
      .from("basketball_sessions")
      .update({
        drills,
        duration_secs: durationSecs ?? null,
        notes: notes ?? null,
        completed: completed ?? false,
      })
      .eq("id", id)
      .eq("profile_id", profile.profileId)
      .select()
      .single();

    if (error) {
      console.error("Basketball session update error:", error);
      return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  }

  // Create new session
  const { data, error } = await supabase
    .from("basketball_sessions")
    .insert({
      profile_id: profile.profileId,
      date: date ?? new Date().toISOString().split("T")[0],
      session_type: sessionType ?? "custom",
      template_id: templateId ?? null,
      drills: drills ?? [],
      duration_secs: durationSecs ?? null,
      notes: notes ?? null,
      completed: completed ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error("Basketball session create error:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}

export async function DELETE(request: Request) {
  const profile = await verifyGymAuth(request);
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = getSupabase();
  const { error } = await supabase
    .from("basketball_sessions")
    .delete()
    .eq("id", id)
    .eq("profile_id", profile.profileId);

  if (error) {
    console.error("Basketball session delete error:", error);
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
