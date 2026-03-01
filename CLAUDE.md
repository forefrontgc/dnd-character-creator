# D&D Character Creator — Next.js App

## Overview
Kid-friendly D&D character creator upgraded from a single HTML file to a full Next.js app with Supabase persistence, leveling, custom modifiers, and a map generator.

## Tech Stack
- **Next.js 16** (App Router)
- **Tailwind CSS 4** (new @theme syntax)
- **Supabase** (auth-free family database)
- **TypeScript**
- **Google Fonts**: Cinzel (headings), MedievalSharp (flavor text, loaded via link), Inter (body)

## Critical Constraint
ALL race/class/subclass/armor/weapon data and stat computation logic is unchanged from the original HTML. Characters are in play — do NOT modify game data values.

## Project Structure
- `lib/game-data.ts` — All game constants (races, classes, weapons, etc.)
- `lib/stats.ts` — Stat computation (base + level + modifiers)
- `lib/supabase.ts` — Database client and CRUD operations
- `lib/map-generator.ts` — Procedural map generation
- `app/` — Next.js pages (landing, create, characters, maps, dm, print)
- `components/` — Reusable components (wizard steps, UI, modals)
- `dnd-character-creator.html` — Original single-file version (preserved)

## Database
4 tables: `players`, `characters`, `level_ups`, `custom_modifiers`
Schema in `supabase-schema.sql`. No auth — simple player name selection.

## Running
```bash
npm run dev  # runs on port 3000
```

## Setup
1. Create a Supabase project
2. Run `supabase-schema.sql` in the SQL editor
3. Copy URL + anon key into `.env.local`
