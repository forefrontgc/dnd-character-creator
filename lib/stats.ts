import { RACES, CLASSES, ARMOR_TYPES, WEAPONS } from './game-data';
import type { Race, GameClass, Subclass, ArmorType, Weapon } from './game-data';

export interface LevelUp {
  id: string;
  character_id: string;
  level: number;
  bonus_type: string;
  created_at: string;
}

export interface CustomModifier {
  id: string;
  character_id: string;
  name: string;
  description: string | null;
  health_mod: number;
  armor_mod: number;
  move_mod: number;
  ap_mod: number;
  is_active: boolean;
  created_at: string;
}

export interface ComputedStats {
  health: number;
  armor: number;
  moves: number;
  ap: number;
}

// Lookup helpers
export function findRace(id: string): Race | undefined {
  return RACES.find(r => r.id === id);
}

export function findClass(id: string): GameClass | undefined {
  return CLASSES.find(c => c.id === id);
}

export function findSubclass(classId: string, subclassId: string): Subclass | undefined {
  return findClass(classId)?.subclasses.find(s => s.id === subclassId);
}

export function findArmor(id: string): ArmorType | undefined {
  return ARMOR_TYPES.find(a => a.id === id);
}

export function findWeapon(classId: string, weaponId: string): Weapon | undefined {
  return WEAPONS[classId]?.find(w => w.id === weaponId);
}

// Base stat computation — identical to original HTML version
export function computeBaseStats(
  cls: GameClass | undefined,
  race: Race | undefined,
  subclass: Subclass | undefined,
  armor: ArmorType | undefined,
  weapon: Weapon | undefined,
): ComputedStats | null {
  if (!cls) return null;

  const baseHealth = cls.baseHealth + (race?.healthMod || 0) + (subclass?.healthBonus || 0);
  const berserkerPenalty = subclass?.armorPenalty || 0;
  const baseArmor = (armor?.value || 0) + (race?.armorMod || 0) + (subclass?.armorBonus || 0) + (weapon?.armorBonus || 0) + berserkerPenalty;
  const baseMoves = cls.baseMoves + (race?.moveMod || 0) + (subclass?.moveBonus || 0) + (armor?.movePenalty || 0) + (armor?.moveBonus || 0);
  const baseAP = cls.baseAP + (race?.apMod || 0) + (subclass?.apBonus || 0) + (weapon?.apBonus || 0);

  return {
    health: Math.max(1, baseHealth),
    armor: Math.max(0, baseArmor),
    moves: Math.max(1, baseMoves),
    ap: Math.max(1, baseAP),
  };
}

// Full stat computation with level bonuses + custom modifiers
export function computeFullStats(
  cls: GameClass | undefined,
  race: Race | undefined,
  subclass: Subclass | undefined,
  armor: ArmorType | undefined,
  weapon: Weapon | undefined,
  levelUps: LevelUp[],
  modifiers: CustomModifier[],
): ComputedStats | null {
  const base = computeBaseStats(cls, race, subclass, armor, weapon);
  if (!base) return null;

  // Sum level bonuses
  let levelHealth = 0, levelArmor = 0, levelMove = 0, levelAP = 0;
  for (const lu of levelUps) {
    switch (lu.bonus_type) {
      case 'health': levelHealth += 2; break;
      case 'armor': levelArmor += 1; break;
      case 'move': levelMove += 1; break;
      case 'ap': levelAP += 1; break;
      // 'damage' doesn't affect stats directly, it's tracked for the sheet
    }
  }

  // Sum active custom modifiers
  let modHealth = 0, modArmor = 0, modMove = 0, modAP = 0;
  for (const m of modifiers) {
    if (!m.is_active) continue;
    modHealth += m.health_mod;
    modArmor += m.armor_mod;
    modMove += m.move_mod;
    modAP += m.ap_mod;
  }

  return {
    health: Math.max(1, base.health + levelHealth + modHealth),
    armor: Math.max(0, base.armor + levelArmor + modArmor),
    moves: Math.max(1, base.moves + levelMove + modMove),
    ap: Math.max(1, base.ap + levelAP + modAP),
  };
}

// Count weapon damage bonus from level ups
export function getDamageBonusFromLevels(levelUps: LevelUp[]): number {
  return levelUps.filter(lu => lu.bonus_type === 'damage').length;
}
