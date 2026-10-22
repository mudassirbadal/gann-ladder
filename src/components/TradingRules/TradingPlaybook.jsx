import { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Target,
  Zap,
  Sparkles
} from 'lucide-react';

export default function TradingPlaybook() {
  const [activeStep, setActiveStep] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);

  const steps = [
    {
      num: 1,
      title: 'Zone Identification: Wait for R1 or B1',
      badge: 'Step 1: Selection',
      icon: Target,
      summary: 'Only trade at the active primary Gann levels (R1 Rejection above or B1 Bounce below). Never enter random prices between zones.',
      details: [
        'R1 (Final Rejection Zone): The nearest untouched Gann degree above current price. Prime candidate for a SHORT / Rejection scalp or swing.',
        'B1 (Final Bounce Zone): The nearest untouched Gann degree below current price. Prime candidate for a LONG / Bounce entry.',
        'Proximity Band: Watch for price approaching within 0.15% to 0.20% of the exact Gann degree level.'
      ],
      tip: 'Cardinal Gann degrees (180° Major Reversal & 360° Full Cycle) have the highest institutional hit accuracy (85%+).'
    },
    {
      num: 2,
      title: '3-Point Confluence Confirmation',
      badge: 'Step 2: Filter',
      icon: CheckCircle2,
      summary: 'Do not blind-order. Confirm institutional absorption using the 3-point confluence check before executing.',
      details: [
        '1. Rejection Wick Ratio ≥ 50%: Look for a prominent wick on the 15m, 5m, or 3m candle touching the Gann level. A wick covering ≥ 50% of the candle range proves liquidity absorption.',
        '2. 14-Period RSI Confluence: For R1 Rejection, RSI should be Overbought (≥ 65-70). For B1 Bounce, RSI should be Oversold (≤ 30-35).',
        '3. Multi-Timeframe (★ MTF) Alignment: Check if the degree has the gold star badge, indicating alignment across 4H macro cycles and smaller intraday squares.'
      ],
      tip: 'When all 3 conditions align simultaneously, win rates exceed 84% based on historical backtests.'
    },
    {
      num: 3,
      title: 'Order Placement & Position Sizing',
      badge: 'Step 3: Execution',
      icon: ShieldAlert,
      summary: 'Tap any R or B row in the Gann Ladder to automatically compute your exact Limit Entry, Stop-Loss, and Take-Profit.',
      details: [
        'Limit Entry: Set directly at the Gann degree price ($).',
        'Structural Stop-Loss: Placed just beyond the NEXT outer Gann degree (or +0.85% / -0.85% buffer). This ensures your stop is backed by mathematical Gann structure rather than an arbitrary distance.',
        'Take-Profit 1 (TP1): Set at the opposing Gann zone (e.g., Short at R1 targets B1, yielding 1:2 to 1:3+ Risk-to-Reward).',
        'Take-Profit 2 (TP2): Next secondary extension level for trail runners.',
        'Risk Management: Risk only 1.0% to 2.0% of your total account balance per trade. Use the built-in position size calculator.'
      ],
      tip: 'Tap "Copy Plan" in the expanded row to instantly paste your full entry, stop, and TP parameters into your trading platform.'
    },
    {
      num: 4,
      title: 'The "USED" Degree Promotion Rule',
      badge: 'Step 4: Lifecycle',
      icon: Zap,
      summary: 'Once a Gann degree triggers a reaction (≥ 0.40%), it is consumed and marked USED. Never re-enter a USED degree on the same cycle!',
      details: [
        'Energy Discharge: In Gann Square of 9 theory, a degree price holds vibrational energy. Once tested and rejected, that energy is discharged.',
        'Automatic Promotion: The app immediately promotes the next untouched outer degree to R1 or B1.',
        'Strikethrough Display: Consumed levels show with a strikethrough, move distance, and reaction date in the ladder.',
        'Golden Rule: If price re-tests a "USED" degree, it is more likely to break through rather than bounce. Wait for the new R1 or B1!'
      ],
      tip: 'Track consumed reactions in the "Win-Rate & Analytics" tab to measure average move percentages per asset.'
    }
  ];

  const degreeRoles = [
    { deg: '0°', name: 'Base Anchor Pivot', role: 'Major Cycle Swing Low from which all Square of 9 levels originate.' },
    { deg: '90°', name: 'Intermediate Pivot', role: 'Quarter-cycle rotation. Reliable for intraday momentum scalps.' },
    { deg: '180°', name: 'Major Reversal Zone', role: 'Opposing half-cycle axis. Highest probability reversal pivot on the wheel.' },
    { deg: '270°', name: 'Strong Demand Zone', role: 'Three-quarter cycle. Powerful harmonic support / resistance.' },
    { deg: '360°', name: 'Full Cycle Completion', role: 'Completes 1 full Gann wheel rotation. Heavy institutional rejection zone.' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 mb-4 sm:mb-6">
      <div className="rounded-2xl border border-[#ded5c2] bg-[#fcfaf5] p-3.5 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
        {/* Header & Toggle */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#faf5e8] border border-[#d8be6c] flex items-center justify-center text-amber-800 shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 font-bold">
                  TRADING SYSTEM
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#f4efe2] text-stone-600 font-mono font-semibold">
                  Gann Square of 9
                </span>
              </div>
              <h3
                className="text-base sm:text-xl font-bold text-stone-900 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                How to Decide & Execute the Trade
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
            <span className="hidden xs:inline">{isExpanded ? 'Collapse' : 'Read Playbook'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-4 pt-1 border-t border-[#eee7d8] animate-in fade-in duration-200">
            {/* Quick 4-Step Tab Navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {steps.map((s) => (
                <button
                  key={s.num}
                  onClick={() => setActiveStep(s.num)}
                  className={`p-2 rounded-xl text-left transition-all border active:scale-95 ${
                    activeStep === s.num
                      ? 'bg-[#262420] text-[#fcfaf5] border-[#262420] shadow-sm'
                      : 'bg-[#faf7f0] text-stone-700 border-[#e5decb] hover:bg-[#f3ede0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold">
                      STEP {s.num}
                    </span>
                    <s.icon className={`w-3 h-3 ${activeStep === s.num ? 'text-amber-400' : 'text-stone-400'}`} />
                  </div>
                  <div className="text-[11px] font-semibold truncate mt-0.5">
                    {s.badge.replace(/^Step \d+: /, '')}
                  </div>
                </button>
              ))}
            </div>

            {/* Active Step Explanatory Card */}
            {(() => {
              const current = steps.find((s) => s.num === activeStep) || steps[0];
              const StepIcon = current.icon;
              return (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#faf7f0] border border-[#e2d8c4] space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#262420] text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                        {current.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                        {current.summary}
                      </p>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-1.5 pt-1 pl-1">
                    {current.details.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 leading-relaxed">
                        <span className="text-amber-700 font-bold mt-0.5 shrink-0">▸</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pro Tip Box */}
                  <div className="p-2.5 rounded-xl bg-[#fdfbf6] border border-[#ded5c0] flex items-start gap-2 text-[11px] text-[#786638]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-stone-800">Gann Pro Rule: </strong>
                      {current.tip}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Quick Visual Trade Flow: Short at R1 vs Long at B1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
              {/* Short Flow */}
              <div className="p-3 rounded-xl bg-[#fdfcfb] border border-[#e7c2c0] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#b93834]">
                  <TrendingDown className="w-4 h-4" />
                  <span>SHORT SETUP (R1 Rejection Zone)</span>
                </div>
                <div className="text-[11px] text-stone-600 space-y-0.5">
                  <div>1. Wait for price to reach <span className="font-bold text-[#b93834]">R1 Level</span></div>
                  <div>2. Confirm <strong>Upper Wick ≥ 50%</strong> + <strong>RSI ≥ 67</strong></div>
                  <div>3. Limit Short entry at R1 price</div>
                  <div>4. Stop-Loss placed above R2 (+0.85%)</div>
                  <div>5. Take Profit at B1 (+2.0R to +3.5R)</div>
                </div>
              </div>

              {/* Long Flow */}
              <div className="p-3 rounded-xl bg-[#fbfdfc] border border-[#bddbc9] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#216e43]">
                  <TrendingUp className="w-4 h-4" />
                  <span>LONG SETUP (B1 Bounce Zone)</span>
                </div>
                <div className="text-[11px] text-stone-600 space-y-0.5">
                  <div>1. Wait for price to reach <span className="font-bold text-[#216e43]">B1 Level</span></div>
                  <div>2. Confirm <strong>Lower Wick ≥ 50%</strong> + <strong>RSI ≤ 33</strong></div>
                  <div>3. Limit Long entry at B1 price</div>
                  <div>4. Stop-Loss placed below B2 (-0.85%)</div>
                  <div>5. Take Profit at R1 (+2.0R to +3.5R)</div>
                </div>
              </div>
            </div>

            {/* Gann Degree Cheat Sheet Table */}
            <div className="p-3 rounded-xl bg-[#faf7f0] border border-[#e2d8c4] space-y-2">
              <div className="text-xs font-bold text-stone-900 flex items-center justify-between">
                <span>Gann Degree Vibration Reference</span>
                <span className="text-[10px] text-stone-500 font-mono">Square of 9 Formula: (√Base + Deg/180)²</span>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
                {degreeRoles.map((d) => (
                  <div key={d.deg} className="p-2 rounded-lg bg-white border border-[#e5decb] text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#b8860b]">{d.deg}</span>
                      <span className="text-[10px] font-semibold text-stone-600">{d.name}</span>
                    </div>
                    <div className="text-[10px] text-stone-600 mt-1 leading-snug">
                      {d.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
