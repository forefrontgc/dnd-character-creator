'use client';

import { CLASSES, ARMOR_TYPES } from '@/lib/game-data';

interface StepArmorProps {
  selected: string;
  onSelect: (id: string) => void;
  classId: string;
}

export function StepArmor({ selected, onSelect, classId }: StepArmorProps) {
  const cls = CLASSES.find(c => c.id === classId);
  const allowed = cls?.armorAccess || [];

  return (
    <div>
      <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl text-gold font-bold mb-2">Choose Your Armor</h2>
      <p className="text-parchment/70 mb-8 text-lg">Protection or speed? The choice is yours!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {ARMOR_TYPES.map(a => {
          const available = allowed.includes(a.id);
          return (
            <div key={a.id} className="relative">
              <button
                onClick={() => { if (available) onSelect(a.id); }}
                disabled={!available}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all
                  ${!available ? 'card-disabled' :
                    selected === a.id ? 'card-selected bg-dark-border/80 cursor-pointer' :
                    'bg-dark-card border-gold/20 hover:border-gold/50 cursor-pointer card-glow'}`}
              >
                <div className="text-4xl mb-3">{a.icon}</div>
                <h3 className="font-[family-name:var(--font-cinzel)] text-xl text-gold font-bold mb-2">{a.name}</h3>
                <p className="text-parchment/70 text-sm mb-4 italic">{a.flavor}</p>
                <div className="space-y-1 text-sm">
                  <div className="text-blue-400">+{a.value} Armor</div>
                  {a.movePenalty !== 0 && <div className="text-orange-400">{a.movePenalty} Move per turn</div>}
                  {a.moveBonus > 0 && <div className="text-green-400">+{a.moveBonus} Move per turn</div>}
                </div>
              </button>
              {!available && (
                <div className="absolute inset-0 flex items-end justify-center p-4 pointer-events-none">
                  <div className="bg-dark-bg/90 text-orange-400 text-xs font-semibold px-3 py-2 rounded-lg text-center">
                    {classId === 'mage' ? "Mages can only wear Light Armor — magic doesn't work well in heavy steel!" :
                     classId === 'archer' ? "Archers can't wear Heavy Armor — too bulky for precise shots!" :
                     a.restriction}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
