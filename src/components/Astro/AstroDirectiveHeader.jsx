import { useMemo } from 'react';
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  Zap,
  Compass
} from 'lucide-react';
import { formatHourClock } from '../../utils/astroMath';

const SCENARIOS = [
  { id: 'bearish_short', label: '♄ Bearish Hora (Short)', desc: 'Saturn pressure' },
  { id: 'auto',          label: '☉ Live Ephemeris',        desc: 'Real-time sky' },
  { id: 'bullish_long',  label: '♃ Bullish Hora (Long)',   desc: 'Jupiter lift' },
  { id: 'voc_veto',      label: '☽ Moon VoC Veto',         desc: 'No trade' }
];

export default function AstroDirectiveHeader({
  astroState,
  astroOverride,
  setAstroOverride,
  confluenceSignal
}) {
  const activeHora = astroState?.activeHora;
  const nextHora = astroState?.nextHora;
  const voc = astroState?.voc;
  const nakshatra = astroState?.nakshatra;
  const compositeScore = astroState?.compositeScore;

  // Determine market regime & trade side
  const regimeInfo = useMemo(() => {
    if (!astroState) return null;

    if (voc?.isVoC) {
      return {
        regimeLabel: 'MOON VOID-OF-COURSE VETO',
        tradeSide: 'STAND ASIDE (NO TRADE)',
        theme: 'amber',
        bgGradient: 'from-amber-500/15 to-amber-600/5',
        borderColor: 'border-amber-400',
        textColor: 'text-amber-900',
        badgeBg: 'bg-amber-600 text-white',
        icon: AlertTriangle,
        ruleSummary: 'Moon makes no applying Ptolemaic aspects before changing signs. High fakeout rate on breakout & trend trades.'
      };
    }

    if (compositeScore <= 46 || activeHora?.bias?.tag === 'fall') {
      return {
        regimeLabel: 'BEARISH DOWNSIDE REGIME',
        tradeSide: 'FAVOR: SHORT ONLY',
        theme: 'rose',
        bgGradient: 'from-rose-500/15 to-red-500/5',
        borderColor: 'border-rose-400',
        textColor: 'text-rose-950',
        badgeBg: 'bg-[#a8434d] text-white',
        icon: TrendingDown,
        ruleSummary: `Heavy ${activeHora?.planet?.name || 'Saturn'} Hora pressure. Fade Gann Resistance levels (R1/R2) with tight stop losses.`
      };
    }

    if (compositeScore >= 54 || activeHora?.bias?.tag === 'rise') {
      return {
        regimeLabel: 'BULLISH EXPANSION REGIME',
        tradeSide: 'FAVOR: LONG ONLY',
        theme: 'emerald',
        bgGradient: 'from-emerald-500/15 to-emerald-600/5',
        borderColor: 'border-emerald-400',
        textColor: 'text-emerald-950',
        badgeBg: 'bg-[#287a48] text-white',
        icon: TrendingUp,
        ruleSummary: `Supportive ${activeHora?.planet?.name || 'Jupiter'} Hora energy. Target long bounces from Gann Support levels (B1/B2).`
      };
    }

    return {
      regimeLabel: 'BALANCED CONSOLIDATION REGIME',
      tradeSide: 'SELECTIVE LEVEL SCALPS',
      theme: 'stone',
      bgGradient: 'from-stone-500/15 to-stone-600/5',
      borderColor: 'border-stone-400',
      textColor: 'text-stone-900',
      badgeBg: 'bg-stone-700 text-white',
      icon: Compass,
      ruleSummary: 'Neutral planetary bias. Trade strictly between R1 and B1 boundaries with wick confirmation.'
    };
  }, [astroState, voc, compositeScore, activeHora]);

  // Hora Countdown & Turn-Time computation
  const horaMetrics = useMemo(() => {
    if (!astroState || !activeHora) {
      return { pctElapsed: 50, minsLeft: 30, turnTimeStr: '--:--', isFlip: false };
    }

    const totalHoraHours = (activeHora.endHr || 1) - (activeHora.startHr || 0);
    const totalHoraMins = Math.max(30, Math.round(totalHoraHours * 60));
    const minsLeft = Math.max(1, activeHora.minsRemaining || 30);
    const minsElapsed = Math.max(0, totalHoraMins - minsLeft);
    const pctElapsed = Math.min(100, Math.max(0, Math.round((minsElapsed / totalHoraMins) * 100)));

    const turnTimeStr = activeHora.endHr ? `${formatHourClock(activeHora.endHr)} IST` : '--:--';

    // Is there a directional flip between current Hora and next Hora?
    const currentTag = activeHora.bias?.tag || 'neutral';
    const nextTag = nextHora?.bias?.tag || 'neutral';
    const isFlip = currentTag !== nextTag && currentTag !== 'neutral' && nextTag !== 'neutral';

    return {
      pctElapsed,
      minsLeft,
      totalHoraMins,
      turnTimeStr,
      isFlip,
      currentTag,
      nextTag
    };
  }, [astroState, activeHora, nextHora]);

  if (!astroState || !regimeInfo) return null;

  const RegimeIcon = regimeInfo.icon;

  return (
    <div className="w-full space-y-2 font-mono">
      {/* 1. SIMPLIFIED ASTRO DIRECTIVE HEADER */}
      <div
        className={`p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r ${regimeInfo.bgGradient} border-2 ${regimeInfo.borderColor} shadow-xs transition-all`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-black/10">
          {/* Regime Badge & Directional Action */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-xs ${regimeInfo.badgeBg}`}
            >
              <RegimeIcon className="w-3.5 h-3.5" />
              <span>{regimeInfo.regimeLabel}</span>
            </span>

            <span
              className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black tracking-wider border uppercase flex items-center gap-1 ${
                regimeInfo.theme === 'rose'
                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : regimeInfo.theme === 'emerald'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              <span>{confluenceSignal?.side || regimeInfo.tradeSide}</span>
            </span>

            {confluenceSignal?.confidence > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/90 border border-stone-300 text-stone-800 shadow-2xs">
                {confluenceSignal.confidence}% Confluence
              </span>
            )}
          </div>

          {/* Nakshatra & Composite Pill */}
          <div className="flex items-center gap-1.5 text-[10px] text-stone-600 self-start sm:self-auto">
            <span className="px-2 py-0.5 rounded-lg bg-white/80 border border-stone-300 font-semibold text-stone-800">
              ✦ {nakshatra?.name || 'Hasta'} ({nakshatra?.info?.name || 'Sun'})
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-white/80 border border-stone-300 font-semibold text-stone-800">
              Graha: {compositeScore}/100
            </span>
          </div>
        </div>

        {/* Narrative & Practical Rule */}
        <div className="mt-2 text-xs sm:text-sm font-bold text-stone-900 leading-snug">
          {confluenceSignal?.headline || regimeInfo.ruleSummary}
        </div>
        <div className="mt-1 text-[10px] sm:text-[11px] text-stone-600 leading-normal">
          {confluenceSignal?.subtext || regimeInfo.ruleSummary}
        </div>
      </div>

      {/* 2. HORA COUNTDOWN & TURN-TIME BAR */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-[#faf7f0] border border-[#e0d6c3] shadow-xs space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Active Hora Details */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
              {activeHora?.planet?.glyph || '♄'}
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <span>{activeHora?.planet?.name || 'Saturn'} Hora</span>
                <span className="text-[10px] text-stone-500 font-normal">
                  ({activeHora?.bias?.label || 'Bearish'} · {activeHora?.bias?.base || 76}% Bias)
                </span>
              </div>
            </div>
          </div>

          {/* Countdown & Turn-Time Stamp */}
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-[#cfc5b0] text-stone-800 font-bold shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>{horaMetrics.minsLeft}m left</span>
            </div>

            <div className="px-2 py-0.5 rounded-lg bg-[#262420] text-amber-300 font-bold text-[10px] shadow-2xs">
              Turn-Time: {horaMetrics.turnTimeStr}
            </div>
          </div>
        </div>

        {/* Visual Progress Countdown Bar */}
        <div className="w-full">
          <div className="h-2 rounded-full bg-[#ded6c3] overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                activeHora?.bias?.tag === 'fall'
                  ? 'bg-gradient-to-r from-rose-500 to-red-600'
                  : activeHora?.bias?.tag === 'rise'
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-600'
              }`}
              style={{ width: `${horaMetrics.pctElapsed}%` }}
            />
          </div>
        </div>

        {/* Flip Alert Banner */}
        {nextHora && (
          <div
            className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-bold ${
              horaMetrics.isFlip
                ? 'bg-amber-50 border-amber-300 text-amber-950 animate-pulse'
                : 'bg-white/80 border-[#d8cfbc] text-stone-700'
            }`}
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              <Zap
                className={`w-3.5 h-3.5 ${
                  horaMetrics.isFlip ? 'text-amber-700 animate-bounce' : 'text-stone-400'
                }`}
              />
              <span className="uppercase tracking-wider">
                {horaMetrics.isFlip ? '⚡ ENERGY FLIP ALERT:' : 'Upcoming Shift:'}
              </span>
              <span className="font-mono text-stone-900">
                {activeHora?.planet?.glyph} {activeHora?.planet?.name} ({activeHora?.bias?.label})
              </span>
              <ArrowRight className="w-3 h-3 text-stone-400" />
              <span
                className={`font-mono px-1.5 py-0.2 rounded font-black ${
                  nextHora?.bias?.tag === 'rise'
                    ? 'bg-emerald-100 text-emerald-800'
                    : nextHora?.bias?.tag === 'fall'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-stone-100 text-stone-800'
                }`}
              >
                {nextHora?.planet?.glyph} {nextHora?.planet?.name} ({nextHora?.bias?.label || 'Shift'})
              </span>
            </div>

            <span className="text-[10px] font-mono text-stone-500 shrink-0">
              at {horaMetrics.turnTimeStr}
            </span>
          </div>
        )}

        {/* Scenario Simulator Strip */}
        <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#e8dfcf] flex-wrap text-[10px]">
          <span className="text-stone-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-700" />
            <span>Simulate Planetary Hora:</span>
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {SCENARIOS.map((opt) => {
              const active = astroOverride === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setAstroOverride(opt.id)}
                  className={`px-2 py-0.5 rounded-lg font-bold font-mono transition-all active:scale-95 ${
                    active
                      ? 'bg-[#262420] text-amber-300 shadow-xs ring-1 ring-amber-400'
                      : 'bg-white text-stone-700 border border-[#d5ccb8] hover:bg-[#efe9dc]'
                  }`}
                  title={opt.desc}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
