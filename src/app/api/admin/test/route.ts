import { NextResponse } from "next/server";
import { getSupabaseClient, getSupabaseAdmin } from "@/lib/supabase";
import { isAuthorized } from "@/lib/adminAuth";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  // Test 1: anon key can read leads (will fail if RLS blocks it — expected)
  try {
    const { data, error } = await getSupabaseClient().from("leads").select("count").limit(1);
    results.anon_select = error ? `BLOCKED (${error.message})` : `OK (${JSON.stringify(data)})`;
  } catch (e) {
    results.anon_select = `EXCEPTION: ${e}`;
  }

  // Test 2: anon key can insert a test lead
  try {
    const { error } = await getSupabaseClient().from("leads").insert({
      name: "__test__", email: "test@test.com", message: "test", budget: "test", status: "new",
    });
    if (error) {
      results.anon_insert = `FAILED: ${error.message}`;
    } else {
      // Clean up test row
      await getSupabaseAdmin().from("leads").delete().eq("name", "__test__");
      results.anon_insert = "OK";
    }
  } catch (e) {
    results.anon_insert = `EXCEPTION: ${e}`;
  }

  // Test 3: service role key can read leads
  try {
    const { data, error } = await getSupabaseAdmin().from("leads").select("count").limit(1);
    results.admin_select = error ? `FAILED: ${error.message}` : `OK`;
  } catch (e) {
    results.admin_select = `EXCEPTION: ${e}`;
  }

  // Test 4: count actual leads
  try {
    const { data, error } = await getSupabaseAdmin().from("leads").select("id, name, status").order("created_at", { ascending: false }).limit(5);
    results.recent_leads = error ? `FAILED: ${error.message}` : data;
  } catch (e) {
    results.recent_leads = `EXCEPTION: ${e}`;
  }

  return NextResponse.json(results);
}
