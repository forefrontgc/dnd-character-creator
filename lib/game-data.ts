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
