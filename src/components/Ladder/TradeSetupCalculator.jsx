import { useState, useMemo } from 'react';
import { Copy, Check, Zap, Shield, Award, Flame } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import CustomDropdown from '../Common/CustomDropdown';

export default function TradeSetupCalculator({
  lvl,
  ticker,
  tradeSetup,
  accountBalance,
  setAccountBalance,
  riskPerTradePct,
  setRiskPerTradePct,
  onExecutePaperTrade,
  astroState
}) {
  const [copied, setCopied] = useState(false);
  const [tradeTaken, setTradeTaken] = useState(false);

  const riskOptions = useMemo(
    () => [
      {
        value: 0.5,
        label: '0.5%',
        sublabel: 'Conservative · Capital Defense',
        badge: 'Low',
        badgeColor: 'bg-emerald-100 text-emerald-800',
        icon: <Shield className="w-3.5 h-3.5 text-emerald-600" />
      },
      {
        value: 1.0,
        label: '1.0%',
        sublabel: 'Standard · Recommended Gann Kelly',
        badge: 'Optimal',
        badgeColor: 'bg-amber-100 text-amber-800',
        icon: <Award className="w-3.5 h-3.5 text-amber-600" />
      },
      {
        value: 2.0,
        label: '2.0%',
        sublabel: 'Aggressive · High Conviction',
        badge: 'Growth',
        badgeColor: 'bg-orange-100 text-orange-800',
        icon: <Zap className="w-3.5 h-3.5 text-orange-600" />
      },
      {
        value: 3.0,
        label: '3.0%',
        sublabel: 'Max Risk · Tight Stop Pivots',
        badge: 'Max',
        badgeColor: 'bg-red-100 text-red-800',
        icon: <Flame className="w-3.5 h-3.5 text-red-600" />
      }
    ],
    []
  );

  if (!tradeSetup) return null;
  const baseAsset = ticker ? ticker.split('/')[0] : '';

  const handleCopySetup = (e) => {
    e.stopPropagation();
    const astroRead = astroState?.activeHora?.planet
      ? `\nAstro Read: ${astroState.activeHora.planet.name} Hora (${astroState.activeHora.bias?.label} ${astroState.activeHora.bias?.base}%) · Moon in ${astroState.nakshatra?.name || ''}`
      : '';
    const text =
      `${ticker} ${tradeSetup.direction} [${lvl.rank} · ${lvl.degree}°]\n` +
      `Entry: $${formatPrice(tradeSetup.entry)}\n` +
      `Stop-Loss: $${formatPrice(tradeSetup.stopLoss)} (-${tradeSetup.slDistancePct.toFixed(2)}%)\n` +
      `TP1: $${formatPrice(tradeSetup.takeProfit1)} (+${tradeSetup.tp1DistancePct.toFixed(2)}%)\n` +
      `TP2: $${formatPrice(tradeSetup.takeProfit2)}\n` +
      `R:R: ${tradeSetup.rrRatio.toFixed(2)}R | Size: ${tradeSetup.positionUnits.toFixed(4)} ${baseAsset} ($${formatPrice(tradeSetup.riskDollars)} risk)` +
      astroRead;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTakePaperTrade = (e) => {
    e.stopPropagation();
    if (onExecutePaperTrade) {
      onExecutePaperTrade(tradeSetup, lvl);
      setTradeTaken(true);
      setTimeout(() => setTradeTaken(false), 3000);
    }
  };

  return (
    <div
      className="px-3 sm:px-3.5 pb-3.5 pt-2.5 border-t border-[#e6decb] bg-[#f7f3e8] space-y-2.5 text-xs font-mono"
    >
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        <span className="font-bold text-[#8a6813] uppercase tracking-wider text-[11px]">
          Target Setup · {tradeSetup.direction}
        </span>
        <div className="flex items-center gap-1.5">
          {/* 1-Tap Paper Trade Button */}
          <button
            onClick={handleTakePaperTrade}
            disabled={tradeTaken}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 active:scale-95 transition ${
              tradeTaken
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-xs'
            }`}
          >
            {tradeTaken ? <Check className="w-3 h-3 text-white" /> : <Zap className="w-3 h-3 text-amber-300" />}
            <span>{tradeTaken ? 'Paper Trade Active ✓' : 'Take Paper Trade'}</span>
          </button>

          {/* Copy Plan Button */}
          <button
            onClick={handleCopySetup}
            className="px-2.5 py-1 rounded-md bg-[#262420] text-[#fcfaf5] text-[10px] font-semibold flex items-center gap-1 hover:bg-stone-800 active:scale-95 transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy Plan'}</span>
          </button>
        </div>
      </div>

      {/* Entry, Stop-Loss, Take-Profit 1 & 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2 rounded-lg bg-white border border-[#e4dccb]">
          <div className="text-[10px] text-stone-500 uppercase">Limit Entry</div>
          <div className="text-[12px] font-bold text-stone-900 mt-0.5">
            ${formatPrice(tradeSetup.entry)}
          </div>
        </div>

        <div className="p-2 rounded-lg bg-white border border-[#e4dccb]">
          <div className="text-[10px] text-red-600 uppercase font-semibold">Stop-Loss</div>
          <div className="text-[12px] font-bold text-red-700 mt-0.5">
            ${formatPrice(tradeSetup.stopLoss)}
          </div>
          <div className="text-[9px] text-red-600 font-medium">
            -{tradeSetup.slDistancePct.toFixed(2)}% buffer
          </div>
        </div>

        <div className="p-2 rounded-lg bg-white border border-[#e4dccb]">
          <div className="text-[10px] text-emerald-700 uppercase font-semibold">TP 1 (Opposite)</div>
          <div className="text-[12px] font-bold text-emerald-800 mt-0.5">
            ${formatPrice(tradeSetup.takeProfit1)}
          </div>
          <div className="text-[9px] text-emerald-700 font-medium">
            +{tradeSetup.tp1DistancePct.toFixed(2)}%
          </div>
        </div>

        <div className="p-2 rounded-lg bg-white border border-[#e4dccb]">
          <div className="text-[10px] text-amber-700 uppercase font-semibold">R:R Ratio</div>
          <div className="text-[12px] font-bold text-amber-800 mt-0.5">
            1 : {tradeSetup.rrRatio.toFixed(2)}R
          </div>
          <div className="text-[9px] text-stone-500">TP2: ${formatPrice(tradeSetup.takeProfit2)}</div>
        </div>
      </div>

      {/* Account Size & Risk % Calculator Controls */}
      <div className="p-2.5 rounded-xl bg-[#f2ece0] border border-[#ded5c2] flex flex-wrap items-center justify-between gap-2.5 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-stone-600 font-medium">Bal ($):</span>
          <input
            type="number"
            value={accountBalance}
            onChange={(e) => setAccountBalance(parseFloat(e.target.value) || 0)}
            className="w-20 px-2 py-0.5 rounded border border-[#cfc5b0] bg-white font-bold text-stone-900 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-stone-600 font-medium">Risk:</span>
          <CustomDropdown
            value={riskPerTradePct}
            onChange={(val) => setRiskPerTradePct(val)}
            options={riskOptions}
            size="sm"
            align="left"
            buttonClassName="font-bold text-stone-900 bg-white"
          />
        </div>

        <div className="text-right ml-auto">
          <div className="flex items-center gap-1.5 justify-end">
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
              1:1000 Lev
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              1:2 R:R
            </span>
          </div>
          <div className="mt-0.5">
            <span className="text-[10px] text-stone-500">Size: </span>
            <span className="font-bold text-stone-900">
              {tradeSetup.positionUnits.toFixed(4)} {baseAsset}
            </span>
          </div>
          <span className="text-stone-500 text-[9.5px] block">
            Margin: ${formatPrice(tradeSetup.marginRequired || (tradeSetup.notionalUsd / 1000))} · Risk: ${formatPrice(tradeSetup.riskDollars || tradeSetup.maxRiskDollar)}
          </span>
        </div>
      </div>

      {/* Optional Astro Confluence Readout */}
      {astroState?.activeHora && (
        <div className="flex items-center justify-between text-[10.5px] px-2.5 py-1 rounded-lg bg-white/70 border border-[#dfd6c2] text-stone-600">
          <span className="font-semibold text-amber-800 flex items-center gap-1">
            <span>{astroState.activeHora.planet.glyph}</span>
            <span>{astroState.activeHora.planet.name} Hora</span>
          </span>
          <span className="text-[10px] text-stone-500 font-mono">
            {astroState.activeHora.bias.label} ({astroState.activeHora.bias.base}%) · {astroState.activeHora.minsRemaining}m left · Moon in {astroState.nakshatra?.name}
          </span>
        </div>
      )}
    </div>
  );
}
