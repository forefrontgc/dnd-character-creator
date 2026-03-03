'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPlayers, createPlayer, getCharactersByPlayer, type DbPlayer } from '@/lib/supabase';

export default function HomePage() {
  const router = useRouter();
  const [players, setPlayers] = useState<DbPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [charCounts, setCharCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    try {
      const data = await getPlayers();
      data.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      setPlayers(data);
      const counts: Record<string, number> = {};
      for (const p of data) {
        const chars = await getCharactersByPlayer(p.id);
        counts[p.id] = chars.length;
      }
      setCharCounts(counts);
    } catch {
      setError('Could not connect to database. Check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddPlayer() {
    if (!newName.trim()) return;
    try {
      const player = await createPlayer(newName.trim());
      setPlayers(prev => [...prev, player]);
      setCharCounts(prev => ({ ...prev, [player.id]: 0 }));
      setNewName('');
      setAdding(false);
      router.push(`/characters?player=${player.id}&name=${encodeURIComponent(player.name)}`);
    } catch {
      setError('That name is already taken! Try a different one.');
      setTimeout(() => setError(''), 3000);
    }
  }

  function selectPlayer(player: DbPlayer) {
    router.push(`/characters?player=${player.id}&name=${encodeURIComponent(player.name)}`);
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white font-[family-name:var(--font-body)] flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-dark-card via-dark-bg to-dark-card border-b-2 border-gold/30 p-6 text-center">
        <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl text-gold font-bold tracking-wide">
          D&D Character Creator
        </h1>
        <p className="font-[family-name:var(--font-medieval)] text-parchment/70 mt-2 text-xl">Choose Your Adventurer</p>
      </header>

      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 animate-pulse">⚔️</div>
              <p className="text-parchment/70 text-xl font-[family-name:var(--font-medieval)]">Summoning adventurers...</p>
            </div>
          ) : error && players.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔮</div>
              <p className="text-orange-400 text-lg mb-4">{error}</p>
              <p className="text-white/50 text-sm">Make sure your <code className="bg-dark-card px-2 py-1 rounded">.env.local</code> has the correct Supabase URL and key.</p>
            </div>
          ) : (
            <>
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-gold font-bold mb-6 text-center">Who&apos;s Playing?</h2>

              {error && (
                <div className="text-center mb-4">
                  <span className="text-orange-400 text-sm">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {players.map(p => (
                  <button
                    key={p.id}
                    onClick={() => selectPlayer(p)}
                    className="p-8 rounded-2xl border-2 border-gold/20 bg-dark-card hover:border-gold/50 transition-all cursor-pointer card-glow text-center group"
                  >
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">⚔️</div>
                    <h3 className="font-[family-name:var(--font-cinzel)] text-2xl text-gold font-bold">{p.name}</h3>
                    <p className="text-white/50 text-sm mt-2">
                      {charCounts[p.id] === 0 ? 'No characters yet' :
                       charCounts[p.id] === 1 ? '1 character' :
                       `${charCounts[p.id]} characters`}
                    </p>
                  </button>
                ))}

                {/* Add New Player */}
                {adding ? (
                  <div className="p-8 rounded-2xl border-2 border-gold/40 bg-dark-border/50 text-center">
                    <div className="text-4xl mb-3">✨</div>
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddPlayer(); }}
                      placeholder="Enter your name..."
                      className="w-full px-4 py-3 rounded-xl bg-dark-card border-2 border-gold/30 text-white text-lg text-center font-[family-name:var(--font-cinzel)] placeholder:text-white/30 focus:border-gold focus:outline-none transition-all mb-3"
                      maxLength={40}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setAdding(false); setNewName(''); }}
                        className="flex-1 px-4 py-2 rounded-xl border-2 border-gold/30 text-gold/70 hover:bg-gold/10 font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddPlayer}
                        disabled={!newName.trim()}
                        className="flex-1 px-4 py-2 rounded-xl bg-gold text-dark-bg font-bold hover:bg-gold-dark disabled:opacity-30 transition-all"
                      >
                        Join!
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAdding(true)}
                    className="p-8 rounded-2xl border-2 border-dashed border-gold/30 bg-dark-card/50 hover:border-gold/60 hover:bg-dark-card transition-all cursor-pointer text-center group"
                  >
                    <div className="text-5xl mb-3 opacity-50 group-hover:opacity-100 transition-opacity">➕</div>
                    <h3 className="font-[family-name:var(--font-cinzel)] text-xl text-gold/60 font-bold group-hover:text-gold transition-colors">Add New Player</h3>
                  </button>
                )}
              </div>
            </>
          )}

          {/* Navigation links */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push('/maps')}
              className="px-6 py-3 rounded-xl border-2 border-gold/20 text-gold/60 hover:border-gold/50 hover:text-gold transition-all font-[family-name:var(--font-cinzel)] font-bold"
            >
              🗺️ Map Generator
            </button>
            <button
              onClick={() => router.push('/dm')}
              className="px-6 py-3 rounded-xl border-2 border-gold/20 text-gold/60 hover:border-gold/50 hover:text-gold transition-all font-[family-name:var(--font-cinzel)] font-bold"
            >
              📋 DM Reference
            </button>
            <button
              onClick={() => router.push('/dm-toolbox')}
              className="px-6 py-3 rounded-xl border-2 border-gold/20 text-gold/60 hover:border-gold/50 hover:text-gold transition-all font-[family-name:var(--font-cinzel)] font-bold"
            >
              💀 DM Toolbox
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
