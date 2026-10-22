import { BookOpen, X, CheckCircle2, TrendingUp, TrendingDown, Target, ShieldAlert, Zap } from 'lucide-react';

export default function RulesDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-end"
      style={{ backgroundColor: 'rgba(30, 29, 26, 0.45)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg h-full p-4 sm:p-5 overflow-y-auto shadow-2xl space-y-4 bg-[#fcfaf5] border-l border-[#dfd7c6]"
      >
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#e5decb]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <h3
              className="text-lg sm:text-xl font-bold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Gann Trading Rules & Playbook
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-stone-900 rounded-lg"
            aria-label="Close playbook"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-stone-700 leading-relaxed">
          {/* Step 1 */}
          <div className="p-3.5 rounded-2xl bg-[#faf7f0] border border-[#e2d8c4] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
              <Target className="w-4 h-4 text-amber-700" />
              <span>Step 1: Wait for R1 or B1 Proximity</span>
            </div>
            <p>
              In Gann theory, trade only at the extreme harmonic boundaries. Never take trades in the dead space between levels.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-stone-600">
              <li><strong>R1 (Final Rejection Zone)</strong>: Nearest untouched Gann degree above current price. Candidate for Short entries.</li>
              <li><strong>B1 (Final Bounce Zone)</strong>: Nearest untouched Gann degree below current price. Candidate for Long entries.</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-2xl bg-[#faf7f0] border border-[#e2d8c4] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Step 2: 3-Point Confluence Confirmation</span>
            </div>
            <p>
              Before pulling the trigger, confirm institutional absorption:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-stone-600">
              <li><strong>Rejection Wick ≥ 50%</strong>: A long wick covering at least half of the 15m or 5m candle touching the level.</li>
              <li><strong>RSI Filter</strong>: Overbought (≥ 67) for R1 Short; Oversold (≤ 33) for B1 Long.</li>
              <li><strong>★ MTF Confluence</strong>: Indicates alignment across 4H macro and smaller intraday cycle squares.</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-2xl bg-[#faf7f0] border border-[#e2d8c4] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>Step 3: Execution & Position Sizing</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1 text-stone-600">
              <li><strong>Limit Entry</strong>: Set right at the Gann level price.</li>
              <li><strong>Stop-Loss</strong>: Structural stop placed beyond the next outer Gann degree (or +0.85% / -0.85%).</li>
              <li><strong>Take-Profit (TP1)</strong>: Opposite Gann zone (Shorting R1 targets B1 bounce for a 1:2 to 1:3+ R:R).</li>
              <li><strong>Risk Per Trade</strong>: Never risk more than 1% to 2% of total account capital.</li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-2xl bg-[#faf7f0] border border-[#e2d8c4] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
              <Zap className="w-4 h-4 text-amber-700" />
              <span>Step 4: The "USED" Degree Rule</span>
            </div>
            <p>
              Once a degree level is tested and reacts away by ≥ 0.40%, that degree is marked <span className="font-mono font-bold text-stone-800 bg-[#efe9da] px-1 rounded">USED</span> and discharged.
            </p>
            <p className="text-amber-800 font-semibold">
              Never re-enter a USED degree on the same cycle! Wait for the newly promoted R1 or B1.
            </p>
          </div>

          {/* Visual Flows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#faeceb] border border-[#e7c2c0] text-[#b93834] space-y-1">
              <div className="flex items-center gap-1 font-bold">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Short Protocol (R1)</span>
              </div>
              <div className="text-[10px] space-y-0.5 text-stone-700">
                <div>Entry: R1 Price</div>
                <div>SL: Next R level (+0.85%)</div>
                <div>TP: B1 Bounce Zone</div>
                <div>Filter: Upper Wick ≥ 50%</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#e6f4ec] border border-[#bddbc9] text-[#216e43] space-y-1">
              <div className="flex items-center gap-1 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Long Protocol (B1)</span>
              </div>
              <div className="text-[10px] space-y-0.5 text-stone-700">
                <div>Entry: B1 Price</div>
                <div>SL: Next B level (-0.85%)</div>
                <div>TP: R1 Rejection Zone</div>
                <div>Filter: Lower Wick ≥ 50%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
