-- MAVIZ Anfrageformular – Supabase-Schema
-- Im Supabase-Dashboard unter "SQL Editor" einfügen und ausführen:
-- https://supabase.com/dashboard/project/hjatmmyyhvqkeqslpolm/sql/new

create table if not exists public.anfragen (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  telefon text,
  email text not null,
  anlass text not null,
  datum date,
  gaeste integer,
  ort text,
  nachricht text
);

-- Row Level Security aktivieren
alter table public.anfragen enable row level security;

-- Jede(r) darf eine Anfrage einfügen (Formular ist öffentlich)
create policy "Öffentliches Einfügen erlaubt"
  on public.anfragen
  for insert
  to anon
  with check (true);

-- Niemand darf über den öffentlichen Key lesen/ändern/löschen.
-- Die Anfragen siehst du selbst im Supabase-Dashboard unter "Table Editor"
-- (dort bist du als Projekt-Besitzer eingeloggt, RLS gilt nicht für dich).
