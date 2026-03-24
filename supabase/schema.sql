-- ============================================================
-- Run this in your Supabase SQL Editor to set up the CRM tables
-- Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

-- Drop old table if it existed
DROP TABLE IF EXISTS contact_submissions;

-- LEADS table — every contact form submission becomes a lead
CREATE TABLE IF NOT EXISTS leads (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  email         text NOT NULL,
  website_type  text,
  budget        text,
  launch_date   text,
  message       text,
  status        text DEFAULT 'new' CHECK (
    status IN ('new', 'contacted', 'call_scheduled', 'proposal_sent', 'won', 'lost')
  ),
  notes         text DEFAULT '',
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- PROJECTS table — created when a lead converts (status = won)
CREATE TABLE IF NOT EXISTS projects (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id       uuid REFERENCES leads(id) ON DELETE SET NULL,
  name          text NOT NULL,
  client_name   text,
  client_email  text,
  agreed_budget text,
  start_date    date,
  deadline      date,
  status        text DEFAULT 'discovery' CHECK (
    status IN ('discovery', 'building', 'review', 'launched')
  ),
  site_url      text,
  notes         text DEFAULT '',
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Disable RLS for server-side access (your API uses the service role key)
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
