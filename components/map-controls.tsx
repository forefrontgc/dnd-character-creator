'use client';

import { MAP_THEMES, MAP_SIZES, type MapTheme, type MapSize, type MapType } from '@/lib/map-generator';

interface MapControlsProps {
  theme: MapTheme;
  setTheme: (t: MapTheme) => void;
  size: MapSize;
  setSize: (s: MapSize) => void;
  mapType: MapType;
  setMapType: (t: MapType) => void;
  onGenerate: () => void;
}

export function MapControls({ theme, setTheme, size, setSize, mapType, setMapType, onGenerate }: MapControlsProps) {
  return (
    <div className="space-y-6">
      {/* Map Type */}
      <div>
        <label className="block font-[family-name:var(--font-cinzel)] text-gold text-sm font-bold mb-2">Map Type</label>
        <div className="flex gap-3">
          <button
            onClick={() => setMapType('battle')}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold border-2 transition-all
              ${mapType === 'battle' ? 'bg-gold text-dark-bg border-gold' : 'bg-dark-card border-gold/30 text-white hover:border-gold/60'}`}
          >
            ⚔️ Battle Map
          </button>
          <button
            onClick={() => setMapType('zone')}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold border-2 transition-all
              ${mapType === 'zone' ? 'bg-gold text-dark-bg border-gold' : 'bg-dark-card border-gold/30 text-white hover:border-gold/60'}`}
          >
            🗺️ Zone Map
          </button>
        </div>
      </div>

      {/* Theme */}
      <div>
        <label className="block font-[family-name:var(--font-cinzel)] text-gold text-sm font-bold mb-2">Theme</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {MAP_THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all
                ${theme === t.id ? 'card-selected bg-dark-border/80' : 'bg-dark-card border-gold/20 hover:border-gold/50 cursor-pointer'}`}
            >
              <div className="text-xl mb-1">{t.icon}</div>
              <div className="text-gold font-semibold text-sm">{t.name}</div>
              <div className="text-white/40 text-xs">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Size (battle maps only) */}
      {mapType === 'battle' && (
        <div>
          <label className="block font-[family-name:var(--font-cinzel)] text-gold text-sm font-bold mb-2">Grid Size</label>
          <div className="flex gap-3">
            {MAP_SIZES.map(s => (
              <button
                key={s.id}
                onClick={() => setSize(s.id)}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm border-2 transition-all
                  ${size === s.id ? 'bg-gold text-dark-bg border-gold' : 'bg-dark-card border-gold/30 text-white hover:border-gold/60'}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        className="w-full px-6 py-4 rounded-xl bg-gold text-dark-bg font-[family-name:var(--font-cinzel)] font-bold text-lg hover:bg-gold-dark transition-all glow-pulse"
      >
        🎲 Generate Random Map
      </button>
    </div>
  );
}
