// ========== GAME DATA ==========
// ALL data ported unchanged from the original single-file character creator.
// Characters are already in play — do NOT modify values.

export const FANTASY_NAMES = [
  "Thorin Ashblade","Lyra Moonshadow","Brix Ironfoot","Elara Dawnwhisper","Kael Stormborn",
  "Nyx Shadowmere","Rowan Brightforge","Seraphina Wildfire","Dax Thunderfist","Ivy Mistwalker",
  "Magnus Stoneheart","Willow Starweave","Finn Embercloak","Aurora Frostbloom","Zephyr Windrunner",
  "Cora Lightbringer","Jasper Ravencrest","Luna Silverthorn","Alaric Duskbane","Freya Goldensong",
  "Drake Blackthorn","Rosalind Sunpetal","Cedric Wolfhelm","Briar Thornwood","Astrid Flamedancer",
  "Quinn Nighthollow","Gareth Ironfang","Sapphire Dewdrop","Orion Skyfall","Maple Honeyglen",
  "Viktor Bloodaxe","Fern Cloudweaver","Boris Hammerstone","Coral Tidecaller","Rex Firemane",
  "Dahlia Moonpetal","Sven Frostbeard","Juniper Windchime","Axel Steelclaw","Hazel Sparkbrook",
  "Theron Drakescale","Ember Ashfall","Grimnir Deepforge","Crystal Starlight","Ragnar Bonecrusher",
  "Ivy Nightbloom","Fenris Stormwolf","Sage Riversong","Baldric Shieldbreaker","Wren Dawnfeather"
] as const;

export interface Spell {
  name: string;
  cost: string;
  effect: string;
}

export interface Subclass {
  id: string;
  name: string;
  icon: string;
  flavor: string;
  healthBonus: number;
  armorBonus: number;
  moveBonus: number;
  apBonus: number;
  ability: string;
  abilityDesc: string;
  tradeoff?: string;
  armorPenalty?: number;
  extra?: string;
  spells?: Spell[];
}

export interface Race {
  id: string;
  name: string;
  icon: string;
  flavor: string;
  healthMod: number;
  armorMod: number;
  moveMod: number;
  apMod: number;
  trait: string;
  traitDesc: string;
}

export interface GameClass {
  id: string;
  name: string;
  icon: string;
  flavor: string;
  baseHealth: number;
  baseMoves: number;
  baseAP: number;
  armorAccess: string[];
  subclasses: Subclass[];
}

export interface ArmorType {
  id: string;
  name: string;
  icon: string;
  value: number;
  movePenalty: number;
  moveBonus: number;
  flavor: string;
  restriction: string;
  allowedClasses: string[];
}

export interface Weapon {
  id: string;
  name: string;
  damage: string;
  special: string;
  armorBonus: number;
  apBonus: number;
}

export const RACES: Race[] = [
  {
    id: 'dwarf', name: 'Dwarf', icon: '🪓',
    flavor: 'Stout and sturdy, Dwarves are born from stone and fire. They never back down from a fight.',
    healthMod: 2, armorMod: 1, moveMod: 0, apMod: 0,
    trait: 'Stone Resilience', traitDesc: 'Once per combat, reduce incoming damage by 2',
  },
  {
    id: 'human', name: 'Human', icon: '⚔️',
    flavor: 'Versatile and determined, Humans adapt to any challenge. Their courage knows no bounds.',
    healthMod: 1, armorMod: 1, moveMod: 0, apMod: 1,
    trait: 'Adaptable', traitDesc: 'Gets 1 extra action point per combat (starts with 4 instead of 3)',
  },
  {
    id: 'elf', name: 'Elf', icon: '🏹',
    flavor: 'Graceful and quick, Elves move like the wind. Their keen senses miss nothing.',
    healthMod: 0, armorMod: 0, moveMod: 1, apMod: 0,
    trait: 'Elven Agility', traitDesc: '+1 Move per turn (3 instead of 2), advantage on dodging',
  },
];

