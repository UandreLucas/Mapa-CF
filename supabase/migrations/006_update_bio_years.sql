-- Migration: update broker experience from 10 to 15 years
-- Run in Supabase SQL Editor

UPDATE settings
SET value = 'Especialista em imóveis de alto padrão em João Pessoa há mais de 15 anos. Atendimento personalizado, curadoria exclusiva e acompanhamento completo em todas as etapas.',
    updated_at = now()
WHERE key = 'company_bio'
  AND value LIKE '%10 anos%';
