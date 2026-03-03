'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { generateBattleMap, generateZoneMap, MAP_SIZES, type MapTheme, type MapSize, type MapType, type MapObject } from '@/lib/map-generator';

interface MapCanvasProps {
  theme: MapTheme;
  size: MapSize;
  mapType: MapType;
  seed: number;
  enabledItems: Set<string>;
}

export function MapCanvas({ theme, size, mapType, seed, enabledItems }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [keyItems, setKeyItems] = useState<MapObject[]>([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (mapType === 'battle') {
      const sizeInfo = MAP_SIZES.find(s => s.id === size);
      const gridSize = sizeInfo?.cells || 12;
      const cellSize = 48;
      const canvasSize = gridSize * cellSize;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const { usedObjects } = generateBattleMap(ctx, theme, gridSize, cellSize, seed, enabledItems);
      setKeyItems(usedObjects);
    } else {
      const canvasSize = 576;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const { usedZones } = generateZoneMap(ctx, theme, canvasSize, seed, enabledItems);
      setKeyItems(usedZones);
    }
  }, [theme, size, mapType, seed, enabledItems]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const sizeInfo = MAP_SIZES.find(s => s.id === size);
    const gridInches = mapType === 'battle' ? (sizeInfo?.cells || 12) : 6;

    // Build key HTML for print
    const keyHtml = keyItems.length > 0 ? `
      <div style="margin-top: 16px; padding: 12px 16px; border: 2px solid #8B6914; border-radius: 8px; background: #f5f0e6; max-width: ${gridInches}in;">
        <div style="font-family: 'Cinzel', serif; font-weight: bold; font-size: 11pt; color: #2c1810; margin-bottom: 8px; border-bottom: 1px solid #c4a46a; padding-bottom: 4px;">MAP KEY</div>
        <div style="display: flex; flex-wrap: wrap; gap: 4px 16px;">
          ${keyItems.map(item => `
            <div style="display: flex; align-items: center; gap: 6px; font-size: 10pt; min-width: 120px;">
              <span style="font-size: 14pt;">${item.icon}</span>
              <span style="color: #2c1810;">${item.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>D&D Map</title>
        <style>
          @page { size: letter landscape; margin: 0.5in; }
          body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
          img { width: ${gridInches}in; height: ${gridInches}in; image-rendering: pixelated; }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" />
        ${keyHtml}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="overflow-auto max-w-full rounded-xl border-2 border-gold/30">
        <canvas ref={canvasRef} style={{ imageRendering: 'pixelated' }} />
      </div>

      {/* Map Key */}
      {keyItems.length > 0 && (
        <div className="w-full max-w-lg bg-dark-card rounded-xl border-2 border-gold/30 p-4">
          <h3 className="font-[family-name:var(--font-cinzel)] text-gold text-sm font-bold mb-3 border-b border-gold/20 pb-2">MAP KEY</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {keyItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-lg">{item.icon}</span>
                <span className="text-white/70">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handlePrint}
        className="px-6 py-3 rounded-xl bg-gold text-dark-bg font-[family-name:var(--font-cinzel)] font-bold hover:bg-gold-dark transition-all"
      >
        🖨️ Print Map
      </button>
    </div>
  );
}
