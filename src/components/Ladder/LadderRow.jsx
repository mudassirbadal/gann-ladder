import { useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { isGoldHighlightDegree } from '../../utils/gannMath';
import { calculatePreciseTradeSetup } from '../../utils/tradeRules';
import TradeSetupCalculator from './TradeSetupCalculator';

export default function LadderRow({
  lvl,
  priceNow,
  showCycleInRows,
  ladder,
  ticker,
  isExpanded,
  onToggleExpand,
  accountBalance,
  setAccountBalance,
  riskPerTradePct,
  setRiskPerTradePct,
  onExecutePaperTrade,
  astroState,
  confluenceSignal
}) {
  const isUsed = lvl.rank === 'USED' || lvl.used;
  const isFinalRejection = lvl.rank === 'R1';
  const isFinalBounce = lvl.rank === 'B1';
  const isPrimaryZone = isFinalRejection || isFinalBounce;
  const isRejectionRank = lvl.rank && lvl.rank.startsWith('R');

  const pctDiff = ((lvl.price - priceNow) / priceNow) * 100;
  const pctStr = `${pctDiff >= 0 ? '+' : ''}${pctDiff.toFixed(2)}%`;

  let rowBorderStyle = '1px solid #e2dac9';
  let rowBgColor = '#fcfaf5';

  if (isPrimaryZone) {
    rowBorderStyle = '1.8px solid #d4a72c';
    rowBgColor = '#fdfbf4';
  } else if (isUsed) {
    rowBorderStyle = '1px dashed #d5cdbc';
    rowBgColor = '#faf7f0';
  }

  const goldDegreeText = isGoldHighlightDegree(lvl.degree);

  // Compute trade setup adhering to strict 1:2 R:R, Gold 15pt / $15 max SL, Crypto $10 max SL, 1:1000 leverage
  const tradeSetup = useMemo(() => {
    if (isUsed) return null;
    const isShort = isRejectionRank;
    return calculatePreciseTradeSetup({
      lvl,
      isShort,
      ticker,
      currentPrice: priceNow,
      accountBalance,
      leverage: 1000
    });
  }, [isUsed, lvl, isRejectionRank, ticker, priceNow, accountBalance]);

  return (
    <div
      className="rounded-[14px] transition-all overflow-hidden"
      style={{
        backgroundColor: rowBgColor,
        border: rowBorderStyle
      }}
    >
      {/* Main Row Header */}
      <div
        onClick={() => !isUsed && onToggleExpand && onToggleExpand()}
        className={`px-3 sm:px-3.5 py-2.5 flex items-center justify-between gap-2 ${
          !isUsed ? 'cursor-pointer hover:bg-[#f7f2e4]/70 active:bg-[#f2ebda]' : ''
        }`}
      >
        {/* Left Section: Badge + Degree + Cycle */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-[110px] sm:min-w-[135px] shrink-0">
          {isUsed ? (
            <span
              className="w-[42px] sm:w-[46px] text-center py-1 rounded-[7px] text-[10px] font-semibold tracking-wider shrink-0 font-mono"
              style={{
                backgroundColor: '#f5f2ea',
                border: '1px dashed #b5ae9e',
                color: '#6e685c'
              }}
            >
              USED
            </span>
          ) : isRejectionRank ? (
            <span
              className="w-[42px] sm:w-[46px] text-center py-1 rounded-[7px] text-[11px] font-bold shrink-0 font-mono"
              style={{
                backgroundColor: '#faeceb',
                border: '1px solid #e6b8b6',
                color: '#b93834'
              }}
            >
              {lvl.rank}
            </span>
          ) : (
            <span
              className="w-[42px] sm:w-[46px] text-center py-1 rounded-[7px] text-[11px] font-bold shrink-0 font-mono"
              style={{
                backgroundColor: '#e6f4ec',
                border: '1px solid #b4dec6',
                color: '#216e43'
              }}
            >
              {lvl.rank}
            </span>
          )}

          {/* Degree & Optional Cycle */}
          <div className="leading-tight font-mono">
            <div className="flex items-center gap-1">
              <span
                className={`text-[13px] sm:text-[14px] font-bold ${
                  isUsed ? 'line-through opacity-75' : ''
                }`}
                style={{
                  color: goldDegreeText ? '#c59416' : '#262420'
                }}
              >
                {lvl.degree}°
              </span>
              {!isUsed && lvl.mtfConfluence && (
                <span
                  className="text-[9px] text-[#b5850b] font-bold"
                  title="Multi-Timeframe Harmonic Alignment"
                >
                  ★
                </span>
              )}
            </div>
            {showCycleInRows && (
              <div
                className={`text-[10px] sm:text-[11px] text-[#787266] ${
                  isUsed ? 'line-through opacity-65' : ''
                }`}
              >
                Cycle {lvl.cycle}
              </div>
            )}
          </div>
        </div>

        {/* Center Section: Description or Reaction info */}
        <div className="flex-1 min-w-0 pr-1">
          {isUsed ? (
            <div>
              <div
                className="text-[11px] sm:text-[12px] font-bold leading-snug truncate"
                style={{
                  color: lvl.reactionType === 'rejection' ? '#c94a46' : '#2e8b57'
                }}
              >
                {lvl.reactionType === 'rejection' ? 'Rejected here' : 'Bounced here'} ·{' '}
                {lvl.reactionDate}
              </div>
              <div
                className="text-[10px] sm:text-[11px] text-[#6e685c] truncate mt-0.5 font-mono"
              >
                Moved {lvl.moveDollar >= 0 ? '+' : '-'}$
                {formatPrice(Math.abs(lvl.moveDollar))} ({lvl.movePct.toFixed(2)}%)
              </div>
            </div>
          ) : isFinalRejection ? (
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider leading-tight text-[#c59416] font-mono"
                >
                  FINAL REJECTION ZONE
                </span>
                {confluenceSignal?.downsideSignal && (
                  <span className="text-[8.5px] sm:text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-rose-100 border border-rose-200 text-rose-800">
                    🔴 Astro Short Aligned ({astroState?.activeHora?.planet?.code} Hora)
                  </span>
                )}
              </div>
              <div className="text-[11px] sm:text-[12px] text-[#4a463f] mt-0.5 truncate">
                {lvl.desc}
              </div>
            </div>
          ) : isFinalBounce ? (
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider leading-tight text-[#c59416] font-mono"
                >
                  FINAL BOUNCE ZONE
                </span>
                {confluenceSignal?.upsideSignal && (
                  <span className="text-[8.5px] sm:text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-200 text-emerald-800">
                    🟢 Astro Bounce Aligned ({astroState?.activeHora?.planet?.code} Hora)
                  </span>
                )}
              </div>
              <div className="text-[11px] sm:text-[12px] text-[#4a463f] mt-0.5 truncate">
                {lvl.desc}
              </div>
            </div>
          ) : (
            <div className="text-[11px] sm:text-[12px] text-[#4a463f] truncate">{lvl.desc}</div>
          )}
        </div>

        {/* Right Section: Price & % Distance */}
        <div className="text-right shrink-0 flex items-center gap-1.5 sm:gap-2 font-mono">
          <div>
            <div
              className={`text-[13px] sm:text-[14px] ${
                isUsed ? 'font-medium text-[#6e685c]' : 'font-bold text-[#1e1d1a]'
              }`}
            >
              ${formatPrice(lvl.price)}
            </div>
            {!isUsed && (
              <div
                className="text-[10px] sm:text-[11px] font-semibold mt-0.5"
                style={{
                  color: isRejectionRank ? '#c94a46' : '#2e8b57'
                }}
              >
                {pctStr}
              </div>
            )}
          </div>
          {!isUsed && (
            <div className="text-[#9c9484]">
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expandable Trade Execution & Risk Calculator */}
      {!isUsed && isExpanded && tradeSetup && (
        <TradeSetupCalculator
          lvl={lvl}
          ticker={ticker}
          tradeSetup={tradeSetup}
          accountBalance={accountBalance}
          setAccountBalance={setAccountBalance}
          riskPerTradePct={riskPerTradePct}
          setRiskPerTradePct={setRiskPerTradePct}
          onExecutePaperTrade={onExecutePaperTrade}
          astroState={astroState}
        />
      )}
    </div>
  );
}
