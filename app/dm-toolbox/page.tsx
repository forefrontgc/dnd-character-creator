'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FantasyButton } from '@/components/ui/fantasy-button';
import { FantasyInput } from '@/components/ui/fantasy-input';

interface Enemy {
  id: string;
  name: string;
  icon: string;
  maxHp: number;
  currentHp: number;
  damage: number;
}

const ICON_OPTIONS = ['💀', '🧟', '👻', '🐺', '🕷️', '🐉', '🧙', '🦇', '👹', '🐗', '🗡️', '🔥'];

const PRESETS: { tier: string; color: string; enemies: Omit<Enemy, 'id' | 'currentHp'>[] }[] = [
  {
    tier: 'Easy',
    color: 'nature',
    enemies: [
      { name: 'Skeleton', icon: '💀', maxHp: 8, damage: 3 },
      { name: 'Zombie Dog', icon: '🐺', maxHp: 6, damage: 2 },
      { name: 'Goblin', icon: '👹', maxHp: 7, damage: 2 },
      { name: 'Bat Swarm', icon: '🦇', maxHp: 5, damage: 2 },
      { name: 'Wolf', icon: '🐺', maxHp: 6, damage: 3 },
    ],
  },
  {
    tier: 'Medium',
    color: 'gold',
    enemies: [
      { name: 'Zombie', icon: '🧟', maxHp: 12, damage: 4 },
      { name: 'Ghost', icon: '👻', maxHp: 10, damage: 4 },
      { name: 'Orc', icon: '👹', maxHp: 15, damage: 5 },
      { name: 'Giant Spider', icon: '🕷️', maxHp: 10, damage: 3 },
      { name: 'Skeleton Knight', icon: '💀', maxHp: 14, damage: 5 },
      { name: 'Bandit', icon: '🗡️', maxHp: 12, damage: 4 },
    ],
  },
  {
    tier: 'Hard',
    color: 'blood',
    enemies: [
      { name: 'Necromancer', icon: '🧙', maxHp: 20, damage: 6 },
      { name: 'Dragon', icon: '🐉', maxHp: 25, damage: 7 },
      { name: 'Death Knight', icon: '💀', maxHp: 22, damage: 6 },
      { name: 'Zombie Horde', icon: '🧟', maxHp: 30, damage: 8 },
      { name: 'Dark Mage', icon: '🔥', maxHp: 18, damage: 7 },
    ],
  },
];

const TIER_STYLES: Record<string, string> = {
  nature: 'border-nature/50 hover:border-nature text-nature',
  gold: 'border-gold/50 hover:border-gold text-gold',
  blood: 'border-blood/50 hover:border-blood text-blood',
};

const TIER_LABEL_STYLES: Record<string, string> = {
  nature: 'text-nature',
  gold: 'text-gold',
  blood: 'text-blood',
};

