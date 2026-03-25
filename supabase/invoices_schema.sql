-- ============================================================
-- Run this in Supabase SQL Editor to create the invoices table
-- Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

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
