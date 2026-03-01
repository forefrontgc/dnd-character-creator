'use client';

import { useRef, useEffect, useCallback } from 'react';
import { generateBattleMap, generateZoneMap, MAP_SIZES, type MapTheme, type MapSize, type MapType } from '@/lib/map-generator';

interface MapCanvasProps {
  theme: MapTheme;
  size: MapSize;
  mapType: MapType;
  seed: number;
}

export function MapCanvas({ theme, size, mapType, seed }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (mapType === 'battle') {
      const sizeInfo = MAP_SIZES.find(s => s.id === size);
      const gridSize = sizeInfo?.cells || 12;
      // 96 DPI target: 1 inch = 96px for screen. Each cell = 1 inch at print.
      const cellSize = 48; // 48px per cell on screen, scales to 1 inch on print
      const canvasSize = gridSize * cellSize;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      generateBattleMap(ctx, theme, gridSize, cellSize, seed);
    } else {
      const canvasSize = 576; // 6x6 inches at 96 DPI
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      generateZoneMap(ctx, theme, canvasSize, seed);
    }
  }, [theme, size, mapType, seed]);

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

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>D&D Map</title>
        <style>
          @page { size: letter landscape; margin: 0.5in; }
          body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          img { width: ${gridInches}in; height: ${gridInches}in; image-rendering: pixelated; }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" />
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
      <button
        onClick={handlePrint}
        className="px-6 py-3 rounded-xl bg-gold text-dark-bg font-[family-name:var(--font-cinzel)] font-bold hover:bg-gold-dark transition-all"
      >
        🖨️ Print Map
      </button>
    </div>
  );
}