export const CLASSES: GameClass[] = [
  {
    id: 'fighter', name: 'Fighter', icon: '🗡️',
    flavor: 'Masters of steel and strength. Fighters lead the charge and protect their allies.',
    baseHealth: 12, baseMoves: 2, baseAP: 3,
    armorAccess: ['heavy', 'medium', 'light'],
    subclasses: [
      {
        id: 'guardian', name: 'Guardian', icon: '🛡️',
        flavor: 'An immovable wall of defense.',
        healthBonus: 0, armorBonus: 2, moveBonus: -1, apBonus: 0,
        ability: 'Shield Wall',
        abilityDesc: 'Spend 1 AP to block all damage from one attack for yourself or an adjacent ally. Once per combat.',
        tradeoff: '-1 Move per turn (minimum 1)',
      },
      {
        id: 'berserker', name: 'Berserker', icon: '💥',
        flavor: 'Fueled by rage, they hit harder than anyone.',
        healthBonus: 2, armorBonus: 0, moveBonus: 0, apBonus: 0,
        ability: 'Rage Strike',
        abilityDesc: 'Spend 1 AP to deal double damage on your next attack. Once per combat.',
        tradeoff: '-1 Armor (rage makes you reckless)',
        armorPenalty: -1,
      },
    ],
  },
  {
    id: 'archer', name: 'Archer', icon: '🏹',
    flavor: 'Silent and deadly from a distance. Archers never miss — well, almost never.',
    baseHealth: 10, baseMoves: 2, baseAP: 3,
    armorAccess: ['medium', 'light'],
    subclasses: [
      {
        id: 'sharpshooter', name: 'Sharpshooter', icon: '🎯',
        flavor: 'One shot, one kill. Precision above all.',
        healthBonus: 0, armorBonus: 0, moveBonus: 0, apBonus: 0,
        ability: 'Perfect Shot',
        abilityDesc: 'Spend 1 AP to automatically hit AND deal +3 bonus damage. Once per combat.',
        extra: '+1 to all ranged attack rolls',
      },
      {
        id: 'shadow-ranger', name: 'Shadow Ranger', icon: '🌑',
        flavor: 'Strikes from the darkness, then vanishes.',
        healthBonus: 0, armorBonus: 1, moveBonus: 1, apBonus: 0,
        ability: 'Vanish',
        abilityDesc: 'Spend 1 AP to become hidden. Next attack is a guaranteed critical hit (double damage), but you become visible again. Once per combat.',
      },
    ],
  },
  {
    id: 'mage', name: 'Mage', icon: '🔮',
    flavor: 'Wielders of arcane power. Mages bend reality to their will — but watch your health!',
    baseHealth: 8, baseMoves: 2, baseAP: 4,
    armorAccess: ['light'],
    subclasses: [
      {
        id: 'pyromancer', name: 'Pyromancer', icon: '🔥',
        flavor: 'Born of flame, they burn everything in their path.',
        healthBonus: 1, armorBonus: 0, moveBonus: 0, apBonus: 0,
        ability: 'Fire Magic',
        abilityDesc: 'Commands devastating fire spells.',
        spells: [
          { name: 'Fireball', cost: '1 AP', effect: 'Deal 4 damage to one enemy, 2 splash damage to adjacent enemies' },
          { name: 'Flame Shield', cost: '1 AP', effect: 'Gain +2 Armor until your next turn; attackers take 1 damage' },
          { name: 'Inferno', cost: '2 AP', effect: 'Deal 6 damage to all enemies in a zone. Once per combat.' },
        ],
      },
      {
        id: 'frostweaver', name: 'Frostweaver', icon: '❄️',
        flavor: 'Cold and calculating, they control the battlefield.',
        healthBonus: 0, armorBonus: 1, moveBonus: 0, apBonus: 0,
        ability: 'Frost Magic',
        abilityDesc: 'Wields ice to control and damage enemies.',
        spells: [
          { name: 'Ice Shard', cost: '1 AP', effect: 'Deal 3 damage and reduce target\'s Moves by 1 for one turn' },
          { name: 'Frost Armor', cost: '1 AP', effect: 'Give self or ally +3 Armor until next turn' },
          { name: 'Blizzard', cost: '2 AP', effect: 'Deal 3 damage to all enemies and reduce all enemy Moves by 1 for one turn. Once per combat.' },
        ],
      },
    ],
  },
];

export const ARMOR_TYPES: ArmorType[] = [
  {
    id: 'heavy', name: 'Heavy Armor', icon: '🏰',
    value: 5, movePenalty: -1, moveBonus: 0,
    flavor: 'Plates of solid steel. Slow, but nearly unstoppable.',
    restriction: 'Only available to Fighter class',
    allowedClasses: ['fighter'],
  },
  {
    id: 'medium', name: 'Medium Armor', icon: '⚔️',
    value: 3, movePenalty: 0, moveBonus: 0,
    flavor: 'Chainmail and leather. A solid balance of speed and protection.',
    restriction: 'Available to Fighter and Archer',
    allowedClasses: ['fighter', 'archer'],
  },
  {
    id: 'light', name: 'Light Armor', icon: '🍃',
    value: 1, movePenalty: 0, moveBonus: 1,
    flavor: 'Soft leather and cloth. Move fast, strike first.',
    restriction: 'Available to all classes',
    allowedClasses: ['fighter', 'archer', 'mage'],
  },
];

