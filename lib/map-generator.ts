// ========== MAP GENERATOR ==========
// Procedural map generation using HTML Canvas

export type MapTheme = 'dungeon' | 'castle' | 'tavern' | 'graveyard' | 'forest' | 'cave';
export type MapSize = 'small' | 'medium' | 'large';
export type MapType = 'battle' | 'zone';

export const MAP_THEMES: { id: MapTheme; name: string; icon: string; desc: string }[] = [
  { id: 'dungeon', name: 'Dungeon', icon: '🏚️', desc: 'Stone walls, torches, treasure chests, traps' },
  { id: 'castle', name: 'Castle', icon: '🏰', desc: 'Throne room, hallways, guard posts, banners' },
  { id: 'tavern', name: 'Tavern', icon: '🍺', desc: 'Bar, tables, kitchen, upstairs rooms' },
  { id: 'graveyard', name: 'Graveyard', icon: '⚰️', desc: 'Headstones, crypts, fences, trees' },
  { id: 'forest', name: 'Forest Clearing', icon: '🌲', desc: 'Trees, rocks, stream, campfire' },
  { id: 'cave', name: 'Cave', icon: '🕳️', desc: 'Irregular walls, stalagmites, underground pool' },
];

export const MAP_SIZES: { id: MapSize; name: string; cells: number }[] = [
  { id: 'small', name: 'Small (8x8)', cells: 8 },
  { id: 'medium', name: 'Medium (12x12)', cells: 12 },
  { id: 'large', name: 'Large (16x16)', cells: 16 },
];

interface ThemeColors {
  floor: string;
  wall: string;
  accent: string;
  door: string;
  bg: string;
}

const THEME_COLORS: Record<MapTheme, ThemeColors> = {
  dungeon: { floor: '#4a4a3a', wall: '#2a2a2a', accent: '#8B6914', door: '#6B4226', bg: '#1a1a1a' },
  castle: { floor: '#5a5a4a', wall: '#3a3a3a', accent: '#c0a060', door: '#7B5B36', bg: '#2a2a2a' },
  tavern: { floor: '#6B4226', wall: '#4a3020', accent: '#c49b1a', door: '#8B6914', bg: '#3a2a1a' },
  graveyard: { floor: '#3a4a3a', wall: '#2a3a2a', accent: '#7a8a7a', door: '#5a6a5a', bg: '#1a2a1a' },
  forest: { floor: '#3a5a2a', wall: '#2a4a1a', accent: '#8ab060', door: '#6a8040', bg: '#1a3a0a' },
  cave: { floor: '#4a4a4a', wall: '#3a3030', accent: '#6a8aaa', door: '#5a7a9a', bg: '#2a2020' },
};

interface Room {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ThemeObject {
  x: number;
  y: number;
  icon: string;
}

const THEME_OBJECTS: Record<MapTheme, string[]> = {
  dungeon: ['🔥', '💀', '📦', '🕷️', '⚱️', '🗝️', '💎', '🪤'],
  castle: ['🏳️', '🪑', '👑', '🛡️', '⚔️', '🕯️', '📜', '🗡️'],
  tavern: ['🪑', '🍺', '🕯️', '🛢️', '🍖', '🎵', '🪵', '🧹'],
  graveyard: ['🪦', '⚰️', '🌳', '🦇', '🕯️', '🌙', '💀', '🕸️'],
  forest: ['🌳', '🪨', '🌿', '🍄', '🔥', '🦌', '🌺', '🪵'],
  cave: ['🪨', '💧', '💎', '🕷️', '🦇', '🔥', '⚱️', '🌊'],
};

// Seeded random number generator for reproducible maps
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 16807 + 0) % 2147483647;
    return this.seed / 2147483647;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

