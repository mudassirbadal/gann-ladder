import { useState, useMemo, useEffect } from 'react';
import { Crosshair, Clock, Loader2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { generatePresetCandles } from '../../utils/gannMath';

const TIMEFRAMES = [
  { id: '1m', label: '1m' },
  { id: '3m', label: '3m' },
  { id: '5m', label: '5m' },
  { id: '15m', label: '15m' },
  { id: '1h', label: '1h' },
  { id: '4h', label: '4h' }
];

export default function GannCandlestickChart({
  activeItem,
  onSelectLevel,
  dataMode,
  fetchKlinesByInterval
}) {
  const [selectedTf, setSelectedTf] = useState('4h');
  const [hoverIdx, setHoverIdx] = useState(null);
  const [customCandles, setCustomCandles] = useState(null);
  const [isLoadingTf, setIsLoadingTf] = useState(false);

  // Fetch candles when timeframe or asset changes
  useEffect(() => {
    let ignore = false;
    const fetchTf = async () => {
      if (dataMode === 'live' && fetchKlinesByInterval && activeItem?.id) {
        setIsLoadingTf(true);
        const res = await fetchKlinesByInterval(activeItem.id, selectedTf, 40);
        if (!ignore) {
          setIsLoadingTf(false);
          if (res && res.length > 5) {
            setCustomCandles(res);
            return;
          }
        }
      }
      if (!ignore) {
        const syn = generatePresetCandles(activeItem, activeItem?.ladder, selectedTf);
        setCustomCandles(syn);
        setIsLoadingTf(false);
      }
    };
    fetchTf();
    return () => {
      ignore = true;
    };
  }, [dataMode, fetchKlinesByInterval, activeItem, selectedTf]);

  // Use custom timeframe candles if available, else fallback
  const candles = useMemo(() => {
    if (customCandles && customCandles.length > 0) return customCandles;
    return activeItem.chartCandles || [];
  }, [customCandles, activeItem.chartCandles]);

  const allLevels = useMemo(
    () => [
      ...(activeItem.ladder?.above || []),
      ...(activeItem.ladder?.below || [])
    ],
    [activeItem.ladder]
  );

  const { minPrice, maxPrice } = useMemo(() => {
    const cHighs = candles.map((c) => c.high);
    const cLows = candles.map((c) => c.low);
    const nearLevels = allLevels
      .filter((l) => l.rank !== 'R4' && l.rank !== 'B4')
      .map((l) => l.price);

    const allPts = [...cHighs, ...cLows, ...nearLevels, activeItem.priceNow].filter(Boolean);
    const rawMin = Math.min(...allPts);
    const rawMax = Math.max(...allPts);
    const pad = (rawMax - rawMin) * 0.08 || 10;
    return { minPrice: rawMin - pad, maxPrice: rawMax + pad };
  }, [candles, allLevels, activeItem.priceNow]);

  const width = 500;
  const height = 320;
  const padLeft = 8;
  const padRight = 72;
  const padTop = 14;
  const padBottom = 22;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const priceToY = (p) => {
    if (maxPrice <= minPrice) return height / 2;
    return padTop + ((maxPrice - p) / (maxPrice - minPrice)) * plotH;
  };

  const hoveredCandle =
    hoverIdx !== null && candles[hoverIdx] ? candles[hoverIdx] : candles[candles.length - 1];

  const handleTouchMove = (e) => {
    e.stopPropagation();
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const svgX = (touchX / rect.width) * width;
    const relX = svgX - padLeft;
    if (relX >= 0 && relX <= plotW && candles.length > 0) {
      const stepX = plotW / candles.length;
      const idx = Math.min(candles.length - 1, Math.max(0, Math.floor(relX / stepX)));
      setHoverIdx(idx);
    }
  };

  return (
    <div
      className="space-y-2.5 touch-none select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Timeframe Selector Bar */}
      <div className="flex items-center justify-between gap-1.5 p-1 rounded-xl bg-[#ede7d8] border border-[#d8d0be]">
        <div className="flex items-center gap-1 text-[10px] text-stone-600 font-mono pl-1.5 shrink-0">
          <Clock className="w-3 h-3 text-amber-700" />
          <span className="font-bold hidden xs:inline">Interval:</span>
        </div>

        <div className="grid grid-cols-6 gap-1 flex-1 max-w-[320px] ml-auto">
          {TIMEFRAMES.map((tf) => {
            const isActive = selectedTf === tf.id;
            return (
              <button
                key={tf.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTf(tf.id);
                }}
                className={`py-1 text-center rounded-lg text-[10px] sm:text-[11px] font-mono font-bold transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#262420] text-[#fcfaf5] shadow-xs'
                    : 'text-stone-700 hover:bg-[#ded6c3] bg-white/50'
                }`}
              >
                {tf.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top OHLC Inspection Bar */}
      <div
        className="p-2 sm:p-2.5 rounded-xl bg-[#f5f0e4] border border-[#e0d8c5] flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono shadow-xs"
      >
        <div className="flex items-center gap-1.5 font-bold text-[#1e1d1a]">
          <Crosshair className="w-3.5 h-3.5 text-amber-700" />
          <span>{selectedTf.toUpperCase()} Candles + Gann Grid</span>
          {isLoadingTf && <Loader2 className="w-3 h-3 animate-spin text-amber-700 ml-1" />}
        </div>
        {hoveredCandle && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-stone-700 flex-wrap">
            <span>O: ${formatPrice(hoveredCandle.open)}</span>
            <span>H: ${formatPrice(hoveredCandle.high)}</span>
            <span>L: ${formatPrice(hoveredCandle.low)}</span>
            <span className="font-bold text-stone-900">
              C: ${formatPrice(hoveredCandle.close)}
            </span>
          </div>
        )}
      </div>

      {/* Interactive SVG Plot */}
      <div
        className="rounded-2xl border border-[#dfd7c5] bg-[#fdfbf6] p-1 sm:p-2 overflow-hidden shadow-inner relative"
        style={{ touchAction: 'none' }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          style={{ touchAction: 'none' }}
          onMouseLeave={() => setHoverIdx(null)}
          onTouchStart={handleTouchMove}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setHoverIdx(null)}
        >
          {/* Horizontal Gann Degree Lines */}
          {allLevels.map((lvl) => {
            if (lvl.price < minPrice || lvl.price > maxPrice) return null;
            const y = priceToY(lvl.price);
            const isUsed = lvl.rank === 'USED' || lvl.used;
            const isR = lvl.rank && lvl.rank.startsWith('R');
            const isPrimary = lvl.rank === 'R1' || lvl.rank === 'B1';

            const strokeColor = isUsed
              ? '#9c9484'
              : isPrimary
              ? '#c59416'
              : isR
              ? '#c94a46'
              : '#2e8b57';

            return (
              <g
                key={lvl.id}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isUsed && onSelectLevel) onSelectLevel(lvl.id);
                }}
              >
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke={strokeColor}
                  strokeWidth={isPrimary ? 1.6 : 1}
                  strokeDasharray={isUsed ? '3 3' : isPrimary ? 'none' : '4 2'}
                  opacity={isUsed ? 0.55 : 0.85}
                />
                <rect
                  x={width - padRight + 2}
                  y={y - 7}
                  width={padRight - 4}
                  height={14}
                  rx={3}
                  fill={isUsed ? '#f0ebe0' : isR ? '#faeceb' : '#e6f4ec'}
                  stroke={strokeColor}
                  strokeWidth={0.7}
                />
                <text
                  x={width - padRight + 6}
                  y={y + 3}
                  fontSize="8.5"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                  fill={isUsed ? '#6e685c' : isR ? '#b93834' : '#216e43'}
                >
                  {lvl.rank} {lvl.degree}°
                </text>
              </g>
            );
          })}

          {/* Candlesticks */}
          {candles.map((c, idx) => {
            const stepX = plotW / Math.max(1, candles.length);
            const xCenter = padLeft + idx * stepX + stepX / 2;
            const candleW = Math.max(2.5, stepX * 0.62);
            const isBull = c.close >= c.open;
            const color = isBull ? '#2e8b57' : '#c94a46';

            const highY = priceToY(c.high);
            const lowY = priceToY(c.low);
            const openY = priceToY(c.open);
            const closeY = priceToY(c.close);

            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(1.5, Math.abs(closeY - openY));

            return (
              <g
                key={c.openTime || idx}
                onMouseEnter={() => setHoverIdx(idx)}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setHoverIdx(idx);
                }}
              >
                {/* Wick */}
                <line
                  x1={xCenter}
                  y1={highY}
                  x2={xCenter}
                  y2={lowY}
                  stroke={color}
                  strokeWidth={1}
                />
                {/* Body */}
                <rect
                  x={xCenter - candleW / 2}
                  y={bodyTop}
                  width={candleW}
                  height={bodyHeight}
                  fill={color}
                  rx={1}
                />
              </g>
            );
          })}

          {/* Current Price Marker */}
          {(() => {
            const curY = priceToY(activeItem.priceNow);
            if (curY < padTop || curY > height - padBottom) return null;
            return (
              <g>
                <line
                  x1={padLeft}
                  y1={curY}
                  x2={width - padRight}
                  y2={curY}
                  stroke="#d4ac2b"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                />
                <circle cx={width - padRight} cy={curY} r={3} fill="#d4ac2b" />
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}
