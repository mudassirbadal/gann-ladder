import { formatPrice } from '../utils/formatters';
import { Zap, RotateCcw } from 'lucide-react';

export default function AssetSelector({
  computedLadders,
  selectedSymbol,
  onSelectSymbol,
  isModalOpen,
  onSimulateReaction,
  onResetPresets
}) {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 mb-3 sm:mb-4">
      <div className="flex flex-col gap-2.5 bg-[#fcfaf5] p-2.5 sm:p-3 rounded-2xl border border-[#e0d8c6] shadow-sm">
        {/* Horizontal scrollable asset pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {Object.values(computedLadders).map((item) => {
            const active = selectedSymbol === item.id && isModalOpen;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSymbol(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 border active:scale-95 ${
                  active
                    ? 'bg-[#262420] text-[#fcfaf5] border-[#262420] shadow-sm'
                    : 'bg-[#f4f0e6] text-stone-700 border-[#e2dac9] hover:bg-[#eae3d3]'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: item.badgeColor }}
                >
                  {item.symbolBadge}
                </span>
                <span className="whitespace-nowrap">{item.name}</span>
                <span
                  className="opacity-80 text-[11px] whitespace-nowrap"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  ${formatPrice(item.priceNow)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Reaction Simulator Bar */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#ede7d8] flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-mono">
            <span className="font-semibold text-stone-700">Test Alert:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => onSimulateReaction('rejection')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#fdedec] text-[#b93834] border border-[#f3c4c2] hover:bg-[#fbd9d7] active:scale-95 transition flex items-center gap-1"
              title="Simulate price rejecting from R1 Final Rejection Zone"
            >
              <Zap className="w-3 h-3" />
              <span>Simulate R1</span>
            </button>
            <button
              onClick={() => onSimulateReaction('bounce')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#e6f4ec] text-[#226e44] border border-[#bce3cd] hover:bg-[#d3ecde] active:scale-95 transition flex items-center gap-1"
              title="Simulate price bouncing from B1 Final Bounce Zone"
            >
              <Zap className="w-3 h-3" />
              <span>Simulate B1</span>
            </button>
            <button
              onClick={onResetPresets}
              className="p-1 rounded-lg bg-[#f3efe6] text-stone-600 border border-[#ded6c4] hover:bg-[#e7e0d2] active:scale-95 transition"
              title="Reset to default screenshot presets"
              aria-label="Reset presets"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
