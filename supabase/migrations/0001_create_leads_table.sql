-- Leads captured by the Columba AI Assistant chat widget.
-- Run this once in your Supabase project's SQL editor (or via the CLI)
-- before setting SUPABASE_SERVICE_ROLE_KEY in production.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  project_type text not null,
  message text not null
);

-- Service-role key (used server-side in src/app/api/lead/route.ts) bypasses
-- RLS, so this just keeps the table locked down from the public/anon key
-- if it's ever exposed client-side.
alter table public.leads enable row level security;

create policy "No public access"
  on public.leads
  for all
  to anon, authenticated
  using (false);
