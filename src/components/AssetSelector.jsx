import { formatPrice } from '../utils/formatters';
import { Zap, RotateCcw, TrendingUp, TrendingDown, Layers } from 'lucide-react';

export default function AssetSelector({
  computedLadders,
  selectedSymbol,
  onSelectSymbol,
  isModalOpen,
  onSimulateReaction,
  onResetPresets
}) {
  const assetsList = Object.values(computedLadders);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 mb-3 sm:mb-4">
      <div className="flex flex-col gap-2.5 bg-[#fcfaf5] p-3 sm:p-3.5 rounded-2xl border border-[#e0d8c6] shadow-sm">
        {/* Section Header with Coin Count & Test Alert Triggers */}
        <div className="flex items-center justify-between gap-2 pb-1 border-b border-[#ede7d8] flex-wrap">
          <div className="flex items-center gap-1.5 font-mono">
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-[11px] sm:text-xs font-bold text-stone-800 uppercase tracking-wider">
              Active Watchlist ({assetsList.length} Coins)
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap ml-auto">
            <span className="text-[10px] text-stone-500 font-mono hidden xs:inline">
              Simulate:
            </span>
            <button
              onClick={() => onSimulateReaction('rejection')}
              className="px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold bg-[#fdedec] text-[#b93834] border border-[#f3c4c2] hover:bg-[#fbd9d7] active:scale-95 transition flex items-center gap-1 font-mono"
              title="Simulate price rejecting from R1 Final Rejection Zone"
            >
              <Zap className="w-3 h-3" />
              <span>R1 Rejection</span>
            </button>
            <button
              onClick={() => onSimulateReaction('bounce')}
              className="px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold bg-[#e6f4ec] text-[#226e44] border border-[#bce3cd] hover:bg-[#d3ecde] active:scale-95 transition flex items-center gap-1 font-mono"
              title="Simulate price bouncing from B1 Final Bounce Zone"
            >
              <Zap className="w-3 h-3" />
              <span>B1 Bounce</span>
            </button>
            <button
              onClick={onResetPresets}
              className="p-1 rounded-lg bg-[#f3efe6] text-stone-600 border border-[#ded6c4] hover:bg-[#e7e0d2] active:scale-95 transition"
              title="Reset presets"
              aria-label="Reset presets"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5-Coin Fully Visible Grid (NO HORIZONTAL SCROLLING ON MOBILE) */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 pt-0.5">
          {assetsList.map((item, index) => {
            const active = selectedSymbol === item.id && isModalOpen;
            const isNegative = item.change24h < 0;
            // On a 2-column mobile layout, make the 5th item span 2 columns so it fits symmetrically
            const isFifthOnTwoCol = index === 4;

            return (
              <button
                key={item.id}
                onClick={() => onSelectSymbol(item.id)}
                className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all active:scale-[0.98] flex items-center justify-between gap-2 ${
                  isFifthOnTwoCol ? 'col-span-2 xs:col-span-1' : ''
                } ${
                  active
                    ? 'bg-[#262420] text-[#fcfaf5] border-[#262420] shadow-md ring-2 ring-[#c59416]/70'
                    : 'bg-[#faf7f0] text-stone-800 border-[#e2dac9] hover:bg-[#f3ede0] hover:border-[#d6cbb3]'
                }`}
              >
                {/* Coin Badge & Name */}
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs font-mono"
                    style={{ backgroundColor: item.badgeColor }}
                  >
                    {item.symbolBadge}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-xs truncate leading-tight flex items-center gap-1">
                      <span>{item.name}</span>
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4ac2b] animate-ping" />
                      )}
                    </div>
                    <div
                      className={`text-[10px] font-mono leading-none mt-0.5 truncate ${
                        active ? 'text-stone-300' : 'text-stone-500'
                      }`}
                    >
                      {item.ticker.split('/')[0]}
                    </div>
                  </div>
                </div>

                {/* Coin Price & 24h Change */}
                <div className="text-right shrink-0 pl-1 font-mono">
                  <div className="font-bold text-xs leading-tight">
                    ${formatPrice(item.priceNow)}
                  </div>
                  <div
                    className={`text-[9px] sm:text-[10px] font-semibold mt-0.5 flex items-center justify-end gap-0.5 ${
                      isNegative
                        ? active
                          ? 'text-red-300'
                          : 'text-red-600'
                        : active
                        ? 'text-emerald-300'
                        : 'text-emerald-600'
                    }`}
                  >
                    {isNegative ? (
                      <TrendingDown className="w-2.5 h-2.5" />
                    ) : (
                      <TrendingUp className="w-2.5 h-2.5" />
                    )}
                    <span>
                      {isNegative ? '-' : '+'}{Math.abs(item.change24h).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
