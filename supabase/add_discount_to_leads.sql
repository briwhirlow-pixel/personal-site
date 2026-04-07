-- Add discount fields to leads table
-- Run in Supabase Dashboard → SQL Editor

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS discount_type  text CHECK (discount_type IN ('percent', 'fixed')),
  ADD COLUMN IF NOT EXISTS discount_value decimal(10,2),
  ADD COLUMN IF NOT EXISTS discount_note  text DEFAULT '';
