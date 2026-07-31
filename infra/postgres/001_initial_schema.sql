create extension if not exists pgcrypto;

create table if not exists firms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists firm_users (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id),
  email text not null,
  full_name text not null,
  role text not null check (role in ('FIRM_ADMIN', 'CPA_PREPARER', 'CPA_REVIEWER', 'CLIENT')),
  mfa_enabled boolean not null default false,
  access_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  unique (firm_id, email)
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id),
  client_type text not null check (client_type in ('BUSINESS', 'INDIVIDUAL')),
  display_name text not null,
  primary_email text,
  created_at timestamptz not null default now()
);

create table if not exists tax_returns (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id),
  client_id uuid not null references clients(id),
  tax_year integer not null,
  return_type text not null,
  filing_status text,
  status text not null default 'intake',
  assigned_preparer_id uuid references firm_users(id),
  assigned_reviewer_id uuid references firm_users(id),
  created_at timestamptz not null default now(),
  unique (client_id, tax_year, return_type)
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id),
  client_id uuid not null references clients(id),
  tax_return_id uuid references tax_returns(id),
  category text not null,
  document_name text not null,
  storage_key text not null,
  content_type text not null,
  uploaded_by uuid references firm_users(id),
  created_at timestamptz not null default now()
);

create table if not exists ai_assistant_events (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id),
  tax_return_id uuid references tax_returns(id),
  user_id uuid references firm_users(id),
  action text not null,
  prompt_summary text not null,
  response_summary text,
  approved_by uuid references firm_users(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_clients_firm on clients(firm_id);
create index if not exists idx_tax_returns_firm_year on tax_returns(firm_id, tax_year);
create index if not exists idx_documents_return on documents(tax_return_id);
