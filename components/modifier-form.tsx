'use client';

import { useState } from 'react';

interface ModifierFormProps {
  onSave: (modifier: {
    name: string;
    description: string;
    health_mod: number;
    armor_mod: number;
    move_mod: number;
    ap_mod: number;
  }) => void;
  onCancel: () => void;
  saving?: boolean;
}

export function ModifierForm({ onSave, onCancel, saving }: ModifierFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [healthMod, setHealthMod] = useState(0);
  const [armorMod, setArmorMod] = useState(0);
  const [moveMod, setMoveMod] = useState(0);
  const [apMod, setApMod] = useState(0);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      health_mod: healthMod,
      armor_mod: armorMod,
      move_mod: moveMod,
      ap_mod: apMod,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card border-2 border-gold/50 rounded-2xl p-6 md:p-8 max-w-lg w-full slide-in">
        <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-gold font-bold mb-6 text-center">
          Add Modifier
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block font-[family-name:var(--font-cinzel)] text-gold text-sm font-bold mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Boots of Extra Jumping"
              className="w-full px-4 py-2 rounded-xl bg-dark-bg border-2 border-gold/30 text-white focus:border-gold focus:outline-none transition-all"
              maxLength={60}
            />
          </div>

          <div>
            <label className="block font-[family-name:var(--font-cinzel)] text-gold text-sm font-bold mb-1">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Found in the goblin cave"
              className="w-full px-4 py-2 rounded-xl bg-dark-bg border-2 border-gold/30 text-white focus:border-gold focus:outline-none transition-all"
              maxLength={120}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '❤️ Health', value: healthMod, setter: setHealthMod },
              { label: '🛡️ Armor', value: armorMod, setter: setArmorMod },
              { label: '👢 Move', value: moveMod, setter: setMoveMod },
              { label: '⭐ AP', value: apMod, setter: setApMod },
            ].map(({ label, value, setter }) => (
              <div key={label}>
                <label className="block text-white/70 text-sm mb-1">{label}</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setter(value - 1)}
                    className="w-8 h-8 rounded-lg bg-dark-bg border border-gold/30 text-gold hover:bg-gold/10 transition-all flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className={`w-10 text-center font-bold ${value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-white/50'}`}>
                    {value > 0 ? `+${value}` : value}
                  </span>
                  <button
                    onClick={() => setter(value + 1)}
                    className="w-8 h-8 rounded-lg bg-dark-bg border border-gold/30 text-gold hover:bg-gold/10 transition-all flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gold/30 text-gold/70 hover:bg-gold/10 font-[family-name:var(--font-cinzel)] font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || saving}
            className="flex-1 px-4 py-3 rounded-xl bg-gold text-dark-bg font-[family-name:var(--font-cinzel)] font-bold hover:bg-gold-dark disabled:opacity-30 transition-all"
          >
            {saving ? 'Saving...' : 'Add Modifier'}
          </button>
        </div>
      </div>
    </div>
  );
}