export const WEAPONS: Record<string, Weapon[]> = {
  fighter: [
    { id: 'longsword', name: 'Longsword', damage: '4', special: 'Balanced — no bonuses or penalties', armorBonus: 0, apBonus: 0 },
    { id: 'battleaxe', name: 'Battleaxe', damage: '5', special: 'Heavy — -1 to hit rolls', armorBonus: 0, apBonus: 0 },
    { id: 'warhammer', name: 'Warhammer', damage: '4', special: 'Stun — on a hit of 6, target loses 1 action next turn', armorBonus: 0, apBonus: 0 },
    { id: 'shield-shortsword', name: 'Shield + Short Sword', damage: '3', special: '+1 Armor while equipped', armorBonus: 1, apBonus: 0 },
    { id: 'shield-axe', name: 'Shield + Handaxe', damage: '4', special: '+1 Armor while equipped, can throw axe once per combat for ranged attack', armorBonus: 1, apBonus: 0 },
  ],
  archer: [
    { id: 'longbow', name: 'Longbow', damage: '4', special: 'Range: Long (attack from 3 zones away)', armorBonus: 0, apBonus: 0 },
    { id: 'shortbow', name: 'Shortbow', damage: '3', special: 'Range: Medium, +1 to hit rolls (faster aim)', armorBonus: 0, apBonus: 0 },
    { id: 'crossbow', name: 'Crossbow', damage: '5', special: 'Range: Long, but takes 1 action to reload', armorBonus: 0, apBonus: 0 },
    { id: 'dual-daggers', name: 'Dual Daggers', damage: '3+3', special: 'Melee only, attack twice per action', armorBonus: 0, apBonus: 0 },
  ],
  mage: [
    { id: 'staff', name: 'Staff', damage: '2', special: '+1 to all spell damage', armorBonus: 0, apBonus: 0 },
    { id: 'wand', name: 'Wand', damage: '1', special: '+1 Action Point per combat', armorBonus: 0, apBonus: 1 },
    { id: 'spellbook-dagger', name: 'Spellbook + Dagger', damage: '2', special: 'Gain 1 extra use of your ultimate spell per combat', armorBonus: 0, apBonus: 0 },
    { id: 'crystal-orb', name: 'Crystal Orb', damage: '1', special: '+2 to all healing or defensive spells', armorBonus: 0, apBonus: 0 },
  ],
};

export const STEP_LABELS = ['Identity', 'Race', 'Class', 'Armor', 'Weapon', 'Review'] as const;

export const CELEBRATION_MESSAGES = [
  "Epic choice!", "Legendary!", "Your hero grows stronger!",
  "The quest continues!", "A mighty decision!", "Incredible pick!",
  "Your destiny takes shape!", "The adventure beckons!",
] as const;

export const LEVEL_BONUS_OPTIONS = [
  { id: 'health', name: 'Toughen Up', effect: '+2 Health', icon: '❤️' },
  { id: 'armor', name: 'Harden Defenses', effect: '+1 Armor', icon: '🛡️' },
  { id: 'move', name: 'Quick Feet', effect: '+1 Move per turn', icon: '👢' },
  { id: 'ap', name: 'Battle Ready', effect: '+1 Action Point', icon: '⭐' },
  { id: 'damage', name: 'Weapon Mastery', effect: '+1 Weapon Damage', icon: '⚔️' },
] as const;

export const MAX_LEVEL = 10;

// ========== SKILL TREES ==========
// Class/subclass-specific level-up progression (levels 2-10).
// Each level offers 2-3 skill choices; the player picks one.
// The chosen skill's `id` is stored in level_ups.bonus_type.

export type SkillCategory = 'stat' | 'ability' | 'passive' | 'upgrade';

export interface SkillStatEffect {
  health?: number;
  armor?: number;
  move?: number;
  ap?: number;
  damage?: number;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: SkillCategory;
  statEffect?: SkillStatEffect;
}

export interface SkillLevel {
  level: number;
  choices: Skill[];
}

export interface SkillTree {
  subclassId: string;
  levels: SkillLevel[];
}

