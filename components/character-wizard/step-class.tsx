'use client';

import { CLASSES } from '@/lib/game-data';
import { FantasyCard } from '@/components/ui/fantasy-card';

interface StepClassProps {
  selectedClass: string;
  selectedSubclass: string;
  onSelectClass: (id: string) => void;
  onSelectSubclass: (id: string) => void;
}

export function StepClass({ selectedClass, selectedSubclass, onSelectClass, onSelectSubclass }: StepClassProps) {
  const cls = CLASSES.find(c => c.id === selectedClass);

  return (
    <div>
      <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl text-gold font-bold mb-2">Choose Your Class</h2>
      <p className="text-parchment/70 mb-8 text-lg">Your class defines how you fight. Choose wisely!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {CLASSES.map(c => (
          <FantasyCard key={c.id} selected={selectedClass === c.id} onClick={() => onSelectClass(c.id)}>
            <div className="text-4xl mb-3">{c.icon}</div>
            <h3 className="font-[family-name:var(--font-cinzel)] text-xl text-gold font-bold mb-2">{c.name}</h3>
            <p className="text-parchment/70 text-sm mb-4 italic">{c.flavor}</p>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-red-400">❤️ {c.baseHealth} HP</span>
              <span className="text-yellow-400">⭐ {c.baseAP} AP</span>
              <span className="text-green-400">👢 {c.baseMoves} Moves</span>
            </div>
          </FantasyCard>
        ))}
      </div>

      {cls && (
        <div className="fade-in">
          <h3 className="font-[family-name:var(--font-cinzel)] text-xl text-gold font-bold mb-2 mt-6">Choose Your Specialization</h3>
          <p className="text-parchment/70 mb-6 text-base">How will your {cls.name} fight?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {cls.subclasses.map(sc => (
              <FantasyCard key={sc.id} selected={selectedSubclass === sc.id} onClick={() => onSelectSubclass(sc.id)}>
                <div className="text-3xl mb-2">{sc.icon}</div>
                <h4 className="font-[family-name:var(--font-cinzel)] text-lg text-gold font-bold mb-1">{sc.name}</h4>
                <p className="text-parchment/70 text-sm mb-3 italic">{sc.flavor}</p>
                <div className="space-y-1 text-sm mb-3">
                  {sc.healthBonus > 0 && <div className="text-red-400">+{sc.healthBonus} Health</div>}
                  {sc.armorBonus > 0 && <div className="text-blue-400">+{sc.armorBonus} Armor</div>}
                  {sc.moveBonus > 0 && <div className="text-green-400">+{sc.moveBonus} Move</div>}
                  {sc.moveBonus < 0 && <div className="text-orange-400">{sc.moveBonus} Move</div>}
                  {sc.armorPenalty && <div className="text-orange-400">{sc.armorPenalty} Armor</div>}
                  {sc.extra && <div className="text-purple-400">{sc.extra}</div>}
                </div>
                <div className="pt-3 border-t border-gold/20">
                  <div className="text-gold font-semibold text-sm">{sc.ability}</div>
                  <div className="text-white/60 text-xs mt-1">{sc.abilityDesc}</div>
                </div>
                {sc.spells && (
                  <div className="mt-3 pt-3 border-t border-gold/20 space-y-2">
                    <div className="text-mana font-semibold text-sm">Spells:</div>
                    {sc.spells.map(sp => (
                      <div key={sp.name} className="text-xs">
                        <span className="text-gold">{sp.name}</span>
                        <span className="text-white/40"> ({sp.cost})</span>
                        <span className="text-white/60"> — {sp.effect}</span>
                      </div>
                    ))}
                  </div>
                )}
              </FantasyCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
