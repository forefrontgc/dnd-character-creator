'use client';

import { RACES } from '@/lib/game-data';
import { FantasyCard } from '@/components/ui/fantasy-card';

interface StepRaceProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function StepRace({ selected, onSelect }: StepRaceProps) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl text-gold font-bold mb-2">Choose Your Race</h2>
      <p className="text-parchment/70 mb-8 text-lg">Each race has unique strengths. Who will you be?</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {RACES.map(r => (
          <FantasyCard key={r.id} selected={selected === r.id} onClick={() => onSelect(r.id)}>
            <div className="text-4xl mb-3">{r.icon}</div>
            <h3 className="font-[family-name:var(--font-cinzel)] text-xl text-gold font-bold mb-2">{r.name}</h3>
            <p className="text-parchment/70 text-sm mb-4 italic">{r.flavor}</p>
            <div className="space-y-1 text-sm">
              {r.healthMod !== 0 && <div className="text-red-400">+{r.healthMod} Health</div>}
              {r.armorMod !== 0 && <div className="text-blue-400">+{r.armorMod} Armor</div>}
              {r.moveMod !== 0 && <div className="text-green-400">+{r.moveMod} Move</div>}
              {r.apMod !== 0 && <div className="text-yellow-400">+{r.apMod} Action Point</div>}
              {r.healthMod === 0 && r.armorMod === 0 && <div className="text-white/50">Balanced stats</div>}
            </div>
            <div className="mt-3 pt-3 border-t border-gold/20">
              <div className="text-gold font-semibold text-sm">{r.trait}</div>
              <div className="text-white/60 text-xs mt-1">{r.traitDesc}</div>
            </div>
          </FantasyCard>
        ))}
      </div>
    </div>
  );
}
