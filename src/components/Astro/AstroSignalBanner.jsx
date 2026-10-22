import { Sparkles, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

const SCENARIOS = [
  { id: 'bearish_short', label: '♄ Bearish Hora (Short)' },
  { id: 'auto',          label: '☉ Live Ephemeris' },
  { id: 'bullish_long',  label: '♃ Bullish Hora (Long)' },
  { id: 'voc_veto',      label: '☽ Moon VoC Veto' }
];

export default function AstroSignalBanner({
  astroState,
  astroOverride,
  setAstroOverride,
  confluenceSignal
}) {
  if (!astroState || !confluenceSignal) return null;

  const isFall = confluenceSignal.badgeType === 'fall';
  const isRise = confluenceSignal.badgeType === 'rise';

  return (
    <div className="space-y-2 mb-3 font-mono">
      {/* Astro Scenario Selector Bar */}
      <div className="flex items-center justify-between flex-wrap gap-1.5 px-3 py-1.5 rounded-xl bg-[#f4efe2] border border-[#ded5c2] text-xs">
        <span className="text-stone-600 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Graha Chakra Scenario:</span>
        </span>
        <div className="flex items-center gap-1 flex-wrap">
          {SCENARIOS.map((opt) => {
            const active = astroOverride === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setAstroOverride(opt.id)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition active:scale-95 ${
                  active
                    ? 'bg-[#b3822f] text-white shadow-2xs'
                    : 'bg-white text-stone-700 border border-[#d8d0be] hover:bg-[#ede7d6]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Astro-Gann Directional Signal Decision Banner */}
      <div
        className={`p-3 rounded-2xl border transition-all ${
          isFall
            ? 'bg-gradient-to-br from-rose-50/90 to-rose-100/40 border-rose-300 text-stone-900 shadow-xs'
            : isRise
            ? 'bg-gradient-to-br from-emerald-50/90 to-emerald-100/40 border-emerald-300 text-stone-900 shadow-xs'
            : 'bg-gradient-to-br from-amber-50/90 to-amber-100/40 border-amber-300 text-stone-900 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-1.5 pb-1 border-b border-black/5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full text-white tracking-wider flex items-center gap-1 ${
                isFall ? 'bg-[#a8434d]' : isRise ? 'bg-[#2f7a4e]' : 'bg-[#b3822f]'
              }`}
            >
              {isFall ? (
                <TrendingDown className="w-3 h-3" />
              ) : isRise ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <AlertTriangle className="w-3 h-3" />
              )}
              <span>{confluenceSignal.side}</span>
            </span>

            <span className="text-[11px] font-bold text-stone-800">
              {astroState.activeHora?.planet?.glyph} {astroState.activeHora?.planet?.name} Hora (
              {astroState.activeHora?.minsRemaining}m left)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-white/80 border border-[#dfd2b7] font-semibold text-stone-700">
              ✦ {astroState.nakshatra?.name} ({astroState.nakshatra?.info?.name})
            </span>
            {confluenceSignal.confidence > 0 && (
              <span className="font-bold text-stone-900 bg-white/70 px-1.5 py-0.5 rounded border border-[#dfd2b7]">
                {confluenceSignal.confidence}% Conf.
              </span>
            )}
          </div>
        </div>

        <div
          className={`text-xs sm:text-[13px] font-bold mt-1.5 leading-snug ${
            isFall ? 'text-[#8a2933]' : isRise ? 'text-[#21603b]' : 'text-[#7d5714]'
          }`}
        >
          {confluenceSignal.headline}
        </div>

        <div className="text-[10.5px] sm:text-[11px] text-stone-600 mt-1 leading-relaxed">
          {confluenceSignal.subtext}
        </div>
      </div>
    </div>
  );
}
