'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCharacter, getLevelUps, getModifiers, type DbCharacter, type DbLevelUp, type DbCustomModifier } from '@/lib/supabase';
import { findRace, findClass, findSubclass, findArmor, findWeapon, computeFullStats, getDamageBonusFromLevels, getUnlockedSkills } from '@/lib/stats';
import { LEVEL_BONUS_OPTIONS, findSkill } from '@/lib/game-data';

export default function PrintPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [character, setCharacter] = useState<DbCharacter | null>(null);
  const [levelUps, setLevelUps] = useState<DbLevelUp[]>([]);
  const [modifiers, setModifiers] = useState<DbCustomModifier[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (!loading && character) {
      const timeout = setTimeout(() => window.print(), 600);
      return () => clearTimeout(timeout);
    }
  }, [loading, character]);

  if (loading || !character) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-6xl animate-pulse">📜</div>
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
  const printableSkills = unlockedSkills.filter(us => us.skill.category !== 'stat');
  const activeModifiers = modifiers.filter(m => m.is_active);

  const abilities: { name: string; desc: string }[] = [];
  if (race) abilities.push({ name: race.trait, desc: race.traitDesc });
  if (subclass) abilities.push({ name: subclass.ability, desc: subclass.abilityDesc });
  if (subclass?.extra) abilities.push({ name: 'Bonus', desc: subclass.extra });

  const healthBoxes = stats ? Math.min(stats.health, 30) : 0;
  const apBoxes = stats ? Math.min(stats.ap, 10) : 0;

  // Shared styles for compact sections
  const sectionStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.3)', borderRadius: '6px', padding: '5px 10px', marginBottom: '5px', border: '1px solid #c4a46a' };
  const sectionTitle: React.CSSProperties = { fontFamily: "'Cinzel', serif", fontSize: '8pt', fontWeight: 700, color: '#7a6a5a', marginBottom: '2px', letterSpacing: '0.5px' };
  const bodyText: React.CSSProperties = { fontSize: '9pt', marginBottom: '1px' };

  return (
    <div>
      {/* Close button for screen */}
      <div className="no-print fixed top-4 right-4 z-50">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl bg-gold text-dark-bg font-[family-name:var(--font-cinzel)] font-bold text-lg hover:bg-gold-dark transition-all shadow-lg"
        >
          Back to Character
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="print-sheet parchment-bg mx-auto my-8 rounded-lg shadow-2xl" style={{ maxWidth: '7.5in', fontFamily: "'Inter', sans-serif" }}>
        {/* Header — compact */}
        <div style={{ borderBottom: '3px double #8B6914', paddingBottom: '6px', marginBottom: '6px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '22pt', fontWeight: 900, color: '#2c1810', margin: 0, letterSpacing: '2px' }}>
            {character.char_name}
          </h1>
          <p style={{ fontFamily: "'MedievalSharp', cursive", fontSize: '12pt', color: '#5a3e28', margin: '2px 0 0 0' }}>
            {race?.name} {cls?.name} &mdash; {subclass?.name}
          </p>
          <p style={{ fontSize: '8pt', color: '#7a6a5a', margin: '1px 0 0 0' }}>
            Age: {character.char_age} &nbsp;|&nbsp; Gender: {character.char_gender} &nbsp;|&nbsp; Level {character.level} &nbsp;|&nbsp; Played by {character.player_name}
          </p>
        </div>

        {/* Stats row — compact */}
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '4px 0', borderBottom: '2px solid #c4a46a', marginBottom: '6px' }}>
          <PrintStat icon="❤️" label="HEALTH" value={stats?.health} />
          <PrintStat icon="🛡️" label="ARMOR" value={stats?.armor} />
          <PrintStat icon="👢" label="MOVES/TURN" value={stats?.moves} />
          <PrintStat icon="⭐" label="ACTION PTS" value={stats?.ap} />
        </div>

        {/* Weapon + Armor side by side */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
          <div style={{ ...sectionStyle, flex: 1, marginBottom: 0 }}>
            <div style={sectionTitle}>WEAPON</div>
            <div style={{ fontSize: '11pt', fontWeight: 700 }}>{weapon?.name}</div>
            <div style={bodyText}>DMG: {weapon?.damage}{damageBonus > 0 ? ` + ${damageBonus}` : ''} &nbsp;|&nbsp; {weapon?.special}</div>
          </div>
          <div style={{ ...sectionStyle, flex: 1, marginBottom: 0 }}>
            <div style={sectionTitle}>ARMOR</div>
            <div style={{ fontSize: '11pt', fontWeight: 700 }}>{armor?.name}</div>
            <div style={bodyText}>{armor?.flavor}</div>
          </div>
        </div>

        {/* Race Trait + Abilities merged */}
        <div style={sectionStyle}>
          <div style={sectionTitle}>ABILITIES & TRAITS</div>
          <div style={bodyText}>
            <b>{race?.trait}</b> <span style={{ color: '#7a6a5a', fontSize: '8pt' }}>(Race)</span> &mdash; {race?.traitDesc}
          </div>
          {abilities.filter(a => a.name !== race?.trait).map((a, i) => (
            <div key={i} style={bodyText}>
              <b>{a.name}</b> &mdash; {a.desc}
            </div>
          ))}
        </div>

        {/* Unlocked Skills */}
        {printableSkills.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px 12px', marginBottom: '8px', border: '1px solid #c4a46a' }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '9pt', fontWeight: 700, color: '#7a6a5a', marginBottom: '4px' }}>UNLOCKED SKILLS</div>
            {printableSkills.map(us => (
              <div key={us.skill.id} style={{ fontSize: '10pt', marginBottom: '2px' }}>
                &bull; {us.skill.icon} <b>{us.skill.name}</b>
                <span style={{ color: '#7a6a5a', fontSize: '9pt' }}> (Lv {us.level})</span>
                {' '}&mdash; {us.skill.description}
              </div>
            ))}
          </div>
        )}

        {/* Spells (if Mage) */}
        {subclass?.spells && (
          <div style={sectionStyle}>
            <div style={sectionTitle}>SPELLS</div>
            {subclass.spells.map((sp, i) => (
              <div key={i} style={bodyText}>
                <b>{sp.name}</b> ({sp.cost}) &mdash; {sp.effect}
              </div>
            ))}
          </div>
        )}

        {/* Level-Up History + Modifiers side by side when both exist */}
        {(levelUps.length > 0 || activeModifiers.length > 0) && (
          <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
            {/* Level-Up History */}
            {levelUps.length > 0 && (
              <div style={{ ...sectionStyle, flex: 1, marginBottom: 0 }}>
                <div style={sectionTitle}>LEVEL-UP HISTORY</div>
                {levelUps.map(lu => {
                  const isSwap = lu.bonus_type === 'swap_weapon';
                  if (isSwap) {
                    return (
                      <div key={lu.id} style={{ fontSize: '8pt', marginBottom: '1px' }}>
                        Lv{lu.level}: 🔄 Weapon Swap
                      </div>
                    );
                  }
                  const legacy = LEVEL_BONUS_OPTIONS.find(b => b.id === lu.bonus_type);
                  if (legacy) {
                    return (
                      <div key={lu.id} style={{ fontSize: '8pt', marginBottom: '1px' }}>
                        Lv{lu.level}: {legacy.icon} {legacy.name}
                      </div>
                    );
                  }
                  const skill = findSkill(lu.bonus_type);
                  return (
                    <div key={lu.id} style={{ fontSize: '8pt', marginBottom: '1px' }}>
                      Lv{lu.level}: {skill?.icon ?? '?'} {skill?.name ?? lu.bonus_type}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Active Custom Modifiers */}
            {activeModifiers.length > 0 && (
              <div style={{ ...sectionStyle, flex: 1, marginBottom: 0 }}>
                <div style={sectionTitle}>ACTIVE MODIFIERS</div>
                {activeModifiers.map(mod => {
                  const effects: string[] = [];
                  if (mod.health_mod !== 0) effects.push(`${mod.health_mod > 0 ? '+' : ''}${mod.health_mod} HP`);
                  if (mod.armor_mod !== 0) effects.push(`${mod.armor_mod > 0 ? '+' : ''}${mod.armor_mod} Armor`);
                  if (mod.move_mod !== 0) effects.push(`${mod.move_mod > 0 ? '+' : ''}${mod.move_mod} Move`);
                  if (mod.ap_mod !== 0) effects.push(`${mod.ap_mod > 0 ? '+' : ''}${mod.ap_mod} AP`);
                  return (
                    <div key={mod.id} style={{ fontSize: '8pt', marginBottom: '1px' }}>
                      <b>{mod.name}</b> ({effects.join(', ')})
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Combat Tracker */}
        <div style={sectionStyle}>
          <div style={sectionTitle}>COMBAT TRACKER</div>
          <div style={{ fontSize: '9pt', marginBottom: '2px' }}>
            <b>Health:</b> {Array.from({ length: healthBoxes }, () => '□').join(' ')}
          </div>
          <div style={{ fontSize: '9pt' }}>
            <b>Action Points:</b> {Array.from({ length: apBoxes }, () => '□').join(' ')}
          </div>
        </div>

        {/* Notes */}
        <div style={sectionStyle}>
          <div style={sectionTitle}>NOTES</div>
          <div style={{ borderBottom: '1px solid #c4a46a', height: '16px', marginBottom: '3px' }}></div>
          <div style={{ borderBottom: '1px solid #c4a46a', height: '16px', marginBottom: '3px' }}></div>
          <div style={{ borderBottom: '1px solid #c4a46a', height: '16px' }}></div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '4px', fontSize: '7pt', color: '#a0907a', fontFamily: "'MedievalSharp', cursive" }}>
          D&D Character Creator &mdash; May your adventures be legendary!
        </div>
      </div>
    </div>
  );
}

function PrintStat({ icon, label, value }: { icon: string; label: string; value: number | undefined }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14pt' }}>{icon}</div>
      <div style={{ fontSize: '18pt', fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: '7pt', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#7a6a5a', letterSpacing: '1px' }}>{label}</div>
    </div>
  );
}
