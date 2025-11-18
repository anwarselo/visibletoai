create extension if not exists "uuid-ossp";

create table if not exists majed_businesses (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  website text,
  phone text,
  address_json jsonb,
  verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists majed_assets (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references majed_businesses(id) on delete cascade,
  file_path text not null,
  mime_type text not null,
  sha256 text,
  ocr_text text,
  meta jsonb,
  created_at timestamptz default now()
);

create table if not exists majed_public_pages (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null unique references majed_businesses(id) on delete cascade,
  url text not null,
  html_render text not null,
  jsonld jsonb not null,
  last_published_at timestamptz default now()
);

create table if not exists majed_index_events (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references majed_businesses(id) on delete cascade,
  url text not null,
  event_type text not null,
  status int,
  response jsonb,
  created_at timestamptz default now()
);

