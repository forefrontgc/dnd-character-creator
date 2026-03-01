'use client';

import { FANTASY_NAMES } from '@/lib/game-data';

interface StepIdentityProps {
  playerName: string;
  setPlayerName: (v: string) => void;
  charName: string;
  setCharName: (v: string) => void;
  charAge: string;
  setCharAge: (v: string) => void;
  charGender: string;
  setCharGender: (v: string) => void;
  customGender: string;
  setCustomGender: (v: string) => void;
  hidePlayerName?: boolean;
}

export function StepIdentity({
  playerName, setPlayerName, charName, setCharName,
  charAge, setCharAge, charGender, setCharGender,
  customGender, setCustomGender, hidePlayerName,
}: StepIdentityProps) {
  const randomName = () => {
    setCharName(FANTASY_NAMES[Math.floor(Math.random() * FANTASY_NAMES.length)]);
  };

  return (
    <div>
      <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl text-gold font-bold mb-2">Who Are You, Adventurer?</h2>
      <p className="text-parchment/70 mb-8 text-lg">First, tell us your real name. Then create your hero!</p>

      <div className="space-y-6 max-w-md mx-auto">
        {!hidePlayerName && (
          <div>
            <label className="block font-[family-name:var(--font-cinzel)] text-gold text-sm font-bold mb-2">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="Enter your real name..."
              className="w-full px-4 py-3 rounded-xl bg-dark-card border-2 border-gold/30 text-white text-lg focus:border-gold focus:outline-none transition-all"
              maxLength={40}
            />
            <p className="text-white/40 text-sm mt-1">The person playing this character</p>
          </div>
        )}

        <div>
          <label className="block font-[family-name:var(--font-cinzel)] text-gold text-sm font-bold mb-2">Character Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={charName}
              onChange={e => setCharName(e.target.value)}
              placeholder="Enter your hero's name..."
              className="flex-1 px-4 py-3 rounded-xl bg-dark-card border-2 border-gold/30 text-white text-lg font-[family-name:var(--font-medieval)] placeholder:text-white/30 focus:border-gold focus:outline-none transition-all"
              maxLength={40}
            />
            <button
              onClick={randomName}
              className="px-4 py-3 rounded-xl bg-dark-border text-gold border-2 border-gold/30 hover:bg-gold/20 transition-all font-semibold text-sm whitespace-nowrap"
              title="Generate a random fantasy name"
            >
              🎲 Random
            </button>
          </div>
        </div>

        <div>
          <label className="block font-[family-name:var(--font-cinzel)] text-gold text-sm font-bold mb-2">Age</label>
          <input
            type="number"
            value={charAge}
            onChange={e => setCharAge(e.target.value)}
            min={10}
            max={999}
            placeholder="10 - 999"
            className="w-full px-4 py-3 rounded-xl bg-dark-card border-2 border-gold/30 text-white text-lg focus:border-gold focus:outline-none transition-all"
          />
          <p className="text-white/40 text-sm mt-1">Fantasy ages welcome — elves can be 300!</p>
        </div>

        <div>
          <label className="block font-[family-name:var(--font-cinzel)] text-gold text-sm font-bold mb-2">Gender</label>
          <div className="flex gap-3 flex-wrap">
            {['Male', 'Female', 'Other'].map(g => (
              <button
                key={g}
                onClick={() => setCharGender(g)}
                className={`px-6 py-3 rounded-xl font-semibold text-lg border-2 transition-all
                  ${charGender === g ? 'bg-gold text-dark-bg border-gold' : 'bg-dark-card border-gold/30 text-white hover:border-gold/60'}`}
              >
                {g}
              </button>
            ))}
          </div>
          {charGender === 'Other' && (
            <input
              type="text"
              value={customGender}
              onChange={e => setCustomGender(e.target.value)}
              placeholder="How does your hero identify?"
              className="mt-3 w-full px-4 py-3 rounded-xl bg-dark-card border-2 border-gold/30 text-white text-lg focus:border-gold focus:outline-none transition-all"
              maxLength={30}
            />
          )}
        </div>
      </div>
    </div>
  );
}
