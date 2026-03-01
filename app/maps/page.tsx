'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MapTheme, MapSize, MapType } from '@/lib/map-generator';
import { MapCanvas } from '@/components/map-canvas';
import { MapControls } from '@/components/map-controls';

export default function MapsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<MapTheme>('dungeon');
  const [size, setSize] = useState<MapSize>('medium');
  const [mapType, setMapType] = useState<MapType>('battle');
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 999999));

  const handleGenerate = () => {
    setSeed(Math.floor(Math.random() * 999999));
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-[family-name:var(--font-body)]">
      {/* Header */}
      <header className="bg-gradient-to-r from-dark-card via-dark-bg to-dark-card border-b-2 border-gold/30 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-gold/60 hover:text-gold transition-colors font-[family-name:var(--font-cinzel)] font-bold">
            ← Home
          </button>
          <h1 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl text-gold font-bold tracking-wide">
            🗺️ Map Generator
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
          {/* Controls */}
          <div className="order-2 lg:order-1">
            <MapControls
              theme={theme}
              setTheme={setTheme}
              size={size}
              setSize={setSize}
              mapType={mapType}
              setMapType={setMapType}
              onGenerate={handleGenerate}
            />
          </div>

          {/* Map Preview */}
          <div className="order-1 lg:order-2">
            <MapCanvas
              theme={theme}
              size={size}
              mapType={mapType}
              seed={seed}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
