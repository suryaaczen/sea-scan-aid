import { useEffect, useRef, useState } from 'react';

interface ScaleCalibratorProps {
  onScaleChange?: (pxPerCm: number) => void;
}

const ScaleCalibrator = ({ onScaleChange }: ScaleCalibratorProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [p1, setP1] = useState<{ x: number; y: number }>({ x: 100, y: 100 });
  const [p2, setP2] = useState<{ x: number; y: number }>({ x: 220, y: 100 });
  const [dragging, setDragging] = useState<null | 'p1' | 'p2'>(null);
  const [realCm, setRealCm] = useState<number>(10);

  const getBounds = () => overlayRef.current?.getBoundingClientRect();

  const startDrag = (
    e: React.MouseEvent | React.TouchEvent,
    point: 'p1' | 'p2'
  ) => {
    e.preventDefault();
    setDragging(point);
  };

  const onMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging) return;
    const bounds = getBounds();
    if (!bounds) return;

    let clientX: number, clientY: number;
    if (e instanceof TouchEvent) {
      clientX = e.touches[0]?.clientX ?? 0;
      clientY = e.touches[0]?.clientY ?? 0;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    const x = Math.max(0, Math.min(bounds.width, clientX - bounds.left));
    const y = Math.max(0, Math.min(bounds.height, clientY - bounds.top));

    if (dragging === 'p1') setP1({ x, y });
    else setP2({ x, y });
  };

  const endDrag = () => setDragging(null);

  useEffect(() => {
    const move = (e: any) => onMove(e);
    const up = () => endDrag();

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('touchend', up);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchmove', move as any);
      document.removeEventListener('touchend', up);
    };
  }, [dragging]);

  const pxLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const pxPerCm = realCm > 0 ? pxLen / realCm : 0;

  useEffect(() => {
    if (onScaleChange && realCm > 0) onScaleChange(pxPerCm);
  }, [pxPerCm, realCm, onScaleChange]);

  return (
    <div ref={overlayRef} className="absolute inset-0 z-10 select-none">
      <svg className="w-full h-full">
        <line
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          stroke="hsl(var(--primary))"
          strokeWidth={3}
        />
        <circle
          cx={p1.x}
          cy={p1.y}
          r={8}
          fill="hsl(var(--primary))"
          onMouseDown={(e) => startDrag(e, 'p1')}
          onTouchStart={(e) => startDrag(e, 'p1')}
        />
        <circle
          cx={p2.x}
          cy={p2.y}
          r={8}
          fill="hsl(var(--primary))"
          onMouseDown={(e) => startDrag(e, 'p2')}
          onTouchStart={(e) => startDrag(e, 'p2')}
        />
      </svg>

      <div className="absolute top-2 left-2 bg-background/90 border border-border rounded-md px-3 py-2 text-xs shadow">
        <div className="flex items-center gap-2">
          <label className="text-muted-foreground">Real length (cm)</label>
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={realCm}
            onChange={(e) => setRealCm(parseFloat(e.target.value) || 0)}
            className="w-20 bg-transparent border rounded px-2 py-1"
          />
        </div>
        <div className="mt-1 text-muted-foreground">
          <span>Line: {pxLen.toFixed(1)} px</span>
          <span className="ml-2">Scale: {pxPerCm ? pxPerCm.toFixed(2) : '—'} px/cm</span>
        </div>
      </div>
    </div>
  );
};

export default ScaleCalibrator;
