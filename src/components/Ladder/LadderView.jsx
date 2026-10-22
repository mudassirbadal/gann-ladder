import { formatPrice } from '../../utils/formatters';
import LadderRow from './LadderRow';
import AstroDirectiveHeader from '../Astro/AstroDirectiveHeader';

export default function LadderView({
  activeItem,
  expandedRowId,
  setExpandedRowId,
  accountBalance,
  setAccountBalance,
  riskPerTradePct,
  setRiskPerTradePct,
  onExecutePaperTrade,
  astroState,
  astroOverride,
  setAstroOverride,
  confluenceSignal
}) {
  const r1 = activeItem.ladder.r1;
  const b1 = activeItem.ladder.b1;

  const r1Pct = r1
    ? ((r1.price - activeItem.priceNow) / activeItem.priceNow) * 100
    : 0;

  const b1Pct = b1
    ? ((b1.price - activeItem.priceNow) / activeItem.priceNow) * 100
    : 0;

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {/* Simplified Astro Directive Header & Hora Countdown Turn-Time Bar */}
      <AstroDirectiveHeader
        astroState={astroState}
        astroOverride={astroOverride}
        setAstroOverride={setAstroOverride}
        confluenceSignal={confluenceSignal}
        activeItem={activeItem}
      />

      {/* Top 2 Summary Cards: Final Rejection & Final Bounce */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Final Rejection Card */}
        <div
          onClick={() => r1 && setExpandedRowId(expandedRowId === r1.id ? null : r1.id)}
          className="rounded-2xl p-3 sm:p-3.5 cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
          style={{
            backgroundColor: '#fdfcfb',
            border: '1px solid #e7c2c0'
          }}
        >
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full inline-block"
                style={{
                  backgroundColor: '#c94a46',
                  boxShadow: '0 0 0 3px #f7dfde'
                }}
              />
              <span
                className="text-[9px] sm:text-[10px] tracking-[0.1em] sm:tracking-[0.12em] uppercase text-[#5c574f] font-semibold font-mono"
              >
                FINAL REJECTION
              </span>
            </div>
            {r1?.mtfConfluence && (
              <span
                className="text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded bg-[#fcf4dc] text-[#9e7711] border border-[#e3c878] font-mono font-bold"
                title="4H & Macro Gann Harmonic Alignment"
              >
                ★ MTF
              </span>
            )}
          </div>

          <div
            className="text-[14px] sm:text-[16px] font-bold mt-1.5 sm:mt-2 text-[#c59416] font-mono"
          >
            {r1
              ? activeItem.showCycleInRows
                ? `${r1.degree}° · Cycle ${r1.cycle}`
                : `${r1.degree}°`
              : '—'}
          </div>

          <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1 font-mono">
            <span className="text-[12px] sm:text-[13px] font-bold text-[#1e1d1a]">
              ${r1 ? formatPrice(r1.price) : '—'}
            </span>
            {r1 && (
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#c94a46]">
                +{r1Pct.toFixed(2)}%
              </span>
            )}
          </div>
        </div>

        {/* Final Bounce Card */}
        <div
          onClick={() => b1 && setExpandedRowId(expandedRowId === b1.id ? null : b1.id)}
          className="rounded-2xl p-3 sm:p-3.5 cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
          style={{
            backgroundColor: '#fbfdfc',
            border: '1px solid #bddbc9'
          }}
        >
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full inline-block"
                style={{
                  backgroundColor: '#2e8b57',
                  boxShadow: '0 0 0 3px #dcf0e4'
                }}
              />
              <span
                className="text-[9px] sm:text-[10px] tracking-[0.1em] sm:tracking-[0.12em] uppercase text-[#5c574f] font-semibold font-mono"
              >
                FINAL BOUNCE
              </span>
            </div>
            {b1?.mtfConfluence && (
              <span
                className="text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded bg-[#fcf4dc] text-[#9e7711] border border-[#e3c878] font-mono font-bold"
                title="4H & Macro Gann Harmonic Alignment"
              >
                ★ MTF
              </span>
            )}
          </div>

          <div
            className="text-[14px] sm:text-[16px] font-bold mt-1.5 sm:mt-2 text-[#c59416] font-mono"
          >
            {b1
              ? activeItem.showCycleInRows
                ? `${b1.degree}° · Cycle ${b1.cycle}`
                : `${b1.degree}°`
              : '—'}
          </div>

          <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1 font-mono">
            <span className="text-[12px] sm:text-[13px] font-bold text-[#1e1d1a]">
              ${b1 ? formatPrice(b1.price) : '—'}
            </span>
            {b1 && (
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#2e8b57]">
                {b1Pct.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Legend Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-0.5 text-xs text-[#5c574f]">
        <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#faeceb] border border-[#e6b8b6] text-[#b93834] font-mono">
              R
            </span>
            <span>Rejection</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#e6f4ec] border border-[#b4dec6] text-[#216e43] font-mono">
              B
            </span>
            <span>Bounce</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#f6f3ec] border border-dashed border-[#b5ae9e] text-[#6e685c] font-mono">
              USED
            </span>
            <span>Reacted</span>
          </div>
        </div>

        <span className="text-[10px] text-amber-800 font-semibold font-mono hidden xs:inline">
          Tap row for SL/TP Setup ▾
        </span>
      </div>

      {/* Upper Ladder: Levels Above Current Price */}
      <div className="space-y-1.5 sm:space-y-2">
        {activeItem.ladder.above.map((lvl) => (
          <LadderRow
            key={lvl.id}
            lvl={lvl}
            priceNow={activeItem.priceNow}
            showCycleInRows={activeItem.showCycleInRows}
            ladder={activeItem.ladder}
            ticker={activeItem.ticker}
            isExpanded={expandedRowId === lvl.id}
            onToggleExpand={() =>
              setExpandedRowId(expandedRowId === lvl.id ? null : lvl.id)
            }
            accountBalance={accountBalance}
            setAccountBalance={setAccountBalance}
            riskPerTradePct={riskPerTradePct}
            setRiskPerTradePct={setRiskPerTradePct}
            onExecutePaperTrade={onExecutePaperTrade}
            astroState={astroState}
            confluenceSignal={confluenceSignal}
          />
        ))}
      </div>

      {/* Center Current Price Divider Pill */}
      <div className="relative flex items-center justify-center py-1 sm:py-1.5">
        <div
          className="absolute inset-x-0 h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #d4a72c 25%, #d4a72c 75%, transparent 100%)',
            opacity: 0.55
          }}
        />
        <div
          className="relative z-10 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 font-mono"
          style={{
            backgroundColor: '#d4ac2b',
            color: '#1e1d1a'
          }}
        >
          <span className="text-[10px] animate-pulse">▶</span>
          <span>Price now ${formatPrice(activeItem.priceNow)}</span>
        </div>
      </div>

      {/* Lower Ladder: Levels Below Current Price */}
      <div className="space-y-1.5 sm:space-y-2">
        {activeItem.ladder.below.map((lvl) => (
          <LadderRow
            key={lvl.id}
            lvl={lvl}
            priceNow={activeItem.priceNow}
            showCycleInRows={activeItem.showCycleInRows}
            ladder={activeItem.ladder}
            ticker={activeItem.ticker}
            isExpanded={expandedRowId === lvl.id}
            onToggleExpand={() =>
              setExpandedRowId(expandedRowId === lvl.id ? null : lvl.id)
            }
            accountBalance={accountBalance}
            setAccountBalance={setAccountBalance}
            riskPerTradePct={riskPerTradePct}
            setRiskPerTradePct={setRiskPerTradePct}
            onExecutePaperTrade={onExecutePaperTrade}
            astroState={astroState}
            confluenceSignal={confluenceSignal}
          />
        ))}
      </div>
    </div>
  );
}
