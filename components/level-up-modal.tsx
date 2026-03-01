'use client';

import { useState } from 'react';
import { LEVEL_BONUS_OPTIONS } from '@/lib/game-data';

interface LevelUpModalProps {
  currentLevel: number;
  onConfirm: (bonusType: string) => void;
  onCancel: () => void;
  saving?: boolean;
}

export function LevelUpModal({ currentLevel, onConfirm, onCancel, saving }: LevelUpModalProps) {
  const [selected, setSelected] = useState('');
  const newLevel = currentLevel + 1;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card border-2 border-gold/50 rounded-2xl p-6 md:p-8 max-w-lg w-full slide-in">
        <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-gold font-bold mb-2 text-center">
          Level Up!
        </h2>
        <p className="text-parchment/70 text-center mb-6">
          Reaching Level {newLevel}! Choose a bonus:
        </p>

        <div className="space-y-3 mb-6">
          {LEVEL_BONUS_OPTIONS.map(opt => (
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
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gold/30 text-gold/70 hover:bg-gold/10 font-[family-name:var(--font-cinzel)] font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (selected) onConfirm(selected); }}
            disabled={!selected || saving}
            className="flex-1 px-4 py-3 rounded-xl bg-gold text-dark-bg font-[family-name:var(--font-cinzel)] font-bold hover:bg-gold-dark disabled:opacity-30 transition-all"
          >
            {saving ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
