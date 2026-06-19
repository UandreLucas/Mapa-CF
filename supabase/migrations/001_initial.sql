-- ============================================================
-- Eduardo Vieira Imóveis — Initial schema
-- ============================================================

-- Enable extensions
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- profiles
-- ------------------------------------------------------------
create table if not exists profiles (
  id uuid references auth.users primary key,
  name text,
  email text,
  role text default 'admin' check (role in ('admin', 'broker', 'attendant')),
  creci text,
  phone text,
  whatsapp text,
  avatar_url text,
  bio text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- cities
-- ------------------------------------------------------------
create table if not exists cities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  state text not null default 'PB',
  slug text unique not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- neighborhoods
-- ------------------------------------------------------------
create table if not exists neighborhoods (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city_id uuid references cities(id),
  slug text unique not null,
  description text,
  cover_image_url text,
  seo_title text,
  seo_description text,
  is_active boolean default true,
  is_featured boolean default false,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- properties
-- ------------------------------------------------------------
create table if not exists properties (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  code text unique not null,
  purpose text not null check (purpose in ('sale', 'rent', 'both')),
  type text not null,
  status text default 'draft' check (status in ('draft', 'published', 'sold', 'rented', 'archived')),
  city text not null,
  state text not null default 'PB',
  neighborhood text not null,
  neighborhood_id uuid references neighborhoods(id),
  address text,
  number text,
  complement text,
  zip_code text,
  latitude decimal(10,8),
  longitude decimal(11,8),
  hide_address boolean default false,
  price decimal(12,2),
  hide_price boolean default false,
  condo_fee decimal(10,2),
  iptu decimal(10,2),
  private_area decimal(10,2),
  total_area decimal(10,2),
  bedrooms int default 0,
  suites int default 0,
  bathrooms int default 0,
  parking int default 0,
  year_built int,
  description text,
  video_url text,
  virtual_tour_url text,
  broker_id uuid references profiles(id),
  is_featured boolean default false,
  is_luxury boolean default false,
  is_launch boolean default false,
  is_furnished boolean default false,
  accepts_pets boolean default false,
  available_from date,
  seo_title text,
  seo_description text,
  views_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- ------------------------------------------------------------
-- property_images
-- ------------------------------------------------------------
create table if not exists property_images (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id) on delete cascade,
  url text not null,
  alt text,
  is_cover boolean default false,
  display_order int default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- features
-- ------------------------------------------------------------
create table if not exists features (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  category text,
  icon text
);

-- ------------------------------------------------------------
-- property_features
-- ------------------------------------------------------------
create table if not exists property_features (
  property_id uuid references properties(id) on delete cascade,
  feature_id uuid references features(id) on delete cascade,
  primary key (property_id, feature_id)
);

-- ------------------------------------------------------------
-- leads
-- ------------------------------------------------------------
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  whatsapp text,
  message text,
  type text default 'contact' check (type in ('contact', 'property_interest', 'list_property', 'evaluate', 'schedule', 'newsletter')),
  status text default 'new' check (status in ('new', 'contacted', 'attending', 'scheduled', 'proposal', 'converted', 'lost')),
  property_id uuid references properties(id),
  source text,
  best_time text,
  privacy_consent boolean default false,
  assigned_to uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- lead_notes
-- ------------------------------------------------------------
create table if not exists lead_notes (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  content text not null,
  author_id uuid references profiles(id),
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- settings
-- ------------------------------------------------------------
create table if not exists settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- testimonials
-- ------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  text text not null,
  rating int default 5,
  property_id uuid references properties(id),
  is_published boolean default false,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- saved_properties
-- ------------------------------------------------------------
create table if not exists saved_properties (
  user_id uuid,
  property_id uuid references properties(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, property_id)
);

-- ------------------------------------------------------------
-- property_views
-- ------------------------------------------------------------
create table if not exists property_views (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id) on delete cascade,
  ip_hash text,
  user_agent text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- import_jobs
-- ------------------------------------------------------------
create table if not exists import_jobs (
  id uuid primary key default uuid_generate_v4(),
  filename text,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  total_rows int default 0,
  imported_rows int default 0,
  error_rows int default 0,
  errors jsonb,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------
create index if not exists idx_properties_status on properties(status);
create index if not exists idx_properties_purpose on properties(purpose);
create index if not exists idx_properties_neighborhood on properties(neighborhood);
create index if not exists idx_properties_city on properties(city);
create index if not exists idx_properties_is_featured on properties(is_featured);
create index if not exists idx_properties_is_luxury on properties(is_luxury);
create index if not exists idx_properties_price on properties(price);
create index if not exists idx_properties_deleted_at on properties(deleted_at);
create index if not exists idx_property_images_property on property_images(property_id);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_created_at on leads(created_at);

-- ------------------------------------------------------------
-- updated_at trigger
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_properties_updated on properties;
create trigger trg_properties_updated before update on properties
  for each row execute function set_updated_at();

drop trigger if exists trg_neighborhoods_updated on neighborhoods;
create trigger trg_neighborhoods_updated before update on neighborhoods
  for each row execute function set_updated_at();

drop trigger if exists trg_leads_updated on leads;
create trigger trg_leads_updated before update on leads
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- New auth user -> profile
-- ------------------------------------------------------------
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table profiles enable row level security;
alter table cities enable row level security;
alter table neighborhoods enable row level security;
alter table properties enable row level security;
alter table property_images enable row level security;
alter table features enable row level security;
alter table property_features enable row level security;
alter table leads enable row level security;
alter table lead_notes enable row level security;
alter table settings enable row level security;
alter table testimonials enable row level security;
alter table saved_properties enable row level security;
alter table property_views enable row level security;
alter table import_jobs enable row level security;

-- Helper: is the current request an authenticated app user?
-- (All authenticated users are staff in this single-tenant app.)

-- ---- Public read policies ----
drop policy if exists "public read published properties" on properties;
create policy "public read published properties" on properties
  for select using (status = 'published' and deleted_at is null);

drop policy if exists "auth full read properties" on properties;
create policy "auth full read properties" on properties
  for select to authenticated using (true);

drop policy if exists "auth write properties" on properties;
create policy "auth write properties" on properties
  for all to authenticated using (true) with check (true);

drop policy if exists "public read property_images" on property_images;
create policy "public read property_images" on property_images
  for select using (true);

drop policy if exists "auth write property_images" on property_images;
create policy "auth write property_images" on property_images
  for all to authenticated using (true) with check (true);

drop policy if exists "public read neighborhoods" on neighborhoods;
create policy "public read neighborhoods" on neighborhoods
  for select using (true);

drop policy if exists "auth write neighborhoods" on neighborhoods;
create policy "auth write neighborhoods" on neighborhoods
  for all to authenticated using (true) with check (true);

drop policy if exists "public read cities" on cities;
create policy "public read cities" on cities for select using (true);

drop policy if exists "auth write cities" on cities;
create policy "auth write cities" on cities
  for all to authenticated using (true) with check (true);

drop policy if exists "public read features" on features;
create policy "public read features" on features for select using (true);

drop policy if exists "auth write features" on features;
create policy "auth write features" on features
  for all to authenticated using (true) with check (true);

drop policy if exists "public read property_features" on property_features;
create policy "public read property_features" on property_features
  for select using (true);

drop policy if exists "auth write property_features" on property_features;
create policy "auth write property_features" on property_features
  for all to authenticated using (true) with check (true);

drop policy if exists "public read settings" on settings;
create policy "public read settings" on settings for select using (true);

drop policy if exists "auth write settings" on settings;
create policy "auth write settings" on settings
  for all to authenticated using (true) with check (true);

drop policy if exists "public read testimonials" on testimonials;
create policy "public read testimonials" on testimonials
  for select using (is_published = true);

drop policy if exists "auth full testimonials" on testimonials;
create policy "auth full testimonials" on testimonials
  for all to authenticated using (true) with check (true);

-- ---- Leads: anyone can insert (contact forms), staff can read/manage ----
drop policy if exists "public insert leads" on leads;
create policy "public insert leads" on leads
  for insert with check (true);

drop policy if exists "auth read leads" on leads;
create policy "auth read leads" on leads
  for select to authenticated using (true);

drop policy if exists "auth update leads" on leads;
create policy "auth update leads" on leads
  for update to authenticated using (true) with check (true);

drop policy if exists "auth delete leads" on leads;
create policy "auth delete leads" on leads
  for delete to authenticated using (true);

drop policy if exists "auth manage lead_notes" on lead_notes;
create policy "auth manage lead_notes" on lead_notes
  for all to authenticated using (true) with check (true);

-- ---- Property views: anyone can insert ----
drop policy if exists "public insert views" on property_views;
create policy "public insert views" on property_views
  for insert with check (true);

drop policy if exists "auth read views" on property_views;
create policy "auth read views" on property_views
  for select to authenticated using (true);

-- ---- Profiles ----
drop policy if exists "auth read profiles" on profiles;
create policy "auth read profiles" on profiles
  for select to authenticated using (true);

drop policy if exists "self update profile" on profiles;
create policy "self update profile" on profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- ---- Import jobs ----
drop policy if exists "auth manage import_jobs" on import_jobs;
create policy "auth manage import_jobs" on import_jobs
  for all to authenticated using (true) with check (true);

-- ---- Saved properties (per user) ----
drop policy if exists "self manage saved" on saved_properties;
create policy "self manage saved" on saved_properties
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Storage bucket for property images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "public read property images" on storage.objects;
create policy "public read property images" on storage.objects
  for select using (bucket_id = 'property-images');

drop policy if exists "auth upload property images" on storage.objects;
create policy "auth upload property images" on storage.objects
  for insert to authenticated with check (bucket_id = 'property-images');

drop policy if exists "auth update property images" on storage.objects;
create policy "auth update property images" on storage.objects
  for update to authenticated using (bucket_id = 'property-images');

drop policy if exists "auth delete property images" on storage.objects;
create policy "auth delete property images" on storage.objects
  for delete to authenticated using (bucket_id = 'property-images');

-- ============================================================
-- Default settings
-- ============================================================
insert into settings (key, value) values
('broker_name', 'Eduardo Vieira'),
('broker_creci', 'CRECI-PB [NÚMERO]'),
('broker_phone', '[TELEFONE]'),
('broker_whatsapp', '[WHATSAPP]'),
('broker_email', '[EMAIL]'),
('broker_avatar', ''),
('company_name', 'Eduardo Vieira Imóveis'),
('company_address', 'João Pessoa, Paraíba'),
('company_instagram', ''),
('company_facebook', ''),
('company_youtube', ''),
('company_bio', 'Especialista em imóveis de alto padrão em João Pessoa há mais de 10 anos. Atendimento personalizado, curadoria exclusiva e acompanhamento completo em todas as etapas.'),
('whatsapp_default_message', 'Olá, Eduardo! Gostaria de mais informações sobre um imóvel.'),
('seo_title', 'Eduardo Vieira Imóveis | Imóveis de Alto Padrão em João Pessoa'),
('seo_description', 'Encontre imóveis exclusivos em João Pessoa com Eduardo Vieira. Especialista em alto padrão nos melhores bairros da cidade.'),
('office_hours', 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h'),
('primary_color', '#1A1A2E'),
('accent_color', '#C9A96E')
on conflict (key) do nothing;

-- ============================================================
-- Demo cities
-- ============================================================
insert into cities (name, state, slug) values
('João Pessoa', 'PB', 'joao-pessoa'),
('Cabedelo', 'PB', 'cabedelo')
on conflict (slug) do nothing;

-- ============================================================
-- Demo neighborhoods
-- ============================================================
insert into neighborhoods (name, city_id, slug, description, is_active, is_featured, display_order)
select
  n.name, c.id, n.slug, n.description, true, true, n.ord
from (values
  ('Altiplano', 'altiplano', 'Um dos bairros mais nobres de João Pessoa, com vista privilegiada e imóveis de alto padrão.', 1),
  ('Cabo Branco', 'cabo-branco', 'Bairro beira-mar sofisticado, referência em qualidade de vida e infraestrutura completa.', 2),
  ('Jardim Oceania', 'jardim-oceania', 'Excelente localização com fácil acesso às principais vias e comércios da cidade.', 3),
  ('Bessa', 'bessa', 'Bairro residencial tranquilo próximo ao mar, ideal para famílias.', 4),
  ('Manaíra', 'manaira', 'Um dos bairros mais valorizados de João Pessoa, com ampla estrutura de lazer e comércio.', 5),
  ('Tambaú', 'tambau', 'Coração turístico de João Pessoa, bairro tradicional e bem estruturado à beira-mar.', 6),
  ('Aeroclube', 'aeroclube', 'Bairro residencial moderno com excelente infraestrutura e fácil acesso.', 7),
  ('Intermares', 'intermares', 'Bairro em Cabedelo com belíssimas praias e empreendimentos modernos.', 8)
) as n(name, slug, description, ord)
cross join cities c where c.slug = 'joao-pessoa'
on conflict (slug) do nothing;

-- ============================================================
-- Demo features
-- ============================================================
insert into features (name, category) values
('Piscina', 'lazer'),
('Academia', 'lazer'),
('Churrasqueira', 'lazer'),
('Salão de Festas', 'lazer'),
('Playground', 'lazer'),
('Quadra', 'lazer'),
('Sauna', 'lazer'),
('Spa', 'lazer'),
('Elevador', 'condominio'),
('Portaria 24h', 'condominio'),
('Câmeras de Segurança', 'condominio'),
('Gerador', 'condominio'),
('Ar-condicionado', 'imovel'),
('Armários Embutidos', 'imovel'),
('Varanda', 'imovel'),
('Vista para o Mar', 'imovel'),
('Vista para a Cidade', 'imovel'),
('Alto Padrão', 'imovel'),
('Mobiliado', 'imovel'),
('Lavanderia', 'imovel')
on conflict (name) do nothing;
