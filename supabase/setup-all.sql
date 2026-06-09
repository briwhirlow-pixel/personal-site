-- ============================================================
-- BuiltbyBrian — Full DB setup in one query
-- Run once in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Idempotent: safe to re-run if some tables already exist.
-- ============================================================

-- ─── 1. CORE TABLES ──────────────────────────────────────────

DROP TABLE IF EXISTS contact_submissions;

CREATE TABLE IF NOT EXISTS leads (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  email         text NOT NULL,
  website_type  text,
  budget        text,
  launch_date   text,
  message       text,
  status        text DEFAULT 'new',
  notes         text DEFAULT '',
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS invoices (
  id                   uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number       text UNIQUE NOT NULL,
  client_name          text NOT NULL,
  client_email         text NOT NULL,
  project_name         text NOT NULL,
  line_items           jsonb NOT NULL DEFAULT '[]',
  notes                text DEFAULT '',
  payment_instructions text DEFAULT '',
  due_date             date,
  status               text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid')),
  created_at           timestamptz DEFAULT now(),
  paid_at              timestamptz
);

CREATE TABLE IF NOT EXISTS settings (
  key        text PRIMARY KEY,
  value      text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- ─── 2. ALTER COLUMNS (idempotent) ───────────────────────────

-- Leads: phone, discount, archived status
ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone          text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS discount_type  text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS discount_value decimal(10,2);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS discount_note  text DEFAULT '';

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE leads ADD  CONSTRAINT leads_status_check CHECK (
  status IN ('new', 'contacted', 'call_scheduled', 'proposal_sent', 'won', 'lost', 'archived')
);

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_discount_type_check;
ALTER TABLE leads ADD  CONSTRAINT leads_discount_type_check CHECK (
  discount_type IS NULL OR discount_type IN ('percent', 'fixed')
);

-- Projects: delivery + hosting columns
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS delivery_type       text DEFAULT 'handoff',
  ADD COLUMN IF NOT EXISTS monthly_rate        numeric DEFAULT 49,
  ADD COLUMN IF NOT EXISTS billing_start       date,
  ADD COLUMN IF NOT EXISTS next_billing_date   date,
  ADD COLUMN IF NOT EXISTS hosting_status      text DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS drive_link          text,
  ADD COLUMN IF NOT EXISTS delivery_token      text UNIQUE,
  ADD COLUMN IF NOT EXISTS delivery_password   text,
  ADD COLUMN IF NOT EXISTS delivery_sent_at    timestamptz,
  ADD COLUMN IF NOT EXISTS delivery_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS files_downloaded    boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS files_uploaded      boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS page_sent           boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS client_credentials  text,
  ADD COLUMN IF NOT EXISTS hosting_requested   boolean DEFAULT false;

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_delivery_type_check;
ALTER TABLE projects ADD  CONSTRAINT projects_delivery_type_check CHECK (
  delivery_type IN ('managed', 'handoff')
);

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_hosting_status_check;
ALTER TABLE projects ADD  CONSTRAINT projects_hosting_status_check CHECK (
  hosting_status IN ('active', 'overdue', 'cancelled')
);

-- Invoices: link to project
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES projects(id) ON DELETE SET NULL;

-- ─── 3. AUTO-UPDATE updated_at TRIGGER ───────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── 4. DEFAULT SETTINGS (email templates) ───────────────────

INSERT INTO settings (key, value) VALUES
  ('email_quote_subject',  'You''re in good hands, {{firstName}} — here''s what''s next'),
  ('email_quote_greeting', 'Hey {{firstName}}!'),
  ('email_quote_intro',    'I''ve received your quote request and I''m looking forward to learning more about your project.'),
  ('email_quote_closing',  'You made a great decision reaching out — I can''t wait to bring your vision to life. If anything comes to mind before then, just reply to this email. I''m always happy to chat.')
ON CONFLICT (key) DO NOTHING;

-- ─── 5. ROW LEVEL SECURITY ───────────────────────────────────

ALTER TABLE leads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert leads" ON leads;
CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT TO anon
  WITH CHECK (true);

-- Admin API routes use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS.
-- The anon key only gets INSERT on leads (for the public contact form).
-- Everything else stays locked down.

-- ─── DONE ────────────────────────────────────────────────────
-- Refresh your admin page — the yellow banner should disappear.