function generateRooms(rng: SeededRandom, gridSize: number): Room[] {
  const rooms: Room[] = [];
  const attempts = gridSize * 3;

  for (let i = 0; i < attempts; i++) {
    const w = rng.nextInt(2, Math.min(6, Math.floor(gridSize / 2)));
    const h = rng.nextInt(2, Math.min(5, Math.floor(gridSize / 2)));
    const x = rng.nextInt(1, gridSize - w - 1);
    const y = rng.nextInt(1, gridSize - h - 1);

    const room = { x, y, w, h };

    // Check for overlap
    const overlaps = rooms.some(r =>
      room.x < r.x + r.w + 1 && room.x + room.w + 1 > r.x &&
      room.y < r.y + r.h + 1 && room.y + room.h + 1 > r.y
    );

    if (!overlaps) {
      rooms.push(room);
    }
  }

  return rooms;
}

function connectRooms(grid: number[][], rooms: Room[], rng: SeededRandom): void {
  for (let i = 0; i < rooms.length - 1; i++) {
    const a = rooms[i];
    const b = rooms[i + 1];
    const ax = Math.floor(a.x + a.w / 2);
    const ay = Math.floor(a.y + a.h / 2);
    const bx = Math.floor(b.x + b.w / 2);
    const by = Math.floor(b.y + b.h / 2);

    // L-shaped corridor
    if (rng.next() > 0.5) {
      for (let x = Math.min(ax, bx); x <= Math.max(ax, bx); x++) grid[ay][x] = 1;
      for (let y = Math.min(ay, by); y <= Math.max(ay, by); y++) grid[y][bx] = 1;
    } else {
      for (let y = Math.min(ay, by); y <= Math.max(ay, by); y++) grid[y][ax] = 1;
      for (let x = Math.min(ax, bx); x <= Math.max(ax, bx); x++) grid[by][x] = 1;
    }
  }
}

