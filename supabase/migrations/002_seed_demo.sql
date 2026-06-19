-- ============================================================
-- Demo properties seed (10 imóveis)
-- Run after 001_initial.sql. Safe to re-run (codes are unique).
-- ============================================================

insert into properties
  (title, slug, code, purpose, type, status, city, state, neighborhood,
   address, price, hide_price, condo_fee, iptu, private_area, total_area,
   bedrooms, suites, bathrooms, parking, year_built, description,
   is_featured, is_luxury, is_launch, is_furnished, accepts_pets)
values
(
  'Cobertura Duplex com Vista Mar no Cabo Branco',
  'cobertura-duplex-vista-mar-cabo-branco-ev-c001', 'EV-C001',
  'sale', 'cobertura', 'published', 'João Pessoa', 'PB', 'Cabo Branco',
  'Avenida Cabo Branco', 4850000, false, 3200, 12000, 280, 340,
  4, 4, 5, 4, 2021,
  E'Espetacular cobertura duplex à beira-mar no coração do Cabo Branco. Living amplo integrado a varanda gourmet com vista deslumbrante para o oceano. Acabamento de altíssimo padrão, piscina privativa na cobertura e quatro suítes, sendo a master com closet e hidromassagem.\n\nLocalização privilegiada, a poucos passos da orla mais charmosa de João Pessoa.',
  true, true, false, false, true
),
(
  'Apartamento Alto Padrão no Altiplano',
  'apartamento-alto-padrao-altiplano-ev-a002', 'EV-A002',
  'sale', 'apartamento', 'published', 'João Pessoa', 'PB', 'Altiplano',
  'Rua Deputado Odon Bezerra', 1980000, false, 1450, 5200, 165, 198,
  3, 3, 4, 3, 2020,
  E'Apartamento sofisticado no bairro mais nobre de João Pessoa. Plantas amplas, três suítes, varanda integrada e infraestrutura de lazer completa no condomínio: piscina, academia, espaço gourmet e quadra.\n\nPróximo a colégios, shopping e aos melhores restaurantes da cidade.',
  true, true, false, false, true
),
(
  'Casa em Condomínio Fechado no Altiplano',
  'casa-condominio-fechado-altiplano-ev-h003', 'EV-H003',
  'sale', 'casa-condominio', 'published', 'João Pessoa', 'PB', 'Altiplano',
  'Condomínio Alphaville', 3200000, false, 980, 8800, 320, 450,
  4, 4, 5, 4, 2019,
  E'Casa contemporânea em condomínio fechado de alto padrão. Arquitetura assinada, pé-direito duplo no living, piscina com deck, área gourmet e jardim paisagístico. Quatro suítes espaçosas e home office.\n\nSegurança 24h e total privacidade para a sua família.',
  true, true, false, false, true
),
(
  'Apartamento Garden em Manaíra',
  'apartamento-garden-manaira-ev-a004', 'EV-A004',
  'sale', 'apartamento', 'published', 'João Pessoa', 'PB', 'Manaíra',
  'Avenida Flávio Ribeiro Coutinho', 1450000, false, 1100, 3900, 140, 175,
  3, 2, 3, 2, 2022,
  E'Garden exclusivo em Manaíra, com amplo quintal privativo e área gourmet. Localização central, a minutos do Manaíra Shopping e da orla. Acabamento moderno e plantas inteligentes.',
  true, false, true, false, true
),
(
  'Flat Mobiliado em Tambaú',
  'flat-mobiliado-tambau-ev-f005', 'EV-F005',
  'rent', 'flat', 'published', 'João Pessoa', 'PB', 'Tambaú',
  'Avenida Olinda', 4500, false, 850, 1200, 48, 55,
  1, 1, 1, 1, 2018,
  E'Flat totalmente mobiliado e decorado a uma quadra da praia de Tambaú. Ideal para quem busca praticidade e localização. Prédio com piscina, academia e portaria 24h.\n\nPronto para morar.',
  false, false, false, true, false
),
(
  'Apartamento Frente Mar no Bessa',
  'apartamento-frente-mar-bessa-ev-a006', 'EV-A006',
  'sale', 'apartamento', 'published', 'João Pessoa', 'PB', 'Bessa',
  'Avenida João Maurício', 2350000, false, 1600, 6100, 180, 210,
  4, 3, 4, 3, 2021,
  E'Apartamento frente mar no Bessa, com vista permanente para o oceano de todos os ambientes sociais. Varanda gourmet integrada, quatro quartos e lazer completo no condomínio.\n\nO melhor do morar à beira-mar com tranquilidade.',
  true, true, false, false, true
),
(
  'Casa Térrea no Jardim Oceania',
  'casa-terrea-jardim-oceania-ev-h007', 'EV-H007',
  'sale', 'casa', 'published', 'João Pessoa', 'PB', 'Jardim Oceania',
  'Rua Manoel Fontes Nóbrega', 1290000, false, 0, 4200, 220, 360,
  3, 2, 3, 4, 2017,
  E'Casa térrea espaçosa em rua tranquila do Jardim Oceania. Amplo quintal com churrasqueira, três quartos sendo duas suítes e garagem para quatro carros.\n\nExcelente para famílias que buscam conforto e localização.',
  false, false, false, false, true
),
(
  'Apartamento de Luxo no Aeroclube',
  'apartamento-luxo-aeroclube-ev-a008', 'EV-A008',
  'sale', 'apartamento', 'published', 'João Pessoa', 'PB', 'Aeroclube',
  'Rua Aviador Severiano Lins', 1750000, false, 1250, 4800, 158, 190,
  3, 3, 4, 3, 2023,
  E'Lançamento de altíssimo padrão no Aeroclube. Unidades amplas com três suítes, varanda integrada e o mais completo rooftop da região: piscina com borda infinita, espaço gourmet e lounge.\n\nEntrega em breve.',
  true, true, true, false, true
),
(
  'Apartamento para Alugar em Manaíra',
  'apartamento-alugar-manaira-ev-a009', 'EV-A009',
  'rent', 'apartamento', 'published', 'João Pessoa', 'PB', 'Manaíra',
  'Rua Bancário Sérgio Guerra', 6800, false, 1050, 2800, 120, 145,
  3, 1, 2, 2, 2019,
  E'Apartamento amplo e bem localizado em Manaíra, disponível para locação. Três quartos, varanda e vaga dupla. Condomínio com lazer completo e portaria 24h.\n\nPróximo a comércio, escolas e à praia.',
  false, false, false, false, true
),
(
  'Mansão de Alto Padrão no Intermares',
  'mansao-alto-padrao-intermares-ev-h010', 'EV-H010',
  'sale', 'casa-condominio', 'published', 'Cabedelo', 'PB', 'Intermares',
  'Condomínio Beira Rio', 5200000, false, 1500, 14000, 480, 720,
  5, 5, 7, 6, 2022,
  E'Mansão contemporânea em condomínio de luxo em Intermares, com vista para o rio. Projeto arquitetônico exclusivo, piscina raia, spa, adega climatizada, home theater e cinco suítes amplas.\n\nO ápice do morar bem na Grande João Pessoa.',
  true, true, false, false, true
)
on conflict (code) do nothing;

