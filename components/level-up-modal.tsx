'use client';

import { useState } from 'react';
import { LEVEL_BONUS_OPTIONS, WEAPONS, getSkillChoices } from '@/lib/game-data';
import type { Skill, SkillCategory } from '@/lib/game-data';

interface LevelUpModalProps {
  currentLevel: number;
  classId: string;
  subclassId: string;
  currentWeaponId: string;
  onConfirm: (bonusType: string, newWeaponId?: string) => void;
  onCancel: () => void;
  saving?: boolean;
}

const CATEGORY_STYLE: Record<SkillCategory, { label: string; color: string }> = {
  stat: { label: 'Stat Boost', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  ability: { label: 'New Ability', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  passive: { label: 'Passive', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  upgrade: { label: 'Upgrade', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
};

function StatEffectDisplay({ skill }: { skill: Skill }) {
  if (!skill.statEffect) return null;
  const effects: string[] = [];
  if (skill.statEffect.health) effects.push(`+${skill.statEffect.health} HP`);
  if (skill.statEffect.armor) effects.push(`+${skill.statEffect.armor} Armor`);
  if (skill.statEffect.move) effects.push(`+${skill.statEffect.move} Move`);
  if (skill.statEffect.ap) effects.push(`+${skill.statEffect.ap} AP`);
  if (skill.statEffect.damage) effects.push(`+${skill.statEffect.damage} Damage`);
  if (effects.length === 0) return null;
  return <div className="text-green-400 text-xs mt-1 font-bold">{effects.join(' / ')}</div>;
}

export function LevelUpModal({ currentLevel, classId, subclassId, currentWeaponId, onConfirm, onCancel, saving }: LevelUpModalProps) {
  const [selected, setSelected] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState('');
  const [showWeaponPicker, setShowWeaponPicker] = useState(false);
  const newLevel = currentLevel + 1;

  const skillChoices = getSkillChoices(subclassId, newLevel);
  const useSkillTree = skillChoices.length > 0;

  const weapons = WEAPONS[classId] || [];
  const otherWeapons = weapons.filter(w => w.id !== currentWeaponId);

  const handleConfirm = () => {
    if (!selected) return;
    if (selected === 'swap_weapon') {
      if (!selectedWeapon) return;
      onConfirm('swap_weapon', selectedWeapon);
    } else {
      onConfirm(selected);
    }
  };

  const canConfirm = selected && (selected !== 'swap_weapon' || selectedWeapon);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card border-2 border-gold/50 rounded-2xl p-6 md:p-8 max-w-lg w-full slide-in max-h-[90vh] overflow-y-auto">
        <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-gold font-bold mb-2 text-center">
          Level Up!
        </h2>
        <p className="text-parchment/70 text-center mb-6">
          Reaching Level {newLevel}! Choose {useSkillTree ? 'a new skill' : 'a bonus'}:
        </p>

        {!showWeaponPicker ? (
          <>
            <div className="space-y-3 mb-6">
              {useSkillTree ? (
                skillChoices.map(skill => {
                  const cat = CATEGORY_STYLE[skill.category];
                  return (
                    <button
                      key={skill.id}
                      onClick={() => setSelected(skill.id)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all
                        ${selected === skill.id ? 'card-selected bg-dark-border/80' : 'bg-dark-bg border-gold/20 hover:border-gold/50 cursor-pointer'}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-0.5">{skill.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-[family-name:var(--font-cinzel)] text-gold font-bold">{skill.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${cat.color}`}>{cat.label}</span>
                          </div>
                          <div className="text-white/60 text-sm">{skill.description}</div>
                          <StatEffectDisplay skill={skill} />
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                LEVEL_BONUS_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelected(opt.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4
                      ${selected === opt.id ? 'card-selected bg-dark-border/80' : 'bg-dark-bg border-gold/20 hover:border-gold/50 cursor-pointer'}`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <div className="font-[family-name:var(--font-cinzel)] text-gold font-bold">{opt.name}</div>
                      <div className="text-white/60 text-sm">{opt.effect}</div>
                    </div>
                  </button>
                ))
              )}

              {/* Swap Weapon option */}
              {otherWeapons.length > 0 && (
                <button
                  onClick={() => { setSelected('swap_weapon'); setShowWeaponPicker(true); }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4
                    bg-dark-bg border-gold/20 hover:border-gold/50 cursor-pointer`}
                >
                  <span className="text-2xl">🔄</span>
                  <div>
                    <div className="font-[family-name:var(--font-cinzel)] text-gold font-bold">Swap Weapon</div>
                    <div className="text-white/60 text-sm">Choose a different weapon</div>
                  </div>
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gold/30 text-gold/70 hover:bg-gold/10 font-[family-name:var(--font-cinzel)] font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!canConfirm || saving}
                className="flex-1 px-4 py-3 rounded-xl bg-gold text-dark-bg font-[family-name:var(--font-cinzel)] font-bold hover:bg-gold-dark disabled:opacity-30 transition-all"
              >
                {saving ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </>
        ) : (
          /* Weapon Picker */
          <>
            <p className="text-white/60 text-sm text-center mb-4">Pick your new weapon:</p>
            <div className="space-y-3 mb-6">
              {otherWeapons.map(w => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWeapon(w.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all
                    ${selectedWeapon === w.id ? 'card-selected bg-dark-border/80' : 'bg-dark-bg border-gold/20 hover:border-gold/50 cursor-pointer'}`}
                >
                  <div className="font-[family-name:var(--font-cinzel)] text-gold font-bold">{w.name}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-red-400 font-bold">{w.damage} DMG</span>
                  </div>
                  <div className="text-white/60 text-sm mt-1">{w.special}</div>
                  {w.armorBonus > 0 && <div className="text-blue-400 text-xs mt-1">+{w.armorBonus} Armor</div>}
                  {w.apBonus > 0 && <div className="text-yellow-400 text-xs mt-1">+{w.apBonus} AP</div>}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowWeaponPicker(false); setSelected(''); setSelectedWeapon(''); }}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gold/30 text-gold/70 hover:bg-gold/10 font-[family-name:var(--font-cinzel)] font-bold transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedWeapon || saving}
                className="flex-1 px-4 py-3 rounded-xl bg-gold text-dark-bg font-[family-name:var(--font-cinzel)] font-bold hover:bg-gold-dark disabled:opacity-30 transition-all"
              >
                {saving ? 'Saving...' : 'Swap Weapon'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
