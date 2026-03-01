'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCharacter, getLevelUps, getModifiers, type DbCharacter, type DbLevelUp, type DbCustomModifier } from '@/lib/supabase';
import { findRace, findClass, findSubclass, findArmor, findWeapon, computeFullStats, getDamageBonusFromLevels } from '@/lib/stats';
import { LEVEL_BONUS_OPTIONS } from '@/lib/game-data';

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
  const activeModifiers = modifiers.filter(m => m.is_active);

  const abilities: { name: string; desc: string }[] = [];
  if (race) abilities.push({ name: race.trait, desc: race.traitDesc });
  if (subclass) abilities.push({ name: subclass.ability, desc: subclass.abilityDesc });
  if (subclass?.extra) abilities.push({ name: 'Bonus', desc: subclass.extra });

  const healthBoxes = stats ? Math.min(stats.health, 30) : 0;
  const apBoxes = stats ? Math.min(stats.ap, 10) : 0;

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
        {/* Header */}
        <div style={{ borderBottom: '3px double #8B6914', paddingBottom: '12px', marginBottom: '12px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '28pt', fontWeight: 900, color: '#2c1810', margin: 0, letterSpacing: '2px' }}>
            {character.char_name}
          </h1>
          <p style={{ fontFamily: "'MedievalSharp', cursive", fontSize: '14pt', color: '#5a3e28', margin: '4px 0 0 0' }}>
            {race?.name} {cls?.name} &mdash; {subclass?.name}
          </p>
          <p style={{ fontSize: '10pt', color: '#7a6a5a', margin: '2px 0 0 0' }}>
            Age: {character.char_age} &nbsp;|&nbsp; Gender: {character.char_gender} &nbsp;|&nbsp; Level {character.level}
          </p>
          <p style={{ fontSize: '9pt', color: '#9a8a7a', margin: '2px 0 0 0', fontStyle: 'italic' }}>
            Played by {character.player_name}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0', borderBottom: '2px solid #c4a46a', marginBottom: '10px' }}>
          <PrintStat icon="❤️" label="HEALTH" value={stats?.health} />
          <PrintStat icon="🛡️" label="ARMOR" value={stats?.armor} />
          <PrintStat icon="👢" label="MOVES/TURN" value={stats?.moves} />
          <PrintStat icon="⭐" label="ACTION PTS" value={stats?.ap} />
        </div>

        {/* Weapon */}
        <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px 12px', marginBottom: '8px', border: '1px solid #c4a46a' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: '9pt', fontWeight: 700, color: '#7a6a5a', marginBottom: '2px' }}>WEAPON</div>
          <div style={{ fontSize: '13pt', fontWeight: 700 }}>{weapon?.name}</div>
          <div style={{ fontSize: '10pt' }}>Damage: {weapon?.damage}{damageBonus > 0 ? ` + ${damageBonus}` : ''} &nbsp;|&nbsp; {weapon?.special}</div>
        </div>

        {/* Armor */}
        <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px 12px', marginBottom: '8px', border: '1px solid #c4a46a' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: '9pt', fontWeight: 700, color: '#7a6a5a', marginBottom: '2px' }}>ARMOR</div>
          <div style={{ fontSize: '13pt', fontWeight: 700 }}>{armor?.name}</div>
          <div style={{ fontSize: '10pt' }}>{armor?.flavor}</div>
        </div>

        {/* Race Trait */}
        <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px 12px', marginBottom: '8px', border: '1px solid #c4a46a' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: '9pt', fontWeight: 700, color: '#7a6a5a', marginBottom: '2px' }}>RACE TRAIT</div>
          <div style={{ fontSize: '11pt' }}><b>{race?.trait}</b> &mdash; {race?.traitDesc}</div>
        </div>

        {/* Special Abilities */}
        <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px 12px', marginBottom: '8px', border: '1px solid #c4a46a' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: '9pt', fontWeight: 700, color: '#7a6a5a', marginBottom: '4px' }}>SPECIAL ABILITIES</div>
          {abilities.map((a, i) => (
            <div key={i} style={{ fontSize: '10pt', marginBottom: '2px' }}>
              &bull; <b>{a.name}</b> &mdash; {a.desc}
            </div>
          ))}
        </div>

        {/* Spells (if Mage) */}
        {subclass?.spells && (
          <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px 12px', marginBottom: '8px', border: '1px solid #c4a46a' }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '9pt', fontWeight: 700, color: '#7a6a5a', marginBottom: '4px' }}>SPELLS</div>
            {subclass.spells.map((sp, i) => (
              <div key={i} style={{ fontSize: '10pt', marginBottom: '2px' }}>
                &bull; <b>{sp.name}</b> ({sp.cost}) &mdash; {sp.effect}
              </div>
            ))}
          </div>
        )}

        {/* Level-Up History */}
        {levelUps.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px 12px', marginBottom: '8px', border: '1px solid #c4a46a' }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '9pt', fontWeight: 700, color: '#7a6a5a', marginBottom: '4px' }}>LEVEL-UP HISTORY</div>
            {levelUps.map(lu => {
              const bonus = LEVEL_BONUS_OPTIONS.find(b => b.id === lu.bonus_type);
              return (
                <div key={lu.id} style={{ fontSize: '10pt', marginBottom: '2px' }}>
                  &bull; Level {lu.level}: {bonus?.icon} {bonus?.name} ({bonus?.effect})
                </div>
              );
            })}
          </div>
        )}

        {/* Active Custom Modifiers */}
        {activeModifiers.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px 12px', marginBottom: '8px', border: '1px solid #c4a46a' }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '9pt', fontWeight: 700, color: '#7a6a5a', marginBottom: '4px' }}>ACTIVE MODIFIERS</div>
            {activeModifiers.map(mod => {
              const effects: string[] = [];
              if (mod.health_mod !== 0) effects.push(`${mod.health_mod > 0 ? '+' : ''}${mod.health_mod} HP`);
              if (mod.armor_mod !== 0) effects.push(`${mod.armor_mod > 0 ? '+' : ''}${mod.armor_mod} Armor`);
              if (mod.move_mod !== 0) effects.push(`${mod.move_mod > 0 ? '+' : ''}${mod.move_mod} Move`);
              if (mod.ap_mod !== 0) effects.push(`${mod.ap_mod > 0 ? '+' : ''}${mod.ap_mod} AP`);
              return (
                <div key={mod.id} style={{ fontSize: '10pt', marginBottom: '2px' }}>
                  &bull; <b>{mod.name}</b> ({effects.join(', ')}){mod.description ? ` — ${mod.description}` : ''}
                </div>
              );
            })}
          </div>
        )}

        {/* Combat Tracker */}
        <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px 12px', marginBottom: '8px', border: '1px solid #c4a46a' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: '9pt', fontWeight: 700, color: '#7a6a5a', marginBottom: '6px' }}>COMBAT TRACKER</div>
          <div style={{ fontSize: '10pt', marginBottom: '4px' }}>
            <b>Health:</b> {Array.from({ length: healthBoxes }, () => '□').join(' ')}
          </div>
          <div style={{ fontSize: '10pt' }}>
            <b>Action Points:</b> {Array.from({ length: apBoxes }, () => '□').join(' ')}
          </div>
        </div>

        {/* Notes */}
        <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px 12px', border: '1px solid #c4a46a' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: '9pt', fontWeight: 700, color: '#7a6a5a', marginBottom: '6px' }}>NOTES</div>
          <div style={{ borderBottom: '1px solid #c4a46a', height: '20px', marginBottom: '4px' }}></div>
          <div style={{ borderBottom: '1px solid #c4a46a', height: '20px', marginBottom: '4px' }}></div>
          <div style={{ borderBottom: '1px solid #c4a46a', height: '20px' }}></div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '8pt', color: '#a0907a', fontFamily: "'MedievalSharp', cursive" }}>
          D&D Character Creator &mdash; May your adventures be legendary!
        </div>
      </div>
    </div>
  );
}

function PrintStat({ icon, label, value }: { icon: string; label: string; value: number | undefined }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '18pt' }}>{icon}</div>
      <div style={{ fontSize: '22pt', fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: '8pt', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#7a6a5a', letterSpacing: '1px' }}>{label}</div>
    </div>
  );
}
