-- ============================================================
-- Run this in Supabase SQL Editor to add delivery columns
-- Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS delivery_type      text DEFAULT 'handoff' CHECK (delivery_type IN ('managed', 'handoff')),
  ADD COLUMN IF NOT EXISTS monthly_rate       numeric DEFAULT 49,
  ADD COLUMN IF NOT EXISTS billing_start      date,
  ADD COLUMN IF NOT EXISTS next_billing_date  date,
  ADD COLUMN IF NOT EXISTS hosting_status     text DEFAULT 'active' CHECK (hosting_status IN ('active', 'overdue', 'cancelled')),
  ADD COLUMN IF NOT EXISTS drive_link         text,
  ADD COLUMN IF NOT EXISTS delivery_token     text UNIQUE,
  ADD COLUMN IF NOT EXISTS delivery_password  text,
  ADD COLUMN IF NOT EXISTS delivery_sent_at   timestamptz,
  ADD COLUMN IF NOT EXISTS delivery_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS files_downloaded   boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS files_uploaded     boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS page_sent          boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS client_credentials text;
