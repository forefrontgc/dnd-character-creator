'use client';

import type { DbCharacter } from '@/lib/supabase';
import { findRace, findClass, findSubclass } from '@/lib/stats';

interface CharacterCardProps {
  character: DbCharacter;
  onClick?: () => void;
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
  const race = findRace(character.race_id);
  const cls = findClass(character.class_id);
  const subclass = findSubclass(character.class_id, character.subclass_id);

  return (
    <button
      onClick={onClick}
      className="p-6 rounded-2xl border-2 border-gold/20 bg-dark-card hover:border-gold/50 transition-all cursor-pointer card-glow text-left w-full"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{cls?.icon}</span>
        <div>
          <h3 className="font-[family-name:var(--font-cinzel)] text-lg text-gold font-bold">{character.char_name}</h3>
          <p className="text-white/50 text-sm">{race?.name} {cls?.name} — {subclass?.name}</p>
        </div>
      </div>
      <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-bold">Lv {character.level}</span>
    </button>
  );
}
