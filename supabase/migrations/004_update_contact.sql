-- Migration: update broker contact settings
-- Run in Supabase SQL Editor

INSERT INTO settings (key, value) VALUES
  ('broker_phone', '(83) 8650-4782'),
  ('broker_whatsapp', '558386504782'),
  ('broker_email', 'corretoreduardovieira@gmail.com'),
  ('company_instagram', 'https://www.instagram.com/eduardovieiraimoveis/')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
