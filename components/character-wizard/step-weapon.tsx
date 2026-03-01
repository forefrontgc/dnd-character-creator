'use client';

import { WEAPONS } from '@/lib/game-data';
import { FantasyCard } from '@/components/ui/fantasy-card';

interface StepWeaponProps {
  selected: string;
  onSelect: (id: string) => void;
  classId: string;
}

export function StepWeapon({ selected, onSelect, classId }: StepWeaponProps) {
  const weapons = WEAPONS[classId] || [];

  return (
    <div>
      <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl text-gold font-bold mb-2">Choose Your Weapon</h2>
      <p className="text-parchment/70 mb-8 text-lg">Every warrior needs a trusty weapon. Pick yours!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {weapons.map(w => (
          <FantasyCard key={w.id} selected={selected === w.id} onClick={() => onSelect(w.id)}>
            <h3 className="font-[family-name:var(--font-cinzel)] text-lg text-gold font-bold mb-2">{w.name}</h3>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-red-400 font-bold text-lg">{w.damage} DMG</span>
            </div>
            <p className="text-white/70 text-sm">{w.special}</p>
            {w.armorBonus > 0 && <div className="text-blue-400 text-sm mt-2">+{w.armorBonus} Armor</div>}
            {w.apBonus > 0 && <div className="text-yellow-400 text-sm mt-1">+{w.apBonus} Action Point</div>}
          </FantasyCard>
        ))}
      </div>
    </div>
  );
}
