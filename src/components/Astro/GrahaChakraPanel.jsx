import { ZODIAC_GLYPHS, formatHourClock } from '../../utils/astroMath';

export default function GrahaChakraPanel({ astroState }) {
  if (!astroState) return null;

  return (
    <div className="space-y-4 font-mono select-none">
      {/* 1. Interactive 360° Zodiac Wheel & Aspect Transits */}
      <div className="relative w-[min(340px,86vw)] sm:w-[360px] aspect-square mx-auto my-2">
        <svg
          viewBox="-220 -220 440 440"
          className="w-full h-full overflow-visible"
        >
          {/* Outer & Inner Concentric Rings */}
          <circle cx="0" cy="0" r="190" fill="none" stroke="#e3d5b8" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="145" fill="none" stroke="#e3d5b8" strokeWidth="1" />

          {/* 12 Zodiac Houses & Glyphs */}
          {ZODIAC_GLYPHS.map((glyph, idx) => {
            const angleDeg = idx * 30 - 90;
            const rad = (angleDeg * Math.PI) / 180;
            const midRad = ((angleDeg + 15) * Math.PI) / 180;
            const x1 = 190 * Math.cos(rad);
            const y1 = 190 * Math.sin(rad);
            const x2 = 145 * Math.cos(rad);
            const y2 = 145 * Math.sin(rad);
            const gx = 167 * Math.cos(midRad);
            const gy = 167 * Math.sin(midRad);
            return (
              <g key={idx}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d5c29d" strokeWidth="1" />
                <text
                  x={gx}
                  y={gy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="13"
                  fill="#9c7a42"
                >
                  {glyph}
                </text>
              </g>
            );
          })}

          {/* Aspect Lines between Planets */}
          {astroState.pairs.slice(0, 8).map((pr, idx) => {
            const r1 = ((pr.a.lon - 90) * Math.PI) / 180;
            const r2 = ((pr.b.lon - 90) * Math.PI) / 180;
            const stroke =
              pr.aspect.nature === 'hard'
                ? '#a8434d'
                : pr.aspect.nature === 'soft'
                ? '#3f8a5e'
                : '#b3822f';
            return (
              <line
                key={idx}
                x1={132 * Math.cos(r1)}
                y1={132 * Math.sin(r1)}
                x2={132 * Math.cos(r2)}
                y2={132 * Math.sin(r2)}
                stroke={stroke}
                strokeWidth="1.3"
                strokeOpacity="0.45"
              />
            );
          })}

          {/* Planet Nodes */}
          {astroState.positions.map((p) => {
            const rad = ((p.lon - 90) * Math.PI) / 180;
            const px = 132 * Math.cos(rad);
            const py = 132 * Math.sin(rad);
            const strokeColor =
              p.dignity.cls === 'exalted'
                ? '#3f8a5e'
                : p.dignity.cls === 'debilitated'
                ? '#a8434d'
                : '#b3822f';
            return (
              <g key={p.key} transform={`translate(${px}, ${py})`}>
                <circle r="14" fill="#1c1712" stroke={strokeColor} strokeWidth="2" />
                <text
                  x="0"
                  y="1"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#e9c46a"
                  fontSize="10"
                  fontWeight="700"
                >
                  {p.code}
                </text>
                {p.retro && (
                  <text x="11" y="-8" fill="#e05a67" fontSize="8" fontWeight="800">
                    R
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Center Composite Gauge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[54%] text-center pointer-events-none">
          <div className="text-[9.5px] uppercase tracking-wider text-[#9c7a42] font-bold">
            GRAHA COMPOSITE
          </div>
          <div
            className={`text-xl sm:text-2xl font-bold my-0.5 ${
              astroState.compositeScore <= 46 ? 'text-[#a8434d]' : 'text-[#2f7a4e]'
            }`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {astroState.compositeScore <= 46
              ? `${100 - astroState.compositeScore}% Bearish`
              : `${astroState.compositeScore}% Bullish`}
          </div>
          <div className="text-[10px] text-stone-600 leading-tight">
            {astroState.tightest
              ? `${astroState.tightest.a.name} ${astroState.tightest.aspect.name} ${astroState.tightest.b.name} (${astroState.tightest.orb.toFixed(1)}°)`
              : 'No tight transit orb'}
          </div>
        </div>
      </div>

      {/* 2. Planetary Longitudes & Dignities */}
      <div>
        <h4 className="text-xs sm:text-sm font-bold text-stone-800 mb-2">
          Planetary Longitudes & Classical Dignity (Charlie Obert Engine)
        </h4>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs">
          {astroState.positions.map((p) => (
            <div
              key={p.key}
              className="p-2.5 rounded-xl border border-[#e3d5b8] bg-[#faf5ea] flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-stone-900 flex items-center gap-1">
                  <span>{p.glyph}</span>
                  <span>{p.name}</span>
                  {p.retro && <span className="text-red-600 font-bold">(R)</span>}
                </div>
                <div className="text-[10.5px] text-stone-500 mt-0.5">
                  {p.signGlyph} {p.signName} {(p.lon % 30).toFixed(1)}° · {p.dignity.label}
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  p.marketRole < 0
                    ? 'bg-rose-100 text-rose-800'
                    : p.marketRole > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-[#f3ead8] text-stone-600'
                }`}
              >
                {p.marketRole < 0 ? 'Short Ruler' : p.marketRole > 0 ? 'Long Ruler' : 'Neutral'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Intraday Chaldean Planetary Hours Timeline */}
      <div>
        <h4 className="text-xs sm:text-sm font-bold text-stone-800 mb-2">
          Intraday Chaldean Planetary Hours (IST) — Downside / Upside Windows
        </h4>
        <div className="max-h-56 overflow-y-auto overflow-x-auto rounded-xl border border-[#e3d5b8] p-1.5 space-y-1 bg-white/60">
          {astroState.hours.slice(0, 16).map((h) => (
            <div
              key={h.index}
              className={`grid grid-cols-[138px_1fr_auto] items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition min-w-[320px] ${
                h.isNow
                  ? 'bg-[#fdf4dc] border border-[#c89d14] font-bold shadow-2xs'
                  : 'hover:bg-[#faf5ea]'
              }`}
            >
              {/* Col 1: Time Window in 12-Hour AM/PM IST */}
              <div className="text-stone-500 font-mono text-[10px] sm:text-[10.5px] tracking-tight whitespace-nowrap">
                {formatHourClock(h.startHr)} – {formatHourClock(h.endHr)}
              </div>

              {/* Col 2: Planet Glyph + Name + Hora (strictly vertical column alignment) */}
              <div className="flex items-center gap-1.5 text-stone-800 font-medium min-w-0">
                <span className="w-4 text-center shrink-0 font-normal text-xs">{h.planet.glyph}</span>
                <span className="truncate">{h.planet.name} Hora</span>
                {h.isNow && (
                  <span className="text-amber-900 text-[8.5px] font-black px-1.5 py-0.2 rounded-full bg-amber-300 border border-amber-500 shrink-0 animate-pulse">
                    NOW
                  </span>
                )}
              </div>

              {/* Col 3: Bias Badge */}
              <div className="flex justify-end shrink-0">
                <span
                  className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    h.bias.tag === 'fall'
                      ? 'bg-rose-100 text-rose-800'
                      : h.bias.tag === 'rise'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#f3ead8] text-stone-600'
                  }`}
                >
                  {h.bias.tag === 'fall'
                    ? `SHORT ${h.bias.base}%`
                    : `${h.bias.label} ${h.bias.base}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
