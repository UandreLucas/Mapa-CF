-- Migration: empreendimentos (developments)
-- Run in Supabase SQL Editor
--
-- A development is not a property: it has several floor plans, a price
-- range, a construction stage and a sales pitch that the property form
-- cannot hold. Rich content lives in jsonb columns, following the same
-- pattern already used by neighborhoods.

create table if not exists developments (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  tagline text,                      -- short hook under the title
  developer text,                    -- incorporadora, e.g. "Massai"

  -- Location
  neighborhood text,
  city text default 'João Pessoa',
  state text default 'PB',
  address text,
  map_embed_url text,

  -- Commercial
  price_from numeric,                -- "a partir de"
  stage text default 'launch'
    check (stage in ('launch', 'construction', 'ready')),
  delivery_date text,                -- free text, e.g. "Dez/2027"

  -- Editorial
  description text,
  target_audience text,              -- "público ideal"
  differentials jsonb default '[]',  -- [{icon,title,text}]
  amenities jsonb default '[]',      -- [{icon,name}]
  units jsonb default '[]',          -- [{name,area,bedrooms,suites,parking,price_from,image}]
  images jsonb default '[]',         -- [{url,alt}]
  cover_image_url text,
  video_url text,

  -- Publishing
  is_published boolean default false,
  is_featured boolean default false,
  display_order int default 0,
  seo_title text,
  seo_description text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_developments_slug on developments(slug);
create index if not exists idx_developments_published on developments(is_published);

-- ---- RLS ----
alter table developments enable row level security;

drop policy if exists "public read published developments" on developments;
create policy "public read published developments" on developments
  for select using (is_published = true);

drop policy if exists "auth full read developments" on developments;
create policy "auth full read developments" on developments
  for select to authenticated using (true);

drop policy if exists "auth write developments" on developments;
create policy "auth write developments" on developments
  for all to authenticated using (true) with check (true);

-- ---- Leads: new type for development enquiries ----
-- leads.type carries a check constraint, so it has to be widened before
-- the new value can be inserted; otherwise every development enquiry is
-- rejected by the database.
alter table leads drop constraint if exists leads_type_check;
alter table leads add constraint leads_type_check check (
  type in (
    'contact', 'property_interest', 'list_property',
    'evaluate', 'schedule', 'newsletter', 'development_interest'
  )
);

-- Link a lead back to the development it came from.
alter table leads
  add column if not exists development_id uuid references developments(id);
