-- Settings table for editable site config (email templates, etc.)
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Default quote confirmation email template
INSERT INTO settings (key, value) VALUES
  ('email_quote_subject',  'You''re in good hands, {{firstName}} — here''s what''s next'),
  ('email_quote_greeting', 'Hey {{firstName}}!'),
  ('email_quote_intro',    'I''ve received your quote request and I''m looking forward to learning more about your project.'),
  ('email_quote_closing',  'You made a great decision reaching out — I can''t wait to bring your vision to life. If anything comes to mind before then, just reply to this email. I''m always happy to chat.')
ON CONFLICT (key) DO NOTHING;
