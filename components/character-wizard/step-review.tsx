'use client';

import type { Race, GameClass, Subclass, ArmorType, Weapon } from '@/lib/game-data';
import type { ComputedStats } from '@/lib/stats';
import { StatBox } from '@/components/stat-box';

interface StepReviewProps {
  playerName: string;
  charName: string;
  charAge: string;
  gender: string;
  race: Race | undefined;
  cls: GameClass | undefined;
  subclass: Subclass | undefined;
  armor: ArmorType | undefined;
  weapon: Weapon | undefined;
  stats: ComputedStats | null;
  onEdit: (step: number) => void;
  onSave: () => void;
  saving?: boolean;
}

export function StepReview({
  playerName, charName, charAge, gender,
  race, cls, subclass, armor, weapon, stats,
  onEdit, onSave, saving,
}: StepReviewProps) {
  const abilities: { name: string; desc: string; source: string }[] = [];
  if (race) abilities.push({ name: race.trait, desc: race.traitDesc, source: 'Race' });
  if (subclass) abilities.push({ name: subclass.ability, desc: subclass.abilityDesc, source: 'Subclass' });
  if (subclass?.extra) abilities.push({ name: 'Bonus', desc: subclass.extra, source: 'Subclass' });
  if (weapon?.special) abilities.push({ name: weapon.name, desc: weapon.special, source: 'Weapon' });

  return (
    <div>
      <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl text-gold font-bold mb-2 text-center">Your Hero is Ready!</h2>
      <p className="text-parchment/70 mb-8 text-lg text-center">Behold, the legendary {charName}!</p>

      <div className="max-w-2xl mx-auto parchment-bg rounded-2xl p-6 md:p-8 fantasy-border text-dark-bg">
        {/* Header */}
        <div className="text-center border-b-2 border-gold-dark/30 pb-4 mb-4">
          <h3 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-dark-bg">{charName}</h3>
          <p className="font-[family-name:var(--font-medieval)] text-lg text-dark-bg/70 mt-1">
            {race?.name} {cls?.name} — {subclass?.name}
          </p>
          <p className="text-sm text-dark-bg/50 mt-1">Age: {charAge} | Gender: {gender}</p>
          <p className="text-sm text-dark-bg/40 mt-1">Played by {playerName}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatBox icon="❤️" label="Health" value={stats?.health} color="text-red-600" />
          <StatBox icon="🛡️" label="Armor" value={stats?.armor} color="text-blue-600" />
          <StatBox icon="👢" label="Moves/Turn" value={stats?.moves} color="text-green-700" />
          <StatBox icon="⭐" label="Action Pts" value={stats?.ap} color="text-yellow-600" />
        </div>

        {/* Weapon */}
        <div className="bg-white/40 rounded-xl p-4 mb-4">
          <h4 className="font-[family-name:var(--font-cinzel)] font-bold text-sm text-dark-bg/60 mb-1">WEAPON</h4>
          <div className="font-bold text-lg">{weapon?.name}</div>
          <div className="text-sm">Damage: {weapon?.damage} | {weapon?.special}</div>
        </div>

        {/* Armor */}
        <div className="bg-white/40 rounded-xl p-4 mb-4">
          <h4 className="font-[family-name:var(--font-cinzel)] font-bold text-sm text-dark-bg/60 mb-1">ARMOR</h4>
          <div className="font-bold text-lg">{armor?.name}</div>
          <div className="text-sm">{armor?.flavor}</div>
        </div>

        {/* Abilities */}
        <div className="bg-white/40 rounded-xl p-4 mb-4">
          <h4 className="font-[family-name:var(--font-cinzel)] font-bold text-sm text-dark-bg/60 mb-2">ABILITIES & TRAITS</h4>
          <div className="space-y-2">
            {abilities.map((a, i) => (
              <div key={i} className="text-sm">
                <span className="font-bold">{a.name}</span>
                <span className="text-dark-bg/50 text-xs ml-1">({a.source})</span>
                <span className="text-dark-bg/80"> — {a.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spells (Mage only) */}
        {subclass?.spells && (
          <div className="bg-white/40 rounded-xl p-4 mb-4">
            <h4 className="font-[family-name:var(--font-cinzel)] font-bold text-sm text-dark-bg/60 mb-2">SPELLS</h4>
            <div className="space-y-2">
              {subclass.spells.map((sp, i) => (
                <div key={i} className="text-sm">
                  <span className="font-bold">{sp.name}</span>
                  <span className="text-dark-bg/50"> ({sp.cost})</span>
                  <span className="text-dark-bg/80"> — {sp.effect}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="max-w-2xl mx-auto mt-6 flex flex-wrap gap-3 justify-center">
        <button onClick={() => onEdit(0)} className="px-5 py-3 rounded-xl bg-dark-card border-2 border-gold/30 text-gold font-[family-name:var(--font-cinzel)] font-bold hover:bg-gold/10 transition-all">
          Edit Character
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-gold text-dark-bg font-[family-name:var(--font-cinzel)] font-bold hover:bg-gold-dark transition-all glow-pulse disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Character'}
        </button>
      </div>
    </div>
  );
}
