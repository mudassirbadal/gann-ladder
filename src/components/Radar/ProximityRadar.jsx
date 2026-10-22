import { Radio, AlertTriangle } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function ProximityRadar({ activeItem, onOpenSetup }) {
  if (!activeItem || !activeItem.ladder) return null;

  const r1 = activeItem.ladder.r1;
  const b1 = activeItem.ladder.b1;
  const priceNow = activeItem.priceNow;

  const r1DistPct = r1 ? ((r1.price - priceNow) / priceNow) * 100 : 999;
  const b1DistPct = b1 ? ((priceNow - b1.price) / priceNow) * 100 : 999;

  const isR1Closer = r1DistPct <= b1DistPct;
  const target = isR1Closer ? r1 : b1;
  const targetType = isR1Closer ? 'R1 Rejection' : 'B1 Bounce';
  const distPct = isR1Closer ? r1DistPct : b1DistPct;
  const distDollar = target ? Math.abs(target.price - priceNow) : 0;

  // Status thresholds:
  // <= 0.18%: LOCK (in execution pocket)
  // <= 0.40%: APPROACHING
  // > 0.40%: IN ORBIT
  const isLock = distPct <= 0.18;
  const isApproaching = distPct > 0.18 && distPct <= 0.40;

  return (
    <div
      onClick={onOpenSetup}
      className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer active:scale-[0.99] select-none ${
        isLock
          ? 'bg-[#faeceb] border-[#e6a8a5] shadow-md ring-2 ring-red-500/30'
          : isApproaching
          ? 'bg-[#fdf8ea] border-[#e5cf96] shadow-xs'
          : 'bg-[#faf7f0] border-[#e2d8c4]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Radar Icon & Status */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 relative ${
              isLock
                ? 'bg-red-600 text-white animate-pulse'
                : isApproaching
                ? 'bg-amber-600 text-white'
                : 'bg-[#262420] text-amber-400'
            }`}
          >
            <Radio className="w-4 h-4" />
            {isLock && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-mono">
              <span
                className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider ${
                  isLock
                    ? 'bg-red-700 text-white'
                    : isApproaching
                    ? 'bg-amber-700 text-white'
                    : 'bg-[#ebe4d3] text-stone-700'
                }`}
              >
                {isLock ? 'RADAR LOCK' : isApproaching ? 'APPROACHING' : 'IN ORBIT'}
              </span>
              <span className="text-[11px] font-bold text-stone-800 truncate">
                {activeItem.ticker.split('/')[0]} ➔ {targetType}
              </span>
            </div>

            <div className="text-[11px] text-stone-600 truncate mt-0.5 font-mono">
              Target: <strong className="text-stone-900">${target ? formatPrice(target.price) : '—'}</strong> ({target ? `${target.degree}°` : ''})
            </div>
          </div>
        </div>

        {/* Proximity Distance Metrics */}
        <div className="text-right shrink-0 font-mono">
          <div
            className={`text-xs sm:text-sm font-bold flex items-center justify-end gap-1 ${
              isLock ? 'text-red-700' : isApproaching ? 'text-amber-800' : 'text-stone-800'
            }`}
          >
            {isLock && <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-bounce" />}
            <span>{distPct.toFixed(2)}% away</span>
          </div>

          <div className="text-[10px] text-stone-500 mt-0.5">
            ${formatPrice(distDollar)} distance
          </div>
        </div>
      </div>
    </div>
  );
}
