-- Allow "archived" as a lead status
-- Run in Supabase Dashboard → SQL Editor

ALTER TABLE leads
  DROP CONSTRAINT IF EXISTS leads_status_check;

ALTER TABLE leads
  ADD CONSTRAINT leads_status_check CHECK (
    status IN ('new', 'contacted', 'call_scheduled', 'proposal_sent', 'won', 'lost', 'archived')
  );
