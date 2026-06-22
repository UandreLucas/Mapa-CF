-- Migration: add rich content columns to neighborhoods
-- Run in Supabase SQL Editor

ALTER TABLE neighborhoods
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS highlights jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS points_of_interest jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS city_name text DEFAULT 'João Pessoa';

-- Backfill demo data for existing neighborhoods
UPDATE neighborhoods SET
  city_name = 'João Pessoa',
  tags = ARRAY['Alto Padrão', 'Tranquilo', 'Vista privilegiada', 'Ótima infraestrutura'],
  highlights = '[
    {"icon":"TrendingUp","label":"Valorização","value":"Alta"},
    {"icon":"Trees","label":"Áreas verdes","value":"Amplas"},
    {"icon":"ShoppingBag","label":"Comércio","value":"Completo"},
    {"icon":"GraduationCap","label":"Escolas","value":"Referência"}
  ]'::jsonb,
  points_of_interest = '[
    {"name":"Shopping Pátio Altiplano","category":"Shopping","image":"https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&q=80"},
    {"name":"Parque Solon de Lucena","category":"Lazer","image":"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80"},
    {"name":"Colégio de Referência","category":"Educação","image":"https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80"}
  ]'::jsonb
WHERE slug = 'altiplano';

UPDATE neighborhoods SET
  city_name = 'João Pessoa',
  tags = ARRAY['Beira-mar', 'Alto Padrão', 'Vista para o mar', 'Sofisticado'],
  highlights = '[
    {"icon":"Waves","label":"Praia","value":"A 5 minutos"},
    {"icon":"TrendingUp","label":"Valorização","value":"Muito alta"},
    {"icon":"Star","label":"Padrão","value":"Luxo"},
    {"icon":"ShoppingBag","label":"Comércio","value":"Próximo"}
  ]'::jsonb,
  points_of_interest = '[
    {"name":"Orla de Cabo Branco","category":"Praia","image":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"},
    {"name":"Ponto Mais Oriental","category":"Turismo","image":"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80"},
    {"name":"Restaurantes à Beira-mar","category":"Gastronomia","image":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"}
  ]'::jsonb
WHERE slug = 'cabo-branco';

UPDATE neighborhoods SET
  city_name = 'João Pessoa',
  tags = ARRAY['Nobre', 'Central', 'Lazer completo', 'Próximo à praia'],
  highlights = '[
    {"icon":"ShoppingBag","label":"Shopping","value":"Manaíra"},
    {"icon":"Waves","label":"Praia","value":"Próxima"},
    {"icon":"TrendingUp","label":"Valorização","value":"Alta"},
    {"icon":"GraduationCap","label":"Escolas","value":"Várias"}
  ]'::jsonb,
  points_of_interest = '[
    {"name":"Manaíra Shopping","category":"Shopping","image":"https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&q=80"},
    {"name":"Orla de Manaíra","category":"Lazer","image":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"},
    {"name":"Espaços Gastronômicos","category":"Gastronomia","image":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"}
  ]'::jsonb
WHERE slug = 'manaira';

UPDATE neighborhoods SET
  city_name = 'João Pessoa',
  tags = ARRAY['Tradicional', 'Turístico', 'Beira-mar', 'Infraestrutura completa'],
  highlights = '[
    {"icon":"Waves","label":"Praia","value":"Na porta"},
    {"icon":"Star","label":"Turismo","value":"Destaque"},
    {"icon":"ShoppingBag","label":"Comércio","value":"Completo"},
    {"icon":"TrendingUp","label":"Investimento","value":"Excelente"}
  ]'::jsonb,
  points_of_interest = '[
    {"name":"Praia de Tambaú","category":"Praia","image":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"},
    {"name":"Mercado de Artesanato","category":"Cultura","image":"https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80"},
    {"name":"Restaurantes à Beira-mar","category":"Gastronomia","image":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"}
  ]'::jsonb
WHERE slug = 'tambau';

UPDATE neighborhoods SET
  city_name = 'João Pessoa',
  tags = ARRAY['Residencial', 'Tranquilo', 'Beira-mar', 'Familiar'],
  highlights = '[
    {"icon":"Waves","label":"Praia","value":"Frente ao mar"},
    {"icon":"Trees","label":"Ambiente","value":"Tranquilo"},
    {"icon":"TrendingUp","label":"Valorização","value":"Crescente"},
    {"icon":"Home","label":"Perfil","value":"Familiar"}
  ]'::jsonb,
  points_of_interest = '[
    {"name":"Praia do Bessa","category":"Praia","image":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"},
    {"name":"Calçadão da Orla","category":"Lazer","image":"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80"},
    {"name":"Comércio Local","category":"Serviços","image":"https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&q=80"}
  ]'::jsonb
WHERE slug = 'bessa';

UPDATE neighborhoods SET
  city_name = 'João Pessoa',
  tags = ARRAY['Residencial', 'Bem localizado', 'Familiar', 'Acessível'],
  highlights = '[
    {"icon":"MapPin","label":"Localização","value":"Central"},
    {"icon":"Trees","label":"Ambiente","value":"Tranquilo"},
    {"icon":"GraduationCap","label":"Escolas","value":"Próximas"},
    {"icon":"Home","label":"Perfil","value":"Familiar"}
  ]'::jsonb,
  points_of_interest = '[
    {"name":"Vias de acesso","category":"Mobilidade","image":"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80"},
    {"name":"Parques e praças","category":"Lazer","image":"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80"},
    {"name":"Comércio local","category":"Serviços","image":"https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&q=80"}
  ]'::jsonb
WHERE slug = 'jardim-oceania';

UPDATE neighborhoods SET
  city_name = 'João Pessoa',
  tags = ARRAY['Moderno', 'Bem localizado', 'Em crescimento', 'Boa infraestrutura'],
  highlights = '[
    {"icon":"TrendingUp","label":"Crescimento","value":"Acelerado"},
    {"icon":"Star","label":"Lançamentos","value":"Frequentes"},
    {"icon":"ShoppingBag","label":"Comércio","value":"Variado"},
    {"icon":"MapPin","label":"Acesso","value":"Fácil"}
  ]'::jsonb,
  points_of_interest = '[
    {"name":"Novos empreendimentos","category":"Imóveis","image":"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80"},
    {"name":"Gastronomia local","category":"Alimentação","image":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"},
    {"name":"Fácil acesso viário","category":"Mobilidade","image":"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80"}
  ]'::jsonb
WHERE slug = 'aeroclube';

UPDATE neighborhoods SET
  city_name = 'Cabedelo',
  tags = ARRAY['Praias preservadas', 'Alto Padrão', 'Cabedelo', 'Natureza'],
  highlights = '[
    {"icon":"Waves","label":"Praias","value":"Preservadas"},
    {"icon":"Trees","label":"Natureza","value":"Exuberante"},
    {"icon":"TrendingUp","label":"Valorização","value":"Em alta"},
    {"icon":"Star","label":"Padrão","value":"Alto"}
  ]'::jsonb,
  points_of_interest = '[
    {"name":"Praia de Intermares","category":"Praia","image":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"},
    {"name":"Reserva ambiental","category":"Natureza","image":"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80"},
    {"name":"Condomínios de luxo","category":"Imóveis","image":"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80"}
  ]'::jsonb
WHERE slug = 'intermares';
