-- ============================================================
-- Add hosting_requested column to projects table
-- Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS hosting_requested boolean DEFAULT false;
