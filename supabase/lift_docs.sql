-- Lean 185 lifting log. One row per document (weights, runs, habits, days, food, shop, lifts_YYYY_MM).
-- Only the server (service role) reads or writes it. RLS is on with no policies, so the anon key gets nothing.
create table if not exists public.lift_docs (
  name text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.lift_docs enable row level security;
revoke all on public.lift_docs from anon, authenticated;
