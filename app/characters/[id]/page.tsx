'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCharacter, getLevelUps, getModifiers, addLevelUp, addModifier, toggleModifier, deleteModifier, type DbCharacter, type DbLevelUp, type DbCustomModifier } from '@/lib/supabase';
import { findRace, findClass, findSubclass, findArmor, findWeapon, computeFullStats, getDamageBonusFromLevels, getUnlockedSkills } from '@/lib/stats';
import { LEVEL_BONUS_OPTIONS, MAX_LEVEL, findSkill } from '@/lib/game-data';
import { StatBox } from '@/components/stat-box';
import { LevelUpModal } from '@/components/level-up-modal';
import { ModifierForm } from '@/components/modifier-form';

export default function CharacterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [character, setCharacter] = useState<DbCharacter | null>(null);
  const [levelUps, setLevelUps] = useState<DbLevelUp[]>([]);
  const [modifiers, setModifiers] = useState<DbCustomModifier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showModifierForm, setShowModifierForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [char, lus, mods] = await Promise.all([
        getCharacter(id),
        getLevelUps(id),
        getModifiers(id),
      ]);
      setCharacter(char);
      setLevelUps(lus);
      setModifiers(mods);
    } catch (err) {
      console.error('Failed to load character:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-6xl animate-pulse">📜</div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">💀</div>
          <p className="text-xl">Character not found</p>
          <button onClick={() => router.push('/')} className="mt-4 text-gold hover:underline">Back to Home</button>
        </div>
      </div>
    );
  }

  const race = findRace(character.race_id);
  const cls = findClass(character.class_id);
  const subclass = findSubclass(character.class_id, character.subclass_id);
  const armor = findArmor(character.armor_id);
  const weapon = findWeapon(character.class_id, character.weapon_id);
  const stats = computeFullStats(cls, race, subclass, armor, weapon, levelUps, modifiers);
  const damageBonus = getDamageBonusFromLevels(levelUps);
  const unlockedSkills = getUnlockedSkills(levelUps);

  const abilities: { name: string; desc: string; source: string }[] = [];
  if (race) abilities.push({ name: race.trait, desc: race.traitDesc, source: 'Race' });
  if (subclass) abilities.push({ name: subclass.ability, desc: subclass.abilityDesc, source: 'Subclass' });
  if (subclass?.extra) abilities.push({ name: 'Bonus', desc: subclass.extra, source: 'Subclass' });
  if (weapon?.special) abilities.push({ name: weapon.name, desc: weapon.special, source: 'Weapon' });

  const handleLevelUp = async (bonusType: string) => {
    setSaving(true);
    try {
      const newLevel = character.level + 1;
      await addLevelUp(character.id, newLevel, bonusType);
      setShowLevelUp(false);
      await loadData();
    } catch (err) {
      console.error('Failed to level up:', err);
      alert('Failed to level up. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddModifier = async (mod: { name: string; description: string; health_mod: number; armor_mod: number; move_mod: number; ap_mod: number }) => {
    setSaving(true);
    try {
      await addModifier({
        character_id: character.id,
        name: mod.name,
        description: mod.description || null,
        health_mod: mod.health_mod,
        armor_mod: mod.armor_mod,
        move_mod: mod.move_mod,
        ap_mod: mod.ap_mod,
        is_active: true,
      });
      setShowModifierForm(false);
      await loadData();
    } catch (err) {
      console.error('Failed to add modifier:', err);
      alert('Failed to add modifier. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleModifier = async (modId: string, isActive: boolean) => {
    try {
      await toggleModifier(modId, !isActive);
      await loadData();
    } catch (err) {
      console.error('Failed to toggle modifier:', err);
    }
  };

  const handleDeleteModifier = async (modId: string) => {
    try {
      await deleteModifier(modId);
      await loadData();
    } catch (err) {
      console.error('Failed to delete modifier:', err);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-[family-name:var(--font-body)]">
      {/* Header */}
      <header className="bg-gradient-to-r from-dark-card via-dark-bg to-dark-card border-b-2 border-gold/30 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="text-gold/60 hover:text-gold transition-colors font-[family-name:var(--font-cinzel)] font-bold">
            ← Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/print/${character.id}`)}
              className="px-4 py-2 rounded-xl bg-gold text-dark-bg font-[family-name:var(--font-cinzel)] font-bold text-sm hover:bg-gold-dark transition-all"
            >
              Print Sheet
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Character Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">{cls?.icon}</div>
            <h1 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl text-gold font-bold">{character.char_name}</h1>
            <p className="font-[family-name:var(--font-medieval)] text-parchment/70 text-lg mt-1">
              {race?.name} {cls?.name} — {subclass?.name}
            </p>
            <p className="text-white/40 text-sm mt-1">Age: {character.char_age} | Gender: {character.char_gender}</p>
            <p className="text-white/30 text-sm">Played by {character.player_name}</p>
            <div className="mt-3">
              <span className="bg-gold/20 text-gold px-4 py-1 rounded-full font-bold text-lg">Level {character.level}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatBox icon="❤️" label="Health" value={stats?.health} color="text-red-400" variant="dark" />
            <StatBox icon="🛡️" label="Armor" value={stats?.armor} color="text-blue-400" variant="dark" />
            <StatBox icon="👢" label="Moves/Turn" value={stats?.moves} color="text-green-400" variant="dark" />
            <StatBox icon="⭐" label="Action Pts" value={stats?.ap} color="text-yellow-400" variant="dark" />
          </div>

          {/* Weapon & Armor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-dark-card rounded-xl p-4 border border-gold/20">
              <h3 className="font-[family-name:var(--font-cinzel)] text-sm text-gold/60 font-bold mb-1">WEAPON</h3>
              <div className="text-gold font-bold text-lg">{weapon?.name}</div>
              <div className="text-white/60 text-sm">Damage: {weapon?.damage}{damageBonus > 0 ? ` + ${damageBonus}` : ''} | {weapon?.special}</div>
            </div>
            <div className="bg-dark-card rounded-xl p-4 border border-gold/20">
              <h3 className="font-[family-name:var(--font-cinzel)] text-sm text-gold/60 font-bold mb-1">ARMOR</h3>
              <div className="text-gold font-bold text-lg">{armor?.name}</div>
              <div className="text-white/60 text-sm">{armor?.flavor}</div>
            </div>
          </div>

          {/* Abilities */}
          <div className="bg-dark-card rounded-xl p-4 border border-gold/20 mb-8">
            <h3 className="font-[family-name:var(--font-cinzel)] text-sm text-gold/60 font-bold mb-3">ABILITIES & TRAITS</h3>
            <div className="space-y-2">
              {abilities.map((a, i) => (
                <div key={i} className="text-sm">
                  <span className="text-gold font-bold">{a.name}</span>
                  <span className="text-white/30 text-xs ml-1">({a.source})</span>
                  <span className="text-white/60"> — {a.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spells (Mage) */}
          {subclass?.spells && (
            <div className="bg-dark-card rounded-xl p-4 border border-gold/20 mb-8">
              <h3 className="font-[family-name:var(--font-cinzel)] text-sm text-mana font-bold mb-3">SPELLS</h3>
              <div className="space-y-2">
                {subclass.spells.map((sp, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-gold font-bold">{sp.name}</span>
                    <span className="text-white/30"> ({sp.cost})</span>
                    <span className="text-white/60"> — {sp.effect}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unlocked Skills */}
          {unlockedSkills.filter(us => us.skill.category !== 'stat').length > 0 && (
            <div className="bg-dark-card rounded-xl p-4 border border-gold/20 mb-8">
              <h3 className="font-[family-name:var(--font-cinzel)] text-sm text-gold/60 font-bold mb-3">UNLOCKED SKILLS</h3>
              <div className="space-y-2">
                {unlockedSkills.filter(us => us.skill.category === 'ability').map(us => (
                  <div key={us.skill.id} className="text-sm flex items-start gap-2">
                    <span className="text-lg">{us.skill.icon}</span>
                    <div>
                      <span className="text-blue-400 font-bold">{us.skill.name}</span>
                      <span className="text-white/30 text-xs ml-1">(Lv {us.level})</span>
                      <span className="text-white/60"> — {us.skill.description}</span>
                    </div>
                  </div>
                ))}
                {unlockedSkills.filter(us => us.skill.category === 'passive').map(us => (
                  <div key={us.skill.id} className="text-sm flex items-start gap-2">
                    <span className="text-lg">{us.skill.icon}</span>
                    <div>
                      <span className="text-purple-400 font-bold">{us.skill.name}</span>
                      <span className="text-white/30 text-xs ml-1">(Lv {us.level})</span>
                      <span className="bg-purple-500/20 text-purple-400 text-[10px] px-1.5 py-0.5 rounded-full ml-1">Always active</span>
                      <span className="text-white/60"> — {us.skill.description}</span>
                    </div>
                  </div>
                ))}
                {unlockedSkills.filter(us => us.skill.category === 'upgrade').map(us => (
                  <div key={us.skill.id} className="text-sm flex items-start gap-2">
                    <span className="text-lg">{us.skill.icon}</span>
                    <div>
                      <span className="text-orange-400 font-bold">{us.skill.name}</span>
                      <span className="text-white/30 text-xs ml-1">(Lv {us.level})</span>
                      <span className="text-white/60"> — {us.skill.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level Up Section */}
          <div className="bg-dark-card rounded-xl p-4 border border-gold/20 mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-[family-name:var(--font-cinzel)] text-sm text-gold/60 font-bold">LEVEL HISTORY</h3>
              {character.level < MAX_LEVEL && (
                <button
                  onClick={() => setShowLevelUp(true)}
                  className="px-4 py-2 rounded-xl bg-gold text-dark-bg font-[family-name:var(--font-cinzel)] font-bold text-sm hover:bg-gold-dark transition-all glow-pulse"
                >
                  Level Up!
                </button>
              )}
              {character.level >= MAX_LEVEL && (
                <span className="text-gold/50 text-sm font-[family-name:var(--font-cinzel)]">Max Level!</span>
              )}
            </div>
            {levelUps.length === 0 ? (
              <p className="text-white/30 text-sm">Level 1 — No level ups yet</p>
            ) : (
              <div className="space-y-1">
                {levelUps.map(lu => {
                  const legacy = LEVEL_BONUS_OPTIONS.find(b => b.id === lu.bonus_type);
                  if (legacy) {
                    return (
                      <div key={lu.id} className="flex items-center gap-3 text-sm">
                        <span className="text-gold/50 font-bold w-8">Lv {lu.level}</span>
                        <span>{legacy.icon}</span>
                        <span className="text-white/70">{legacy.name}</span>
                        <span className="text-white/40">({legacy.effect})</span>
                      </div>
                    );
                  }
                  const skill = findSkill(lu.bonus_type);
                  return (
                    <div key={lu.id} className="flex items-center gap-3 text-sm">
                      <span className="text-gold/50 font-bold w-8">Lv {lu.level}</span>
                      <span>{skill?.icon ?? '?'}</span>
                      <span className="text-white/70">{skill?.name ?? lu.bonus_type}</span>
                      <span className="text-white/40">({skill?.description ?? 'Unknown'})</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Custom Modifiers */}
          <div className="bg-dark-card rounded-xl p-4 border border-gold/20 mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-[family-name:var(--font-cinzel)] text-sm text-gold/60 font-bold">CUSTOM MODIFIERS</h3>
              <button
                onClick={() => setShowModifierForm(true)}
                className="px-4 py-2 rounded-xl border-2 border-gold/30 text-gold font-[family-name:var(--font-cinzel)] font-bold text-sm hover:bg-gold/10 transition-all"
              >
                + Add Modifier
              </button>
            </div>
            {modifiers.length === 0 ? (
              <p className="text-white/30 text-sm">No custom modifiers yet. Add items, curses, or blessings!</p>
            ) : (
              <div className="space-y-2">
                {modifiers.map(mod => (
                  <div key={mod.id} className={`flex items-center gap-3 p-3 rounded-lg border ${mod.is_active ? 'border-gold/20 bg-dark-bg/50' : 'border-white/10 bg-dark-bg/30 opacity-50'}`}>
                    <button
                      onClick={() => handleToggleModifier(mod.id, mod.is_active)}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${mod.is_active ? 'border-gold bg-gold/20 text-gold' : 'border-white/30'}`}
                    >
                      {mod.is_active && '✓'}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="text-gold font-bold text-sm">{mod.name}</div>
                      {mod.description && <div className="text-white/40 text-xs">{mod.description}</div>}
                      <div className="flex gap-2 text-xs mt-1">
                        {mod.health_mod !== 0 && <span className={mod.health_mod > 0 ? 'text-green-400' : 'text-red-400'}>❤️ {mod.health_mod > 0 ? '+' : ''}{mod.health_mod}</span>}
                        {mod.armor_mod !== 0 && <span className={mod.armor_mod > 0 ? 'text-green-400' : 'text-red-400'}>🛡️ {mod.armor_mod > 0 ? '+' : ''}{mod.armor_mod}</span>}
                        {mod.move_mod !== 0 && <span className={mod.move_mod > 0 ? 'text-green-400' : 'text-red-400'}>👢 {mod.move_mod > 0 ? '+' : ''}{mod.move_mod}</span>}
                        {mod.ap_mod !== 0 && <span className={mod.ap_mod > 0 ? 'text-green-400' : 'text-red-400'}>⭐ {mod.ap_mod > 0 ? '+' : ''}{mod.ap_mod}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteModifier(mod.id)}
                      className="text-red-400/50 hover:text-red-400 transition-colors text-sm px-2"
                      title="Delete modifier"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showLevelUp && (
        <LevelUpModal
          currentLevel={character.level}
          classId={character.class_id}
          subclassId={character.subclass_id}
          onConfirm={handleLevelUp}
          onCancel={() => setShowLevelUp(false)}
          saving={saving}
        />
      )}
      {showModifierForm && (
        <ModifierForm
          onSave={handleAddModifier}
          onCancel={() => setShowModifierForm(false)}
          saving={saving}
        />
      )}
    </div>
  );
}
