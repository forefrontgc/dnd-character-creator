-- D&D Character Creator Database Schema
-- Run this in your Supabase SQL Editor to set up the tables

-- Players (simple, no auth)
create table players (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

-- Characters
create table characters (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  player_name text not null,
  char_name text not null,
  char_age int,
  char_gender text,
  race_id text not null,
  class_id text not null,
  subclass_id text not null,
  armor_id text not null,
  weapon_id text not null,
  level int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Level Ups (one record per level gained)
create table level_ups (
  id uuid primary key default gen_random_uuid(),
  character_id uuid references characters(id) on delete cascade,
  level int not null,
  bonus_type text not null,
  created_at timestamptz default now()
);

-- Custom Modifiers (items, curses, blessings, etc.)
create table custom_modifiers (
  id uuid primary key default gen_random_uuid(),
  character_id uuid references characters(id) on delete cascade,
  name text not null,
  description text,
  health_mod int default 0,
  armor_mod int default 0,
  move_mod int default 0,
  ap_mod int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Enable Row Level Security (public access for family app)
alter table players enable row level security;
alter table characters enable row level security;
alter table level_ups enable row level security;
alter table custom_modifiers enable row level security;

-- Allow all operations (no auth, family app)
create policy "Public access" on players for all using (true) with check (true);
create policy "Public access" on characters for all using (true) with check (true);
create policy "Public access" on level_ups for all using (true) with check (true);
create policy "Public access" on custom_modifiers for all using (true) with check (true);
