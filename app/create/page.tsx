'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CLASSES, STEP_LABELS, CELEBRATION_MESSAGES, WEAPONS } from '@/lib/game-data';
import { RACES, ARMOR_TYPES } from '@/lib/game-data';
import { computeBaseStats } from '@/lib/stats';
import { createCharacter } from '@/lib/supabase';
import { StepIdentity } from '@/components/character-wizard/step-identity';
import { StepRace } from '@/components/character-wizard/step-race';
import { StepClass } from '@/components/character-wizard/step-class';
import { StepArmor } from '@/components/character-wizard/step-armor';
import { StepWeapon } from '@/components/character-wizard/step-weapon';
import { StepReview } from '@/components/character-wizard/step-review';
import { Suspense } from 'react';

function CreateWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const playerId = searchParams.get('player') || '';
  const playerNameParam = searchParams.get('name') || '';

  const [step, setStep] = useState(0);
  const [celebration, setCelebration] = useState('');
  const [saving, setSaving] = useState(false);

  // Character state
  const [playerName, setPlayerName] = useState(playerNameParam);
  const [charName, setCharName] = useState('');
  const [charAge, setCharAge] = useState('');
  const [charGender, setCharGender] = useState('');
  const [customGender, setCustomGender] = useState('');
  const [raceId, setRaceId] = useState('');
  const [classId, setClassId] = useState('');
  const [subclassId, setSubclassId] = useState('');
  const [armorId, setArmorId] = useState('');
  const [weaponId, setWeaponId] = useState('');

  const race = useMemo(() => RACES.find(r => r.id === raceId), [raceId]);
  const cls = useMemo(() => CLASSES.find(c => c.id === classId), [classId]);
  const subclass = useMemo(() => cls?.subclasses.find(s => s.id === subclassId), [cls, subclassId]);
  const armor = useMemo(() => ARMOR_TYPES.find(a => a.id === armorId), [armorId]);
  const weapon = useMemo(() => classId ? WEAPONS[classId]?.find(w => w.id === weaponId) : null, [classId, weaponId]);

  const stats = useMemo(() => computeBaseStats(cls, race, subclass, armor, weapon ?? undefined), [cls, race, subclass, armor, weapon]);

  const triggerCelebration = useCallback(() => {
    const msg = CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
    setCelebration(msg);
    setTimeout(() => setCelebration(''), 1500);
  }, []);

  const canAdvance = useMemo(() => {
    const genderDisplay = charGender === 'Other' ? customGender : charGender;
    switch(step) {
      case 0: return playerName.trim().length > 0 && charName.trim().length > 0 && charAge && genderDisplay.length > 0;
      case 1: return !!raceId;
      case 2: return !!classId && !!subclassId;
      case 3: return !!armorId;
      case 4: return !!weaponId;
      default: return true;
    }
  }, [step, playerName, charName, charAge, charGender, customGender, raceId, classId, subclassId, armorId, weaponId]);

  const goNext = useCallback(() => {
    if (canAdvance && step < 5) {
      setStep(s => s + 1);
      triggerCelebration();
    }
  }, [canAdvance, step, triggerCelebration]);

  const goBack = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
  }, [step]);

  const goToStep = useCallback((s: number) => {
    setStep(s);
  }, []);

  // Reset downstream when changing upstream choices
  const selectClass = useCallback((id: string) => {
    setClassId(id);
    setSubclassId('');
    setArmorId('');
    setWeaponId('');
    triggerCelebration();
  }, [triggerCelebration]);

  const selectSubclass = useCallback((id: string) => {
    setSubclassId(id);
    triggerCelebration();
  }, [triggerCelebration]);

  const selectArmor = useCallback((id: string) => {
    setArmorId(id);
    triggerCelebration();
  }, [triggerCelebration]);

  const selectWeapon = useCallback((id: string) => {
    setWeaponId(id);
    triggerCelebration();
  }, [triggerCelebration]);

  const selectRace = useCallback((id: string) => {
    setRaceId(id);
    triggerCelebration();
  }, [triggerCelebration]);

  const genderDisplay = charGender === 'Other' ? customGender : charGender;

  const handleSave = async () => {
    if (!playerId) {
      alert('No player selected. Please go back and choose a player.');
      return;
    }
    setSaving(true);
    try {
      const character = await createCharacter({
        player_id: playerId,
        player_name: playerName,
        char_name: charName,
        char_age: charAge ? parseInt(charAge) : null,
        char_gender: genderDisplay || null,
        race_id: raceId,
        class_id: classId,
        subclass_id: subclassId,
        armor_id: armorId,
        weapon_id: weaponId,
      });
      router.push(`/characters/${character.id}`);
    } catch (err) {
      console.error('Failed to save character:', err);
      alert('Failed to save character. Please try again.');
      setSaving(false);
    }
  };

  // Keyboard shortcut: Enter to advance
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && canAdvance && step < 5) {
        goNext();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [canAdvance, step, goNext]);

  return (
    <div className="min-h-screen bg-dark-bg text-white font-[family-name:var(--font-body)] flex flex-col">
      {/* Header */}
      <header className="no-print bg-gradient-to-r from-dark-card via-dark-bg to-dark-card border-b-2 border-gold/30 p-4 text-center">
        <h1 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl text-gold font-bold tracking-wide">
          D&D Character Creator
        </h1>
        <p className="font-[family-name:var(--font-medieval)] text-parchment/70 mt-1 text-lg">Forge Your Hero</p>
      </header>

      {/* Progress Bar */}
      <div className="no-print bg-dark-card/80 border-b border-gold/20 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-1">
          {STEP_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => { if (i <= step) goToStep(i); }}
              className={`flex-1 text-center py-2 px-1 rounded-lg text-sm md:text-base font-semibold transition-all cursor-pointer
                ${i === step ? 'bg-gold text-dark-bg scale-105' :
                  i < step ? 'bg-gold/30 text-gold hover:bg-gold/40' :
                  'bg-dark-border/30 text-white/30 cursor-default'}`}
              disabled={i > step}
            >
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Celebration Banner */}
      {celebration && (
        <div className="no-print text-center py-2 bg-gold/20">
          <span className="celebrate inline-block text-gold font-[family-name:var(--font-cinzel)] text-xl font-bold">{celebration}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto slide-in" key={step}>
          {step === 0 && <StepIdentity playerName={playerName} setPlayerName={setPlayerName} charName={charName} setCharName={setCharName} charAge={charAge} setCharAge={setCharAge} charGender={charGender} setCharGender={setCharGender} customGender={customGender} setCustomGender={setCustomGender} hidePlayerName={!!playerNameParam} />}
          {step === 1 && <StepRace selected={raceId} onSelect={selectRace} />}
          {step === 2 && <StepClass selectedClass={classId} selectedSubclass={subclassId} onSelectClass={selectClass} onSelectSubclass={selectSubclass} />}
          {step === 3 && <StepArmor selected={armorId} onSelect={selectArmor} classId={classId} />}
          {step === 4 && <StepWeapon selected={weaponId} onSelect={selectWeapon} classId={classId} />}
          {step === 5 && <StepReview playerName={playerName} charName={charName} charAge={charAge} gender={genderDisplay} race={race} cls={cls} subclass={subclass} armor={armor} weapon={weapon ?? undefined} stats={stats} onEdit={goToStep} onSave={handleSave} saving={saving} />}
        </div>
      </main>

      {/* Bottom Nav */}
      {step < 5 && (
        <div className="no-print sticky bottom-0 bg-dark-card border-t-2 border-gold/30 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            {stats && (
              <div className="hidden md:flex items-center gap-4 text-sm">
                <span className="text-red-400">❤️ {stats.health}</span>
                <span className="text-blue-400">🛡️ {stats.armor}</span>
                <span className="text-green-400">👢 {stats.moves}</span>
                <span className="text-yellow-400">⭐ {stats.ap}</span>
              </div>
            )}
            <div className="flex gap-3 ml-auto">
              <button
                onClick={goBack}
                disabled={step === 0}
                className="px-6 py-3 rounded-xl font-[family-name:var(--font-cinzel)] font-bold text-lg border-2 border-gold/50 text-gold/70 hover:bg-gold/10 disabled:opacity-30 disabled:cursor-default transition-all"
              >
                Back
              </button>
              <button
                onClick={goNext}
                disabled={!canAdvance}
                className="px-8 py-3 rounded-xl font-[family-name:var(--font-cinzel)] font-bold text-lg bg-gold text-dark-bg hover:bg-gold-dark disabled:opacity-30 disabled:cursor-default transition-all glow-pulse"
              >
                {step === 4 ? 'Review Hero' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-gold font-[family-name:var(--font-cinzel)] text-2xl">Loading...</div>
      </div>
    }>
      <CreateWizard />
    </Suspense>
  );
}
