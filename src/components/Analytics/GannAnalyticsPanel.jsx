import { Zap, RotateCcw } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function GannAnalyticsPanel({ activeItem, onSimulateReaction, onResetPresets }) {
  const usedList = activeItem.usedLevels || [];

  const degreeStats = [
    { deg: '180° Major Reversal', hits: 14, accuracy: '89%', avgMove: '+3.82%', role: 'Primary Pivot' },
    { deg: '360° Full Cycle', hits: 11, accuracy: '91%', avgMove: '+4.45%', role: 'Heavy Rejection / Bounce' },
    { deg: '270° Strong Demand', hits: 9, accuracy: '82%', avgMove: '+2.95%', role: 'Harmonic Support/Res' },
    { deg: '90° Intermediate', hits: 16, accuracy: '76%', avgMove: '+1.48%', role: 'Scalp / Intraday Pivot' }
  ];

  return (
    <div className="space-y-3 font-mono">
      {/* Top 3 KPI Summary Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        <div className="p-2.5 sm:p-3 rounded-2xl bg-[#f6fbf8] border border-[#cce3d5]">
          <div className="text-[9px] sm:text-[10px] uppercase text-[#5c574f]">30D Win Rate</div>
          <div className="text-base sm:text-lg font-bold text-[#216e43] mt-0.5">
            {activeItem.winRatePct}%
          </div>
          <div className="text-[9px] text-[#6e685c] truncate">First-Touch</div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-2xl bg-[#fdfbf4] border border-[#e3cf96]">
          <div className="text-[9px] sm:text-[10px] uppercase text-[#5c574f]">Avg Reaction</div>
          <div className="text-base sm:text-lg font-bold text-[#b8860b] mt-0.5">
            +{activeItem.avgMovePct.toFixed(2)}%
          </div>
          <div className="text-[9px] text-[#6e685c] truncate">{usedList.length} Consumed</div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-2xl bg-[#fcfaf5] border border-[#e0d8c6]">
          <div className="text-[9px] sm:text-[10px] uppercase text-[#5c574f]">Harmonic</div>
          <div className="text-base sm:text-lg font-bold text-[#1e1d1a] mt-0.5 truncate">180°/360°</div>
          <div className="text-[9px] text-[#6e685c] truncate">Highest R:R</div>
        </div>
      </div>

      {/* Consumed ("USED") Reactions Breakdown */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#fcfaf5] border border-[#e2dac9] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1e1d1a]">
            Consumed ("USED") Degrees
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#efe9da] text-[#787266]">
            {usedList.length} Logged
          </span>
        </div>

        {usedList.length === 0 ? (
          <p className="text-xs text-[#787266] py-2 leading-relaxed">
            No consumed degrees in the immediate window yet. Use the Test Alert buttons to test degree consumption.
          </p>
        ) : (
          <div className="space-y-1.5">
            {usedList.map((u) => (
              <div
                key={u.id}
                className="p-2 rounded-xl bg-[#f7f4ec] border border-dashed border-[#d5cdbc] flex items-center justify-between text-[11px]"
              >
                <div>
                  <span className="font-bold text-[#b8860b]">{u.degree}°</span>
                  {activeItem.showCycleInRows && (
                    <span className="text-[#787266]"> · Cycle {u.cycle}</span>
                  )}{' '}
                  <span className="text-[#6e685c]">(${formatPrice(u.price)})</span>
                </div>
                <div
                  className="font-bold text-right"
                  style={{
                    color: u.reactionType === 'rejection' ? '#c94a46' : '#2e8b57'
                  }}
                >
                  {u.reactionType === 'rejection' ? 'Rejected' : 'Bounced'} ({u.reactionDate}) ·{' '}
                  {u.moveDollar >= 0 ? '+' : '-'}${formatPrice(Math.abs(u.moveDollar))} (
                  {u.movePct?.toFixed(2)}%)
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Reliability Table */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#fcfaf5] border border-[#e2dac9] space-y-2">
        <div className="text-xs font-bold text-[#1e1d1a]">
          Gann Degree Reliability
        </div>
        <div className="space-y-1">
          {degreeStats.map((row) => (
            <div
              key={row.deg}
              className="flex items-center justify-between text-[11px] py-1.5 border-b border-[#efe9da] last:border-none"
            >
              <div>
                <div className="font-bold text-[#1e1d1a]">{row.deg}</div>
                <div className="text-[10px] text-[#787266]">{row.role}</div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-[#e6f4ec] text-[#216e43] font-bold">
                  {row.accuracy}
                </span>
                <span className="ml-2 text-[#5c574f] font-semibold">{row.avgMove}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="p-3 rounded-2xl bg-[#f4efe2] border border-[#ded5c2] flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-stone-800">
          Simulate Reaction:
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSimulateReaction && onSimulateReaction('rejection')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#fdedec] text-[#b93834] border border-[#f3c4c2] hover:bg-[#fbd9d7] active:scale-95 transition flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            <span>R1 Rejection</span>
          </button>
          <button
            onClick={() => onSimulateReaction && onSimulateReaction('bounce')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#e6f4ec] text-[#226e44] border border-[#bce3cd] hover:bg-[#d3ecde] active:scale-95 transition flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            <span>B1 Bounce</span>
          </button>
          <button
            onClick={onResetPresets}
            className="p-1 rounded-lg bg-[#fcfaf5] text-stone-600 border border-[#dcd4c4] hover:bg-[#e7e0d2] active:scale-95 transition"
            title="Reset presets"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