export const SKILL_TREES: SkillTree[] = [
  // ===== FIGHTER / GUARDIAN =====
  {
    subclassId: 'guardian',
    levels: [
      {
        level: 2,
        choices: [
          { id: 'guardian-2-hp', name: 'Fortified Body', icon: '❤️', description: 'Your training toughens you up.', category: 'stat', statEffect: { health: 3 } },
          { id: 'guardian-2-armor', name: 'Iron Plating', icon: '🛡️', description: 'You reinforce your armor.', category: 'stat', statEffect: { armor: 1 } },
        ],
      },
      {
        level: 3,
        choices: [
          { id: 'guardian-3-shield-bash', name: 'Shield Bash', icon: '💥', description: '1 AP: Push an enemy 1 zone and deal 2 damage.', category: 'ability' },
          { id: 'guardian-3-taunt', name: 'Taunt', icon: '😤', description: '1 AP: Force an enemy to attack only you next turn.', category: 'ability' },
        ],
      },
      {
        level: 4,
        choices: [
          { id: 'guardian-4-iron-skin', name: 'Iron Skin', icon: '🪨', description: 'Reduce all incoming damage by 1.', category: 'passive' },
          { id: 'guardian-4-sentinel', name: 'Sentinel', icon: '🚧', description: 'Enemies cannot move past your zone.', category: 'passive' },
        ],
      },
      {
        level: 5,
        choices: [
          { id: 'guardian-5-shield-wall-double', name: 'Shield Wall+', icon: '🛡️', description: 'Shield Wall now blocks 2 attacks per combat.', category: 'upgrade' },
          { id: 'guardian-5-shield-wall-range', name: 'Shield Wall+', icon: '🛡️', description: 'Shield Wall can cover an ally up to 2 zones away.', category: 'upgrade' },
        ],
      },
      {
        level: 6,
        choices: [
          { id: 'guardian-6-hp-armor', name: 'Bulwark', icon: '🏰', description: 'You become even harder to take down.', category: 'stat', statEffect: { health: 2, armor: 1 } },
          { id: 'guardian-6-move-ap', name: 'Battle Tempo', icon: '⚡', description: 'You move and act faster in combat.', category: 'stat', statEffect: { move: 1, ap: 1 } },
        ],
      },
      {
        level: 7,
        choices: [
          { id: 'guardian-7-fortress', name: 'Fortress', icon: '🏰', description: '1 AP: All allies in your zone get +2 Armor this turn.', category: 'ability' },
          { id: 'guardian-7-counter', name: 'Counter Strike', icon: '⚔️', description: 'When an enemy misses you, deal 2 damage back.', category: 'ability' },
        ],
      },
      {
        level: 8,
        choices: [
          { id: 'guardian-8-heavy-hitter', name: 'Heavy Hitter', icon: '⚔️', description: 'Your weapons hit harder than ever.', category: 'stat', statEffect: { damage: 1 } },
          { id: 'guardian-8-unbreakable', name: 'Unbreakable', icon: '❤️', description: 'Your body can take incredible punishment.', category: 'stat', statEffect: { health: 3 } },
        ],
      },
      {
        level: 9,
        choices: [
          { id: 'guardian-9-armor', name: 'Living Fortress', icon: '🛡️', description: 'Your armor becomes nearly impenetrable.', category: 'stat', statEffect: { armor: 2 } },
          { id: 'guardian-9-hp', name: 'Titan\'s Vigor', icon: '❤️', description: 'You gain a massive boost to health.', category: 'stat', statEffect: { health: 3 } },
        ],
      },
      {
        level: 10,
        choices: [
          { id: 'guardian-10-unstoppable', name: 'Unstoppable', icon: '🌟', description: '2 AP: Become immune to all damage for 1 full round. Once per combat.', category: 'ability' },
          { id: 'guardian-10-guardian-angel', name: 'Guardian Angel', icon: '👼', description: '3 AP: Revive ALL knocked-out allies with 5 HP. Once per combat.', category: 'ability' },
        ],
      },
    ],
  },

  // ===== FIGHTER / BERSERKER =====
  {
    subclassId: 'berserker',
    levels: [
      {
        level: 2,
        choices: [
          { id: 'berserker-2-hp', name: 'Thick Hide', icon: '❤️', description: 'Rage fuels your body to endure more.', category: 'stat', statEffect: { health: 2 } },
          { id: 'berserker-2-damage', name: 'Savage Strikes', icon: '⚔️', description: 'Your blows hit harder.', category: 'stat', statEffect: { damage: 1 } },
        ],
      },
      {
        level: 3,
        choices: [
          { id: 'berserker-3-cleave', name: 'Cleave', icon: '🪓', description: '1 AP: Hit 2 adjacent enemies with one swing.', category: 'ability' },
          { id: 'berserker-3-war-cry', name: 'War Cry', icon: '📢', description: '1 AP: All your attacks deal +2 damage this turn.', category: 'ability' },
        ],
      },
      {
        level: 4,
        choices: [
          { id: 'berserker-4-blood-rage', name: 'Blood Rage', icon: '🩸', description: 'Deal +2 damage when below half HP.', category: 'passive' },
          { id: 'berserker-4-thick-skin', name: 'Thick Skin', icon: '🛡️', description: 'Even raging, you can take a hit.', category: 'passive', statEffect: { armor: 1 } },
        ],
      },
      {
        level: 5,
        choices: [
          { id: 'berserker-5-rage-triple', name: 'Rage Strike+', icon: '💥', description: 'Rage Strike now deals triple damage.', category: 'upgrade' },
          { id: 'berserker-5-rage-twice', name: 'Rage Strike+', icon: '💥', description: 'Rage Strike can be used twice per combat.', category: 'upgrade' },
        ],
      },
      {
        level: 6,
        choices: [
          { id: 'berserker-6-hp', name: 'Battle Scarred', icon: '❤️', description: 'Your scars make you tougher.', category: 'stat', statEffect: { health: 3 } },
          { id: 'berserker-6-damage-ap', name: 'Fury Unleashed', icon: '⚡', description: 'More damage, more actions.', category: 'stat', statEffect: { damage: 1, ap: 1 } },
        ],
      },
      {
        level: 7,
        choices: [
          { id: 'berserker-7-earthquake', name: 'Earthquake Slam', icon: '🌋', description: '2 AP: Deal 4 damage to all enemies in your zone.', category: 'ability' },
          { id: 'berserker-7-frenzy', name: 'Frenzy', icon: '🌀', description: '2 AP: Attack 3 times at -2 damage each.', category: 'ability' },
        ],
      },
      {
        level: 8,
        choices: [
          { id: 'berserker-8-relentless', name: 'Relentless', icon: '💀', description: 'Knocking out an enemy gives you 1 free AP.', category: 'passive' },
          { id: 'berserker-8-tough', name: 'Tough', icon: '❤️', description: 'You just refuse to go down.', category: 'stat', statEffect: { health: 3 } },
        ],
      },
      {
        level: 9,
        choices: [
          { id: 'berserker-9-damage', name: 'Brutal Force', icon: '⚔️', description: 'Your weapons become terrifyingly powerful.', category: 'stat', statEffect: { damage: 2 } },
          { id: 'berserker-9-hp-armor', name: 'War-Hardened', icon: '🛡️', description: 'Tougher body, tougher armor.', category: 'stat', statEffect: { health: 2, armor: 1 } },
        ],
      },
      {
        level: 10,
        choices: [
          { id: 'berserker-10-rampage', name: 'Rampage', icon: '🌟', description: '3 AP: Deal full weapon damage to every enemy on the battlefield. Once per combat.', category: 'ability' },
          { id: 'berserker-10-undying', name: 'Undying Fury', icon: '🔥', description: 'The first time you would be knocked out, survive with 1 HP instead. Once per combat.', category: 'ability' },
        ],
      },
    ],
  },

  // ===== ARCHER / SHARPSHOOTER =====
  {
    subclassId: 'sharpshooter',
    levels: [
      {
        level: 2,
        choices: [
          { id: 'sharpshooter-2-damage', name: 'Steady Aim', icon: '⚔️', description: 'Your arrows strike with more force.', category: 'stat', statEffect: { damage: 1 } },
          { id: 'sharpshooter-2-ap', name: 'Quick Draw', icon: '⭐', description: 'You nock arrows faster.', category: 'stat', statEffect: { ap: 1 } },
        ],
      },
      {
        level: 3,
        choices: [
          { id: 'sharpshooter-3-pin', name: 'Pin Shot', icon: '📌', description: '1 AP: Hit an enemy and reduce their Move by 2 this turn.', category: 'ability' },
          { id: 'sharpshooter-3-quick-shot', name: 'Quick Shot', icon: '💨', description: 'After moving, make a free ranged attack. Once per combat.', category: 'ability' },
        ],
      },
      {
        level: 4,
        choices: [
          { id: 'sharpshooter-4-eagle-eye', name: 'Eagle Eye', icon: '🦅', description: '+1 to all ranged attack rolls.', category: 'passive' },
          { id: 'sharpshooter-4-steady-hands', name: 'Steady Hands', icon: '🎯', description: 'Your precision increases weapon damage.', category: 'passive', statEffect: { damage: 1 } },
        ],
      },
      {
        level: 5,
        choices: [
          { id: 'sharpshooter-5-perfect-damage', name: 'Perfect Shot+', icon: '🎯', description: 'Perfect Shot now deals +5 bonus damage.', category: 'upgrade' },
          { id: 'sharpshooter-5-perfect-twice', name: 'Perfect Shot+', icon: '🎯', description: 'Perfect Shot can be used twice per combat.', category: 'upgrade' },
        ],
      },
      {
        level: 6,
        choices: [
          { id: 'sharpshooter-6-hp-armor', name: 'Hardened Ranger', icon: '🛡️', description: 'Combat experience toughens you.', category: 'stat', statEffect: { health: 2, armor: 1 } },
          { id: 'sharpshooter-6-ap-move', name: 'Fleet Foot', icon: '👢', description: 'Faster on your feet, quicker with your bow.', category: 'stat', statEffect: { ap: 1, move: 1 } },
        ],
      },
      {
        level: 7,
        choices: [
          { id: 'sharpshooter-7-arrow-rain', name: 'Arrow Rain', icon: '🌧️', description: '2 AP: Deal 3 damage to all enemies in a zone.', category: 'ability' },
          { id: 'sharpshooter-7-headshot', name: 'Headshot', icon: '💀', description: 'On a roll of 15+, instantly knock out a non-boss enemy.', category: 'ability' },
        ],
      },
      {
        level: 8,
        choices: [
          { id: 'sharpshooter-8-longshot', name: 'Longshot', icon: '🏹', description: 'You can attack from 4 zones away.', category: 'passive' },
          { id: 'sharpshooter-8-nimble', name: 'Nimble', icon: '👢', description: 'You dodge and weave through the battlefield.', category: 'stat', statEffect: { move: 1 } },
        ],
      },
      {
        level: 9,
        choices: [
          { id: 'sharpshooter-9-damage', name: 'Lethal Precision', icon: '⚔️', description: 'Your arrows find the weak spots.', category: 'stat', statEffect: { damage: 2 } },
          { id: 'sharpshooter-9-hp', name: 'Survivor', icon: '❤️', description: 'You\'ve learned to stay alive out there.', category: 'stat', statEffect: { health: 3 } },
        ],
      },
      {
        level: 10,
        choices: [
          { id: 'sharpshooter-10-barrage', name: 'Bullseye Barrage', icon: '🌟', description: '3 AP: Fire 5 arrows that automatically hit for weapon damage each. Once per combat.', category: 'ability' },
          { id: 'sharpshooter-10-ghost-arrow', name: 'Ghost Arrow', icon: '👻', description: '2 AP: Fire a spectral arrow that ignores all armor entirely. Once per combat.', category: 'ability' },
        ],
      },
    ],
  },

  // ===== ARCHER / SHADOW RANGER =====
  {
    subclassId: 'shadow-ranger',
    levels: [
      {
        level: 2,
        choices: [
          { id: 'shadow-ranger-2-move', name: 'Shadow Step', icon: '👢', description: 'You move like a ghost.', category: 'stat', statEffect: { move: 1 } },
          { id: 'shadow-ranger-2-armor', name: 'Shadow Cloak', icon: '🛡️', description: 'Darkness shields you from harm.', category: 'stat', statEffect: { armor: 1 } },
        ],
      },
      {
        level: 3,
        choices: [
          { id: 'shadow-ranger-3-smoke', name: 'Smoke Bomb', icon: '💨', description: '1 AP: All allies become hidden. Enemies need 15+ to hit.', category: 'ability' },
          { id: 'shadow-ranger-3-poison', name: 'Poison Blade', icon: '🗡️', description: '1 AP: Your next attack deals +2 poison damage over 1 turn.', category: 'ability' },
        ],
      },
      {
        level: 4,
        choices: [
          { id: 'shadow-ranger-4-shadow-step', name: 'Shadow Step', icon: '🌀', description: 'Teleport 1 zone when you use Vanish.', category: 'passive' },
          { id: 'shadow-ranger-4-tracker', name: 'Tracker', icon: '👢', description: 'You cover ground faster.', category: 'passive', statEffect: { move: 1 } },
        ],
      },
      {
        level: 5,
        choices: [
          { id: 'shadow-ranger-5-vanish-twice', name: 'Vanish+', icon: '🌑', description: 'Vanish can be used twice per combat.', category: 'upgrade' },
          { id: 'shadow-ranger-5-vanish-stealth', name: 'Vanish+', icon: '🌑', description: 'Stay hidden even after attacking from stealth.', category: 'upgrade' },
        ],
      },
      {
        level: 6,
        choices: [
          { id: 'shadow-ranger-6-hp', name: 'Survivor\'s Instinct', icon: '❤️', description: 'Danger has taught you to endure.', category: 'stat', statEffect: { health: 2 } },
          { id: 'shadow-ranger-6-damage-ap', name: 'Assassin\'s Edge', icon: '⚡', description: 'Deadlier strikes, faster moves.', category: 'stat', statEffect: { damage: 1, ap: 1 } },
        ],
      },
      {
        level: 7,
        choices: [
          { id: 'shadow-ranger-7-assassinate', name: 'Assassinate', icon: '🗡️', description: '1 AP: Deal triple damage from stealth.', category: 'ability' },
          { id: 'shadow-ranger-7-shadow-clone', name: 'Shadow Clone', icon: '👥', description: '1 AP: Create a decoy that absorbs all attacks for 1 round.', category: 'ability' },
        ],
      },
      {
        level: 8,
        choices: [
          { id: 'shadow-ranger-8-silent-kill', name: 'Silent Kill', icon: '🤫', description: 'Stealth kills don\'t reveal your position.', category: 'passive' },
          { id: 'shadow-ranger-8-evasion', name: 'Evasion', icon: '💨', description: 'Dodging costs 0 AP.', category: 'passive' },
        ],
      },
      {
        level: 9,
        choices: [
          { id: 'shadow-ranger-9-move-ap', name: 'Ghost Walker', icon: '👻', description: 'Faster and more agile than ever.', category: 'stat', statEffect: { move: 1, ap: 1 } },
          { id: 'shadow-ranger-9-damage', name: 'Venom Master', icon: '⚔️', description: 'Your weapons drip with deadly poison.', category: 'stat', statEffect: { damage: 2 } },
        ],
      },
      {
        level: 10,
        choices: [
          { id: 'shadow-ranger-10-death-shadows', name: 'Death From Shadows', icon: '🌟', description: '2 AP: Become fully invisible for 2 rounds. All attacks from stealth auto-crit. Once per combat.', category: 'ability' },
          { id: 'shadow-ranger-10-shadowstep-master', name: 'Shadowstep Master', icon: '🌀', description: '2 AP: Teleport to any zone and deal 4 damage to all enemies there. Once per combat.', category: 'ability' },
        ],
      },
    ],
  },

  // ===== MAGE / PYROMANCER =====
  {
    subclassId: 'pyromancer',
    levels: [
      {
        level: 2,
        choices: [
          { id: 'pyromancer-2-hp', name: 'Inner Fire', icon: '❤️', description: 'The flame within strengthens your body.', category: 'stat', statEffect: { health: 2 } },
          { id: 'pyromancer-2-ap', name: 'Arcane Spark', icon: '⭐', description: 'Your magical reserves grow.', category: 'stat', statEffect: { ap: 1 } },
        ],
      },
      {
        level: 3,
        choices: [
          { id: 'pyromancer-3-fire-bolt', name: 'Fire Bolt', icon: '🔥', description: '1 AP: Deal 3 fire damage at range. No limit on uses.', category: 'ability' },
          { id: 'pyromancer-3-ember-shield', name: 'Ember Shield', icon: '🛡️', description: '1 AP: All allies in your zone get +1 Armor this turn.', category: 'ability' },
        ],
      },
      {
        level: 4,
        choices: [
          { id: 'pyromancer-4-burning-touch', name: 'Burning Touch', icon: '🔥', description: 'Enemies who attack you in melee take 1 fire damage.', category: 'passive' },
          { id: 'pyromancer-4-mana-surge', name: 'Mana Surge', icon: '⭐', description: 'Your magical energy grows.', category: 'passive', statEffect: { ap: 1 } },
        ],
      },
      {
        level: 5,
        choices: [
          { id: 'pyromancer-5-fireball-splash', name: 'Fireball+', icon: '🔥', description: 'Fireball splash damage now hits enemies in 2 zones.', category: 'upgrade' },
          { id: 'pyromancer-5-inferno-damage', name: 'Inferno+', icon: '🔥', description: 'Inferno now deals 8 damage instead of 6.', category: 'upgrade' },
        ],
      },
      {
        level: 6,
        choices: [
          { id: 'pyromancer-6-hp', name: 'Flame Hardened', icon: '❤️', description: 'Fire has tempered your body.', category: 'stat', statEffect: { health: 3 } },
          { id: 'pyromancer-6-ap-armor', name: 'Arcane Ward', icon: '✨', description: 'More magic, better protection.', category: 'stat', statEffect: { ap: 1, armor: 1 } },
        ],
      },
      {
        level: 7,
        choices: [
          { id: 'pyromancer-7-meteor', name: 'Meteor', icon: '☄️', description: '2 AP: Deal 5 fire damage to all enemies in 2 zones.', category: 'ability' },
          { id: 'pyromancer-7-phoenix-flame', name: 'Phoenix Flame', icon: '🕊️', description: '1 AP: Heal an ally for 4 HP.', category: 'ability' },
        ],
      },
      {
        level: 8,
        choices: [
          { id: 'pyromancer-8-fire-mastery', name: 'Fire Mastery', icon: '🔥', description: 'All your fire spells deal +1 damage.', category: 'passive' },
          { id: 'pyromancer-8-heat-aura', name: 'Heat Aura', icon: '🌡️', description: 'Enemies in your zone take 1 fire damage per turn.', category: 'passive' },
        ],
      },
      {
        level: 9,
        choices: [
          { id: 'pyromancer-9-hp-armor', name: 'Molten Skin', icon: '🛡️', description: 'Your skin glows with protective fire.', category: 'stat', statEffect: { health: 2, armor: 1 } },
          { id: 'pyromancer-9-ap', name: 'Boundless Power', icon: '⭐', description: 'Your magical reserves become vast.', category: 'stat', statEffect: { ap: 2 } },
        ],
      },
      {
        level: 10,
        choices: [
          { id: 'pyromancer-10-volcanic', name: 'Volcanic Eruption', icon: '🌟', description: '3 AP: Deal 10 fire damage to ALL enemies on the battlefield. Once per combat.', category: 'ability' },
          { id: 'pyromancer-10-phoenix', name: 'Phoenix Rebirth', icon: '🔥', description: 'When knocked out, instantly revive at full HP and deal 4 fire damage to all nearby enemies. Once per combat.', category: 'ability' },
        ],
      },
    ],
  },

  // ===== MAGE / FROSTWEAVER =====
  {
    subclassId: 'frostweaver',
    levels: [
      {
        level: 2,
        choices: [
          { id: 'frostweaver-2-armor', name: 'Frost Shield', icon: '🛡️', description: 'Ice crystals form a protective barrier.', category: 'stat', statEffect: { armor: 1 } },
          { id: 'frostweaver-2-ap', name: 'Cold Focus', icon: '⭐', description: 'The chill sharpens your mind.', category: 'stat', statEffect: { ap: 1 } },
        ],
      },
      {
        level: 3,
        choices: [
          { id: 'frostweaver-3-frost-bolt', name: 'Frost Bolt', icon: '❄️', description: '1 AP: Deal 2 damage and freeze a target for 1 turn.', category: 'ability' },
          { id: 'frostweaver-3-ice-wall', name: 'Ice Wall', icon: '🧊', description: '1 AP: Block a zone entrance for 1 turn.', category: 'ability' },
        ],
      },
      {
        level: 4,
        choices: [
          { id: 'frostweaver-4-cold-aura', name: 'Cold Aura', icon: '❄️', description: 'Enemies in your zone have -1 Move.', category: 'passive' },
          { id: 'frostweaver-4-crystal-focus', name: 'Crystal Focus', icon: '⭐', description: 'Deep concentration expands your magic.', category: 'passive', statEffect: { ap: 1 } },
        ],
      },
      {
        level: 5,
        choices: [
          { id: 'frostweaver-5-blizzard-slow', name: 'Blizzard+', icon: '❄️', description: 'Blizzard now reduces enemy Move by 2.', category: 'upgrade' },
          { id: 'frostweaver-5-frost-armor-plus', name: 'Frost Armor+', icon: '🛡️', description: 'Frost Armor now grants +4 Armor instead of +3.', category: 'upgrade' },
        ],
      },
      {
        level: 6,
        choices: [
          { id: 'frostweaver-6-hp-armor', name: 'Glacial Body', icon: '🧊', description: 'Your body becomes tough as ice.', category: 'stat', statEffect: { health: 2, armor: 1 } },
          { id: 'frostweaver-6-ap', name: 'Frozen Wellspring', icon: '⭐', description: 'Your magical reserves double in depth.', category: 'stat', statEffect: { ap: 2 } },
        ],
      },
      {
        level: 7,
        choices: [
          { id: 'frostweaver-7-avalanche', name: 'Avalanche', icon: '🏔️', description: '2 AP: Deal 6 damage and push all enemies 1 zone.', category: 'ability' },
          { id: 'frostweaver-7-heal-frost', name: 'Healing Frost', icon: '💙', description: '1 AP: Heal an ally for 5 HP, but they skip their next turn.', category: 'ability' },
        ],
      },
      {
        level: 8,
        choices: [
          { id: 'frostweaver-8-frozen-heart', name: 'Frozen Heart', icon: '💎', description: 'You are immune to freeze and slow effects.', category: 'passive' },
          { id: 'frostweaver-8-ice-armor-aura', name: 'Ice Armor Aura', icon: '🛡️', description: 'All allies in your zone get +1 Armor.', category: 'passive' },
        ],
      },
      {
        level: 9,
        choices: [
          { id: 'frostweaver-9-hp', name: 'Permafrost Body', icon: '❤️', description: 'Ice reinforces every fiber of your being.', category: 'stat', statEffect: { health: 3 } },
          { id: 'frostweaver-9-ap-armor', name: 'Arctic Power', icon: '✨', description: 'More magic and better defenses.', category: 'stat', statEffect: { ap: 1, armor: 1 } },
        ],
      },
      {
        level: 10,
        choices: [
          { id: 'frostweaver-10-absolute-zero', name: 'Absolute Zero', icon: '🌟', description: '3 AP: Freeze ALL enemies for 2 full turns. Once per combat.', category: 'ability' },
          { id: 'frostweaver-10-ice-age', name: 'Ice Age', icon: '🧊', description: '3 AP: Deal 6 damage and reduce all enemies\' Move by 2 for 3 turns. Once per combat.', category: 'ability' },
        ],
      },
    ],
  },
];

// Skill tree lookup helpers
export function findSkill(skillId: string): Skill | undefined {
  for (const tree of SKILL_TREES) {
    for (const lvl of tree.levels) {
      const skill = lvl.choices.find(s => s.id === skillId);
      if (skill) return skill;
    }
  }
  return undefined;
}

export function getSkillTree(subclassId: string): SkillTree | undefined {
  return SKILL_TREES.find(t => t.subclassId === subclassId);
}

export function getSkillChoices(subclassId: string, level: number): Skill[] {
  const tree = getSkillTree(subclassId);
  if (!tree) return [];
  const lvl = tree.levels.find(l => l.level === level);
  return lvl?.choices ?? [];
}
