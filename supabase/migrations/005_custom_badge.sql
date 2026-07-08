-- Migration: add custom badge/tag to properties
-- Run in Supabase SQL Editor

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS custom_badge text;
