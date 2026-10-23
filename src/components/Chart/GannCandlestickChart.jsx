import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Crosshair,
  Clock,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
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
  fetchKlinesByInterval,
  confluenceSignal
}) {
  const [selectedTf, setSelectedTf] = useState('4h');
  const [hoverIdx, setHoverIdx] = useState(null);
  const [customCandles, setCustomCandles] = useState(null);
  const [isLoadingTf, setIsLoadingTf] = useState(false);

  // Zoom & Pan state (zoom: 1x to 4x)
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState(0);

  const touchStateRef = useRef({
    startDist: null,
    startX: null,
    initialZoom: 1,
    initialPan: 0,
    isPinch: false
  });

  // Fetch candles when timeframe or asset changes
  useEffect(() => {
    let ignore = false;
    const fetchTf = async () => {
      if (dataMode === 'live' && fetchKlinesByInterval && activeItem?.id) {
        setIsLoadingTf(true);
        const res = await fetchKlinesByInterval(activeItem.id, selectedTf, 50);
        if (!ignore) {
          setIsLoadingTf(false);
          if (res && res.length > 5) {
            setCustomCandles(res);
            setPanOffset(0);
            return;
          }
        }
      }
      if (!ignore) {
        const syn = generatePresetCandles(activeItem, activeItem?.ladder, selectedTf);
        setCustomCandles(syn);
        setPanOffset(0);
        setIsLoadingTf(false);
      }
    };
    fetchTf();
    return () => {
      ignore = true;
    };
  }, [dataMode, fetchKlinesByInterval, activeItem, selectedTf]);

  const allCandles = useMemo(() => {
    if (customCandles && customCandles.length > 0) return customCandles;
    return activeItem.chartCandles || [];
  }, [customCandles, activeItem.chartCandles]);

  // Windowed visible candles according to zoom & pan
  const totalCount = allCandles.length;
  const visibleCount = Math.max(8, Math.min(totalCount, Math.round(totalCount / zoom)));
  const maxPan = Math.max(0, totalCount - visibleCount);
  const clampedPan = Math.max(0, Math.min(maxPan, panOffset));
  const startIndex = Math.max(0, totalCount - visibleCount - clampedPan);
  const visibleCandles = allCandles.slice(startIndex, startIndex + visibleCount);

  const allLevels = useMemo(
    () => [
      ...(activeItem.ladder?.above || []),
      ...(activeItem.ladder?.below || [])
    ],
    [activeItem.ladder]
  );

  // Vertical scale auto-fit to visible candles
  const { minPrice, maxPrice } = useMemo(() => {
    const cHighs = visibleCandles.map((c) => c.high);
    const cLows = visibleCandles.map((c) => c.low);
    const nearLevels = allLevels
      .filter((l) => l.rank !== 'R4' && l.rank !== 'B4')
      .map((l) => l.price);

    const allPts = [...cHighs, ...cLows, ...nearLevels, activeItem.priceNow].filter(Boolean);
    const rawMin = Math.min(...allPts);
    const rawMax = Math.max(...allPts);
    const pad = (rawMax - rawMin) * 0.08 || 10;
    return { minPrice: rawMin - pad, maxPrice: rawMax + pad };
  }, [visibleCandles, allLevels, activeItem.priceNow]);

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
    hoverIdx !== null && visibleCandles[hoverIdx]
      ? visibleCandles[hoverIdx]
      : visibleCandles[visibleCandles.length - 1];

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((z) => Math.min(3.5, Number((z + 0.35).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(1, Number((z - 0.35).toFixed(2)));
      if (next === 1) setPanOffset(0);
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPanOffset(0);
  };

  // Inspect touch helper
  const handleInspectTouch = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const svgX = (touchX / rect.width) * width;
    const relX = svgX - padLeft;
    if (relX >= 0 && relX <= plotW && visibleCandles.length > 0) {
      const stepX = plotW / visibleCandles.length;
      const idx = Math.min(visibleCandles.length - 1, Math.max(0, Math.floor(relX / stepX)));
      setHoverIdx(idx);
    }
  };

  // Touch gesture handler (pinch zoom & drag pan)
  const handleTouchStart = (e) => {
    e.stopPropagation();
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStateRef.current = {
        startDist: dist,
        startX: null,
        initialZoom: zoom,
        initialPan: clampedPan,
        isPinch: true
      };
    } else if (e.touches.length === 1) {
      touchStateRef.current = {
        startDist: null,
        startX: e.touches[0].clientX,
        initialZoom: zoom,
        initialPan: clampedPan,
        isPinch: false
      };
      handleInspectTouch(e);
    }
  };

  const handleTouchMove = (e) => {
    e.stopPropagation();
    if (e.touches.length === 2 && touchStateRef.current.isPinch) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / (touchStateRef.current.startDist || dist);
      const nextZoom = Math.max(
        1,
        Math.min(3.5, Number((touchStateRef.current.initialZoom * ratio).toFixed(2)))
      );
      setZoom(nextZoom);
    } else if (e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - (touchStateRef.current.startX || e.touches[0].clientX);
      if (Math.abs(deltaX) > 20 && zoom > 1) {
        const panShift = Math.round(deltaX / 12);
        setPanOffset((prev) => Math.max(0, Math.min(maxPan, prev + panShift)));
        touchStateRef.current.startX = e.touches[0].clientX;
      }
      handleInspectTouch(e);
    }
  };

  // Desktop mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  return (
    <div
      className="space-y-2 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Timeframe & Zoom Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 p-1.5 rounded-xl bg-[#ede7d8] border border-[#d8d0be]">
        {/* Interval Selector (1-Tap 6-Pill Switcher for Mobile & Desktop) */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-1 text-[10px] text-stone-600 font-mono pl-1 shrink-0">
            <Clock className="w-3 h-3 text-amber-700" />
            <span className="font-bold hidden xs:inline">TF:</span>
          </div>

          <div className="grid grid-cols-6 gap-0.5 sm:gap-1 flex-1 sm:max-w-[280px]">
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
                      ? 'bg-[#262420] text-[#fcfaf5] shadow-xs ring-1 ring-[#c59416]'
                      : 'text-stone-700 hover:bg-[#ded6c3] bg-white/60 border border-[#d8d0be]'
                  }`}
                  title={`${tf.label} Candle Timeframe`}
                >
                  {tf.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zoom & Pan Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#ded6c3] font-mono text-[10px]">
          <span className="text-stone-500 font-bold px-1 sm:hidden">Zoom:</span>

          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className={`p-1 sm:px-1.5 rounded-lg border flex items-center gap-0.5 active:scale-95 transition ${
                zoom <= 1
                  ? 'opacity-40 bg-stone-200 text-stone-400 border-transparent cursor-not-allowed'
                  : 'bg-white text-stone-700 border-[#d0c6b2] hover:bg-[#f6f2e8]'
              }`}
              title="Zoom out (see more candles)"
            >
              <ZoomOut className="w-3 h-3" />
              <span className="text-[9px] font-bold">-</span>
            </button>

            <span className="px-1.5 py-0.5 rounded bg-white/70 border border-[#d8d0be] text-stone-800 font-bold min-w-[38px] text-center">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3.5}
              className={`p-1 sm:px-1.5 rounded-lg border flex items-center gap-0.5 active:scale-95 transition ${
                zoom >= 3.5
                  ? 'opacity-40 bg-stone-200 text-stone-400 border-transparent cursor-not-allowed'
                  : 'bg-white text-stone-700 border-[#d0c6b2] hover:bg-[#f6f2e8]'
              }`}
              title="Zoom in (magnify candles & wicks)"
            >
              <ZoomIn className="w-3 h-3" />
              <span className="text-[9px] font-bold">+</span>
            </button>

            {zoom > 1 && maxPan > 0 && (
              <div className="flex items-center gap-0.5 ml-0.5">
                <button
                  onClick={() => setPanOffset((p) => Math.min(maxPan, p + 4))}
                  disabled={clampedPan >= maxPan}
                  className="p-1 rounded-lg bg-white border border-[#d0c6b2] text-stone-700 disabled:opacity-40 active:scale-95"
                  title="Pan left in history"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setPanOffset((p) => Math.max(0, p - 4))}
                  disabled={clampedPan <= 0}
                  className="p-1 rounded-lg bg-white border border-[#d0c6b2] text-stone-700 disabled:opacity-40 active:scale-95"
                  title="Pan right toward latest"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {(zoom > 1 || panOffset > 0) && (
              <button
                onClick={handleResetZoom}
                className="p-1 px-1.5 rounded-lg bg-[#262420] text-white flex items-center gap-1 active:scale-95 transition ml-0.5 text-[9px]"
                title="Reset zoom to 100%"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Fit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top OHLC Inspection Bar */}
      <div
        className="p-2 sm:p-2.5 rounded-xl bg-[#f5f0e4] border border-[#e0d8c5] flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono shadow-xs"
      >
        <div className="flex items-center gap-1.5 font-bold text-[#1e1d1a]">
          <Crosshair className="w-3.5 h-3.5 text-amber-700" />
          <span>{selectedTf.toUpperCase()} Candles ({visibleCandles.length} in view)</span>
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

      {/* Interactive SVG Plot with Zoom & Pan */}
      <div
        className="rounded-2xl border border-[#dfd7c5] bg-[#fdfbf6] p-1 sm:p-2 overflow-hidden shadow-inner relative touch-none"
        onWheel={handleWheel}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          style={{ touchAction: 'none' }}
          onMouseLeave={() => setHoverIdx(null)}
          onTouchStart={handleTouchStart}
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
          {visibleCandles.map((c, idx) => {
            const stepX = plotW / Math.max(1, visibleCandles.length);
            const xCenter = padLeft + idx * stepX + stepX / 2;
            const candleW = Math.max(3.0, stepX * 0.68);
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
                  strokeWidth={zoom > 1.8 ? 1.5 : 1}
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

          {/* Astro Vector Trajectory Path */}
          {confluenceSignal && visibleCandles.length > 0 && (() => {
            const lastCandleIdx = visibleCandles.length - 1;
            const stepX = plotW / Math.max(1, visibleCandles.length);
            const startX = padLeft + lastCandleIdx * stepX + stepX / 2;
            const startY = priceToY(activeItem.priceNow);
            const isShortPath = confluenceSignal.downsideSignal;
            const targetPrice = isShortPath
              ? (activeItem.ladder.b1?.price || activeItem.priceNow * 0.98)
              : (activeItem.ladder.r1?.price || activeItem.priceNow * 1.02);
            const targetY = priceToY(targetPrice);
            const strokeColor = isShortPath ? '#c94a46' : '#2e8b57';
            const arrowEndX = Math.min(width - padRight - 8, startX + 42);

            return (
              <g className="pointer-events-none">
                <line
                  x1={startX}
                  y1={startY}
                  x2={arrowEndX}
                  y2={targetY}
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  opacity="0.85"
                />
                <circle cx={arrowEndX} cy={targetY} r="3.5" fill={strokeColor} />
                <rect
                  x={arrowEndX - 72}
                  y={(startY + targetY) / 2 - 8}
                  width="70"
                  height="16"
                  rx="3.5"
                  fill={isShortPath ? '#fdedec' : '#e6f4ec'}
                  stroke={strokeColor}
                  strokeWidth="0.8"
                />
                <text
                  x={arrowEndX - 37}
                  y={(startY + targetY) / 2 + 3.5}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                  fill={strokeColor}
                >
                  {isShortPath ? '↘ ASTRO SHORT' : '↗ ASTRO LONG'}
                </text>
              </g>
            );
          })()}
        </svg>

        {/* Pinch / Pan Hint */}
        <div className="flex items-center justify-between text-[9px] text-stone-500 font-mono pt-1 px-1">
          <span>Pinch or scroll to Zoom · Drag to inspect</span>
          {zoom > 1 && <span className="text-amber-800 font-bold">Zoomed {Math.round(zoom * 100)}%</span>}
        </div>
      </div>
    </div>
  );
}
