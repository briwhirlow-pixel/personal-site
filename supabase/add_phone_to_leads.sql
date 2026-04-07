-- Add phone column to leads table
-- Run in Supabase Dashboard → SQL Editor

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS phone text;