export default function DMToolboxPage() {
  const router = useRouter();
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [customDmg, setCustomDmg] = useState<Record<string, string>>({});

  // Custom form
  const [customName, setCustomName] = useState('');
  const [customHp, setCustomHp] = useState('');
  const [customDamage, setCustomDamage] = useState('');
  const [customIcon, setCustomIcon] = useState('💀');

  function addEnemy(preset: Omit<Enemy, 'id' | 'currentHp'>) {
    setEnemies(prev => [...prev, {
      ...preset,
      id: crypto.randomUUID(),
      currentHp: preset.maxHp,
    }]);
  }

  function addCustom() {
    const hp = parseInt(customHp);
    const dmg = parseInt(customDamage);
    if (!customName.trim() || isNaN(hp) || hp < 1 || isNaN(dmg) || dmg < 0) return;
    addEnemy({ name: customName.trim(), icon: customIcon, maxHp: hp, damage: dmg });
    setCustomName('');
    setCustomHp('');
    setCustomDamage('');
  }

  function applyDamage(id: string, amount: number) {
    setEnemies(prev => prev.map(e =>
      e.id === id ? { ...e, currentHp: Math.max(0, e.currentHp - amount) } : e
    ));
  }

  function applyHeal(id: string, amount: number | 'full') {
    setEnemies(prev => prev.map(e =>
      e.id === id
        ? { ...e, currentHp: amount === 'full' ? e.maxHp : Math.min(e.maxHp, e.currentHp + amount) }
        : e
    ));
  }

  function duplicateEnemy(enemy: Enemy) {
    setEnemies(prev => [...prev, { ...enemy, id: crypto.randomUUID(), currentHp: enemy.maxHp }]);
  }

  function removeEnemy(id: string) {
    setEnemies(prev => prev.filter(e => e.id !== id));
  }

  function clearRoom() {
    setEnemies([]);
    setShowClearConfirm(false);
  }

  const aliveCount = enemies.filter(e => e.currentHp > 0).length;

  return (
    <div className="min-h-screen bg-dark-bg text-white font-[family-name:var(--font-body)] flex flex-col">
      {/* Header */}
      <div className="bg-dark-card border-b-2 border-gold/30 p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <h1 className="font-[family-name:var(--font-cinzel)] text-2xl text-gold font-bold">DM Toolbox</h1>
          {enemies.length > 0 && (
            <span className="text-white/50 text-sm">
              {aliveCount} alive / {enemies.length} total
            </span>
          )}
        </div>
        <div className="flex gap-3">
          {enemies.length > 0 && (
            showClearConfirm ? (
              <div className="flex gap-2 items-center">
                <span className="text-blood text-sm font-bold">Clear all enemies?</span>
                <FantasyButton size="sm" variant="outline" onClick={clearRoom} className="!border-blood !text-blood hover:!bg-blood/10">
                  Yes, Clear
                </FantasyButton>
                <FantasyButton size="sm" variant="outline" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </FantasyButton>
              </div>
            ) : (
              <FantasyButton size="sm" variant="outline" onClick={() => setShowClearConfirm(true)} className="!border-blood/50 !text-blood/70 hover:!border-blood hover:!text-blood">
                Clear Room
              </FantasyButton>
            )
          )}
          <FantasyButton size="sm" variant="secondary" onClick={() => router.back()}>
            Back
          </FantasyButton>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Enemy Presets */}
          <section>
            <h2 className="font-[family-name:var(--font-cinzel)] text-lg text-gold font-bold mb-3">Quick Add Enemies</h2>
            <div className="space-y-4">
              {PRESETS.map(tier => (
                <div key={tier.tier}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${TIER_LABEL_STYLES[tier.color]}`}>
                    {tier.tier}
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tier.enemies.map(enemy => (
                      <button
                        key={enemy.name}
                        onClick={() => addEnemy(enemy)}
                        className={`px-3 py-2 rounded-xl border-2 bg-dark-card text-sm font-bold transition-all ${TIER_STYLES[tier.color]}`}
                      >
                        {enemy.icon} {enemy.name}
                        <span className="ml-1 opacity-60 text-xs">({enemy.maxHp}hp)</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Custom Enemy Form */}
          <section className="bg-dark-card/50 rounded-2xl border-2 border-gold/20 p-4">
            <h2 className="font-[family-name:var(--font-cinzel)] text-lg text-gold font-bold mb-3">Custom Enemy</h2>
            <div className="flex flex-wrap gap-3 items-end">
              <FantasyInput label="Name" value={customName} onChange={setCustomName} placeholder="Enemy name" className="flex-1 min-w-[140px]" />
              <FantasyInput label="Max HP" value={customHp} onChange={setCustomHp} placeholder="HP" type="number" min={1} max={999} className="w-24" />
              <FantasyInput label="Damage" value={customDamage} onChange={setCustomDamage} placeholder="Dmg" type="number" min={0} max={99} className="w-24" />
              <div>
                <label className="block font-[family-name:var(--font-cinzel)] text-gold text-sm font-bold mb-2">Icon</label>
                <div className="flex gap-1">
                  {ICON_OPTIONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setCustomIcon(icon)}
                      className={`w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-all ${
                        customIcon === icon
                          ? 'bg-gold/20 border-2 border-gold scale-110'
                          : 'bg-dark-card border-2 border-gold/20 hover:border-gold/50'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <FantasyButton onClick={addCustom} disabled={!customName.trim() || !customHp || !customDamage}>
                + Add
              </FantasyButton>
            </div>
          </section>

          {/* Enemy Cards */}
          {enemies.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 opacity-30">💀</div>
              <p className="text-white/30 font-[family-name:var(--font-medieval)] text-xl">No enemies yet — add some above!</p>
            </div>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {enemies.map(enemy => {
                const hpPct = enemy.maxHp > 0 ? (enemy.currentHp / enemy.maxHp) * 100 : 0;
                const defeated = enemy.currentHp <= 0;
                const barColor = hpPct > 50 ? 'bg-nature' : hpPct > 25 ? 'bg-gold' : 'bg-blood';

                return (
                  <div
                    key={enemy.id}
                    className={`relative rounded-2xl border-2 p-4 transition-all slide-in ${
                      defeated
                        ? 'border-white/10 bg-dark-card/30 opacity-60'
                        : 'border-gold/20 bg-dark-card'
                    }`}
                  >
                    {/* Defeated overlay */}
                    {defeated && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 rounded-2xl bg-dark-bg/50">
                        <span className="font-[family-name:var(--font-cinzel)] text-2xl text-blood font-bold tracking-widest">
                          💀 DEFEATED
                        </span>
                      </div>
                    )}

                    {/* Header row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{enemy.icon}</span>
                        <span className="font-[family-name:var(--font-cinzel)] text-gold font-bold">{enemy.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => duplicateEnemy(enemy)}
                          className="w-8 h-8 rounded-lg bg-dark-border/50 text-white/50 hover:text-gold hover:bg-gold/10 transition-all text-sm"
                          title="Duplicate"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => removeEnemy(enemy.id)}
                          className="w-8 h-8 rounded-lg bg-dark-border/50 text-white/50 hover:text-blood hover:bg-blood/10 transition-all text-sm font-bold"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* HP bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/70">HP</span>
                        <span className={`font-bold ${defeated ? 'text-blood' : 'text-white'}`}>
                          {enemy.currentHp} / {enemy.maxHp}
                        </span>
                      </div>
                      <div className="h-4 rounded-full bg-dark-bg overflow-hidden border border-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                          style={{ width: `${hpPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Damage reference */}
                    <p className="text-xs text-white/40 mb-3">
                      Deals <span className="text-blood font-bold">{enemy.damage}</span> damage per hit
                    </p>

                    {/* Damage buttons */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <button onClick={() => applyDamage(enemy.id, 1)} className="px-3 py-1.5 rounded-lg bg-blood/20 text-blood border border-blood/30 text-sm font-bold hover:bg-blood/30 transition-all">-1</button>
                      <button onClick={() => applyDamage(enemy.id, 3)} className="px-3 py-1.5 rounded-lg bg-blood/20 text-blood border border-blood/30 text-sm font-bold hover:bg-blood/30 transition-all">-3</button>
                      <button onClick={() => applyDamage(enemy.id, 5)} className="px-3 py-1.5 rounded-lg bg-blood/20 text-blood border border-blood/30 text-sm font-bold hover:bg-blood/30 transition-all">-5</button>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={1}
                          max={999}
                          placeholder="#"
                          value={customDmg[enemy.id] || ''}
                          onChange={e => setCustomDmg(prev => ({ ...prev, [enemy.id]: e.target.value }))}
                          className="w-12 px-2 py-1.5 rounded-lg bg-dark-bg border border-blood/30 text-white text-sm text-center focus:border-blood focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            const val = parseInt(customDmg[enemy.id]);
                            if (!isNaN(val) && val > 0) {
                              applyDamage(enemy.id, val);
                              setCustomDmg(prev => ({ ...prev, [enemy.id]: '' }));
                            }
                          }}
                          className="px-2 py-1.5 rounded-lg bg-blood/20 text-blood border border-blood/30 text-sm font-bold hover:bg-blood/30 transition-all"
                        >
                          Hit
                        </button>
                      </div>
                    </div>

                    {/* Heal buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      <button onClick={() => applyHeal(enemy.id, 1)} className="px-3 py-1.5 rounded-lg bg-nature/20 text-nature border border-nature/30 text-sm font-bold hover:bg-nature/30 transition-all">+1</button>
                      <button onClick={() => applyHeal(enemy.id, 3)} className="px-3 py-1.5 rounded-lg bg-nature/20 text-nature border border-nature/30 text-sm font-bold hover:bg-nature/30 transition-all">+3</button>
                      <button onClick={() => applyHeal(enemy.id, 'full')} className="px-3 py-1.5 rounded-lg bg-nature/20 text-nature border border-nature/30 text-sm font-bold hover:bg-nature/30 transition-all">Full</button>
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
