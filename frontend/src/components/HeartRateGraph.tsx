import { useEffect, useRef } from 'react';
import { HeartRateZone } from '../types';

interface HeartRateGraphProps {
  history: number[];
  currentZone: HeartRateZone;
}

const ZONE_COLORS: Record<HeartRateZone, string> = {
  resting: '#10b981',
  'fat-burn': '#3b82f6',
  cardio: '#f59e0b',
  peak: '#ef4444',
};

const ZONE_Y_RANGES: Record<HeartRateZone, { min: number; max: number }> = {
  resting: { min: 60, max: 94 },
  'fat-burn': { min: 95, max: 114 },
  cardio: { min: 115, max: 154 },
  peak: { min: 155, max: 200 },
};

export function HeartRateGraph({ history, currentZone }: HeartRateGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);

    const minHR = 60;
    const maxHR = 200;

    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    for (const zone of Object.keys(ZONE_Y_RANGES) as HeartRateZone[]) {
      const range = ZONE_Y_RANGES[zone];
      const yMin = height - ((range.min - minHR) / (maxHR - minHR)) * height;
      const yMax = height - ((range.max - minHR) / (maxHR - minHR)) * height;

      ctx.fillStyle = ZONE_COLORS[zone] + '15';
      ctx.fillRect(0, yMax, width, yMin - yMax);

      ctx.beginPath();
      ctx.moveTo(0, yMin);
      ctx.lineTo(width, yMin);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    if (history.length < 2) return;

    ctx.strokeStyle = ZONE_COLORS[currentZone];
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();

    const pointSpacing = width / (history.length - 1);

    history.forEach((hr, index) => {
      const x = index * pointSpacing;
      const y = height - ((hr - minHR) / (maxHR - minHR)) * height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    const lastHR = history[history.length - 1];
    const lastX = width;
    const lastY = height - ((lastHR - minHR) / (maxHR - minHR)) * height;

    ctx.fillStyle = ZONE_COLORS[currentZone];
    ctx.beginPath();
    ctx.arc(lastX - 5, lastY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(lastX - 5, lastY, 5, 0, Math.PI * 2);
    ctx.stroke();
  }, [history, currentZone]);

  return (
    <div className="w-full bg-gray-800 rounded-lg p-4 shadow-lg">
      <h3 className="text-white text-lg font-semibold mb-3">Live Heart Rate Monitor</h3>
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="w-full h-auto rounded border-2 border-gray-700"
      />
      <div className="mt-4 grid grid-cols-4 gap-2">
        {Object.entries(ZONE_COLORS).map(([zone, color]) => (
          <div key={zone} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
            <span className="text-sm text-gray-300 capitalize">
              {zone.replace('-', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