-- ------------------------------------------------------------
-- Images (3 per property) — Unsplash demo URLs
-- ------------------------------------------------------------
insert into property_images (property_id, url, alt, is_cover, display_order)
select p.id, img.url, p.title, img.ord = 0, img.ord
from properties p
cross join lateral (
  values
    (case p.code
      when 'EV-C001' then 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'
      when 'EV-A002' then 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80'
      when 'EV-H003' then 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80'
      when 'EV-A004' then 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80'
      when 'EV-F005' then 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'
      when 'EV-A006' then 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200&q=80'
      when 'EV-H007' then 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80'
      when 'EV-A008' then 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80'
      when 'EV-A009' then 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80'
      when 'EV-H010' then 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80'
      else 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80'
    end, 0),
    ('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', 1),
    ('https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80', 2)
) as img(url, ord)
where not exists (
  select 1 from property_images pi where pi.property_id = p.id
)
and p.code like 'EV-%';

-- ------------------------------------------------------------
-- Attach a few features to each demo property
-- ------------------------------------------------------------
insert into property_features (property_id, feature_id)
select p.id, f.id
from properties p
join features f on f.name in ('Piscina', 'Academia', 'Portaria 24h', 'Varanda', 'Ar-condicionado')
where p.code like 'EV-%'
on conflict do nothing;

-- Vista para o Mar for beachfront units
insert into property_features (property_id, feature_id)
select p.id, f.id
from properties p
join features f on f.name = 'Vista para o Mar'
where p.code in ('EV-C001', 'EV-A006')
on conflict do nothing;

-- ------------------------------------------------------------
-- Demo testimonials
-- ------------------------------------------------------------
insert into testimonials (name, text, rating, is_published) values
('Mariana Albuquerque', 'Atendimento impecável do início ao fim. Encontrei o apartamento dos meus sonhos no Cabo Branco com total tranquilidade.', 5, true),
('Ricardo Nóbrega', 'Profissionalismo e discrição em todas as etapas. O Eduardo entende como ninguém o mercado de alto padrão de João Pessoa.', 5, true),
('Fernanda Lins', 'Vendi meu imóvel no Altiplano em tempo recorde e por um valor justo. Recomendo de olhos fechados.', 5, true)
on conflict do nothing;