export function generateBattleMap(
  ctx: CanvasRenderingContext2D,
  theme: MapTheme,
  gridSize: number,
  cellSize: number,
  seed: number,
): void {
  const rng = new SeededRandom(seed);
  const colors = THEME_COLORS[theme];
  const canvasSize = gridSize * cellSize;

  // Fill background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Generate rooms
  const grid: number[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  const rooms = generateRooms(rng, gridSize);

  // Carve rooms into grid
  for (const room of rooms) {
    for (let y = room.y; y < room.y + room.h; y++) {
      for (let x = room.x; x < room.x + room.w; x++) {
        if (y >= 0 && y < gridSize && x >= 0 && x < gridSize) {
          grid[y][x] = 1;
        }
      }
    }
  }

  // Connect rooms with corridors
  if (rooms.length > 1) {
    connectRooms(grid, rooms, rng);
  }

  // Draw cells
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const px = x * cellSize;
      const py = y * cellSize;

      if (grid[y][x] === 1) {
        // Floor
        ctx.fillStyle = colors.floor;
        ctx.fillRect(px, py, cellSize, cellSize);

        // Floor texture variation
        if (rng.next() > 0.7) {
          ctx.fillStyle = `rgba(0,0,0,0.1)`;
          ctx.fillRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
        }
      } else {
        // Wall
        ctx.fillStyle = colors.wall;
        ctx.fillRect(px, py, cellSize, cellSize);

        // Wall texture
        ctx.fillStyle = `rgba(255,255,255,0.03)`;
        ctx.fillRect(px + 1, py + 1, cellSize - 2, 1);
      }
    }
  }

  // Draw doors at room exits (where corridors meet rooms)
  for (const room of rooms) {
    const doorSpots = [
      { x: room.x - 1, y: Math.floor(room.y + room.h / 2) },
      { x: room.x + room.w, y: Math.floor(room.y + room.h / 2) },
      { x: Math.floor(room.x + room.w / 2), y: room.y - 1 },
      { x: Math.floor(room.x + room.w / 2), y: room.y + room.h },
    ];

    for (const spot of doorSpots) {
      if (spot.x >= 0 && spot.x < gridSize && spot.y >= 0 && spot.y < gridSize && grid[spot.y][spot.x] === 1) {
        const px = spot.x * cellSize;
        const py = spot.y * cellSize;
        ctx.fillStyle = colors.door;
        ctx.fillRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
      }
    }
  }

  // Place themed objects
  const objects: ThemeObject[] = [];
  const icons = THEME_OBJECTS[theme];

  for (const room of rooms) {
    const numObjects = rng.nextInt(1, 3);
    for (let i = 0; i < numObjects; i++) {
      const ox = rng.nextInt(room.x, room.x + room.w - 1);
      const oy = rng.nextInt(room.y, room.y + room.h - 1);
      const icon = icons[rng.nextInt(0, icons.length - 1)];
      objects.push({ x: ox, y: oy, icon });
    }
  }

  // Draw objects
  const fontSize = Math.max(12, cellSize * 0.6);
  ctx.font = `${fontSize}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const obj of objects) {
    const px = obj.x * cellSize + cellSize / 2;
    const py = obj.y * cellSize + cellSize / 2;
    ctx.fillText(obj.icon, px, py);
  }

  // Draw grid overlay
  ctx.strokeStyle = `rgba(255,255,255,0.15)`;
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= gridSize; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cellSize, 0);
    ctx.lineTo(x * cellSize, canvasSize);
    ctx.stroke();
  }
  for (let y = 0; y <= gridSize; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * cellSize);
    ctx.lineTo(canvasSize, y * cellSize);
    ctx.stroke();
  }

  // Border
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, canvasSize, canvasSize);
}

// ========== ZONE MAP ==========

interface ZoneArea {
  x: number;
  y: number;
  name: string;
  icon: string;
  radius: number;
}

const ZONE_AREAS: Record<MapTheme, { name: string; icon: string }[]> = {
  dungeon: [
    { name: 'Entrance', icon: '🚪' }, { name: 'Guard Room', icon: '⚔️' },
    { name: 'Treasury', icon: '💰' }, { name: 'Throne Room', icon: '👑' },
    { name: 'Prison', icon: '🔒' }, { name: 'Trap Hall', icon: '🪤' },
    { name: 'Armory', icon: '🛡️' }, { name: 'Boss Lair', icon: '💀' },
  ],
  castle: [
    { name: 'Gate', icon: '🏰' }, { name: 'Courtyard', icon: '⛲' },
    { name: 'Great Hall', icon: '👑' }, { name: 'Kitchen', icon: '🍖' },
    { name: 'Tower', icon: '🗼' }, { name: 'Barracks', icon: '🛡️' },
    { name: 'Library', icon: '📚' }, { name: 'Dungeon', icon: '🔒' },
  ],
  tavern: [
    { name: 'Main Hall', icon: '🍺' }, { name: 'Bar', icon: '🪵' },
    { name: 'Kitchen', icon: '🍖' }, { name: 'Cellar', icon: '🛢️' },
    { name: 'Back Room', icon: '🎲' }, { name: 'Stage', icon: '🎵' },
    { name: 'Upstairs', icon: '🛏️' }, { name: 'Stables', icon: '🐴' },
  ],
  graveyard: [
    { name: 'Iron Gate', icon: '🚪' }, { name: 'Old Graves', icon: '🪦' },
    { name: 'Mausoleum', icon: '⚰️' }, { name: 'Chapel', icon: '⛪' },
    { name: 'Crypt', icon: '💀' }, { name: 'Statue', icon: '🗿' },
    { name: 'Dead Tree', icon: '🌳' }, { name: 'Open Grave', icon: '🕳️' },
  ],
  forest: [
    { name: 'Camp', icon: '🔥' }, { name: 'Stream', icon: '🌊' },
    { name: 'Dense Woods', icon: '🌳' }, { name: 'Rocky Hill', icon: '🪨' },
    { name: 'Clearing', icon: '🌿' }, { name: 'Old Ruins', icon: '🏚️' },
    { name: 'Animal Den', icon: '🦌' }, { name: 'Mushroom Ring', icon: '🍄' },
  ],
  cave: [
    { name: 'Entrance', icon: '🕳️' }, { name: 'Narrow Pass', icon: '🪨' },
    { name: 'Cavern', icon: '💎' }, { name: 'Underground Pool', icon: '🌊' },
    { name: 'Spider Den', icon: '🕷️' }, { name: 'Crystal Room', icon: '💠' },
    { name: 'Bat Roost', icon: '🦇' }, { name: 'Deep Pit', icon: '⚫' },
  ],
};

export function generateZoneMap(
  ctx: CanvasRenderingContext2D,
  theme: MapTheme,
  canvasSize: number,
  seed: number,
): void {
  const rng = new SeededRandom(seed);
  const colors = THEME_COLORS[theme];
  const areas = ZONE_AREAS[theme];
  const numAreas = rng.nextInt(5, Math.min(8, areas.length));
  const padding = 60;

  // Background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Add subtle background texture
  for (let i = 0; i < 200; i++) {
    const x = rng.next() * canvasSize;
    const y = rng.next() * canvasSize;
    ctx.fillStyle = `rgba(255,255,255,${rng.next() * 0.03})`;
    ctx.beginPath();
    ctx.arc(x, y, rng.next() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Place zones in a loose circular layout
  const zones: ZoneArea[] = [];
  const centerX = canvasSize / 2;
  const centerY = canvasSize / 2;

  for (let i = 0; i < numAreas; i++) {
    const angle = (i / numAreas) * Math.PI * 2 + rng.next() * 0.5;
    const dist = (canvasSize / 2 - padding) * (0.3 + rng.next() * 0.6);
    const x = centerX + Math.cos(angle) * dist;
    const y = centerY + Math.sin(angle) * dist;
    const area = areas[i];
    zones.push({
      x,
      y,
      name: area.name,
      icon: area.icon,
      radius: 30 + rng.next() * 15,
    });
  }

  // Draw paths between connected zones
  ctx.strokeStyle = `rgba(${parseInt(colors.accent.slice(1, 3), 16)},${parseInt(colors.accent.slice(3, 5), 16)},${parseInt(colors.accent.slice(5, 7), 16)},0.4)`;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 4]);

  for (let i = 0; i < zones.length; i++) {
    const next = (i + 1) % zones.length;
    ctx.beginPath();
    ctx.moveTo(zones[i].x, zones[i].y);
    ctx.lineTo(zones[next].x, zones[next].y);
    ctx.stroke();

    // Some cross-connections
    if (i + 2 < zones.length && rng.next() > 0.6) {
      ctx.beginPath();
      ctx.moveTo(zones[i].x, zones[i].y);
      ctx.lineTo(zones[i + 2].x, zones[i + 2].y);
      ctx.stroke();
    }
  }
  ctx.setLineDash([]);

  // Draw zone circles and labels
  for (const zone of zones) {
    // Glow
    const gradient = ctx.createRadialGradient(zone.x, zone.y, 0, zone.x, zone.y, zone.radius + 10);
    gradient.addColorStop(0, `rgba(${parseInt(colors.accent.slice(1, 3), 16)},${parseInt(colors.accent.slice(3, 5), 16)},${parseInt(colors.accent.slice(5, 7), 16)},0.3)`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.radius + 10, 0, Math.PI * 2);
    ctx.fill();

    // Circle
    ctx.fillStyle = colors.floor;
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Icon
    ctx.font = `${zone.radius * 0.7}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(zone.icon, zone.x, zone.y - 2);

    // Label
    ctx.font = `bold 11px "Inter", sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Label background
    const textWidth = ctx.measureText(zone.name).width;
    ctx.fillStyle = `rgba(0,0,0,0.7)`;
    ctx.fillRect(zone.x - textWidth / 2 - 4, zone.y + zone.radius + 4, textWidth + 8, 18);

    ctx.fillStyle = colors.accent;
    ctx.fillText(zone.name, zone.x, zone.y + zone.radius + 7);
  }

  // Title
  ctx.font = `bold 16px "Cinzel", serif`;
  ctx.fillStyle = colors.accent;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const themeInfo = MAP_THEMES.find(t => t.id === theme);
  ctx.fillText(`${themeInfo?.icon} ${themeInfo?.name} — Zone Map`, canvasSize / 2, 12);

  // Border
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, canvasSize, canvasSize);
}
