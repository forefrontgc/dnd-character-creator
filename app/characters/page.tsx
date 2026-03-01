'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCharactersByPlayer, type DbCharacter } from '@/lib/supabase';
import { findRace, findClass, findSubclass, findArmor, findWeapon, computeBaseStats } from '@/lib/stats';

function CharacterList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerId = searchParams.get('player') || '';
  const playerName = searchParams.get('name') || '';

  const [characters, setCharacters] = useState<DbCharacter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playerId) {
      getCharactersByPlayer(playerId)
        .then(setCharacters)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [playerId]);

  return (
    <div className="min-h-screen bg-dark-bg text-white font-[family-name:var(--font-body)] flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-dark-card via-dark-bg to-dark-card border-b-2 border-gold/30 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-gold/60 hover:text-gold transition-colors font-[family-name:var(--font-cinzel)] font-bold">
            ← Back
          </button>
          <h1 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl text-gold font-bold tracking-wide">
            {playerName}&apos;s Heroes
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 animate-pulse">📜</div>
              <p className="text-parchment/70 text-xl font-[family-name:var(--font-medieval)]">Loading characters...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {characters.map(char => {
                const race = findRace(char.race_id);
                const cls = findClass(char.class_id);
                const subclass = findSubclass(char.class_id, char.subclass_id);
                const armor = findArmor(char.armor_id);
                const weapon = findWeapon(char.class_id, char.weapon_id);
                const stats = computeBaseStats(cls, race, subclass, armor, weapon);

                return (
                  <button
                    key={char.id}
                    onClick={() => router.push(`/characters/${char.id}`)}
                    className="p-6 rounded-2xl border-2 border-gold/20 bg-dark-card hover:border-gold/50 transition-all cursor-pointer card-glow text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{cls?.icon}</span>
                      <div>
                        <h3 className="font-[family-name:var(--font-cinzel)] text-lg text-gold font-bold">{char.char_name}</h3>
                        <p className="text-white/50 text-sm">{race?.name} {cls?.name} — {subclass?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-bold">Lv {char.level}</span>
                    </div>
                    {stats && (
                      <div className="grid grid-cols-4 gap-1 text-xs text-center">
                        <span className="text-red-400">❤️ {stats.health}</span>
                        <span className="text-blue-400">🛡️ {stats.armor}</span>
                        <span className="text-green-400">👢 {stats.moves}</span>
                        <span className="text-yellow-400">⭐ {stats.ap}</span>
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Create New Character */}
              <button
                onClick={() => router.push(`/create?player=${playerId}&name=${encodeURIComponent(playerName)}`)}
                className="p-6 rounded-2xl border-2 border-dashed border-gold/30 bg-dark-card/50 hover:border-gold/60 hover:bg-dark-card transition-all cursor-pointer text-center group min-h-[160px] flex flex-col items-center justify-center"
              >
                <div className="text-4xl mb-2 opacity-50 group-hover:opacity-100 transition-opacity">⚔️</div>
                <h3 className="font-[family-name:var(--font-cinzel)] text-lg text-gold/60 font-bold group-hover:text-gold transition-colors">Create New Character</h3>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CharactersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-gold font-[family-name:var(--font-cinzel)] text-2xl">Loading...</div>
      </div>
    }>
      <CharacterList />
    </Suspense>
  );
}
