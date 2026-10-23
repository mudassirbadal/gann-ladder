import { useState, useMemo } from 'react';
import {
  Briefcase,
  X,
  TrendingUp,
  TrendingDown,
  Trash2,
  PlayCircle,
  Filter,
  Bot,
  Zap,
  DollarSign,
  Sliders
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import CustomDropdown from '../Common/CustomDropdown';

export default function TradingJournalDrawer({
  isOpen,
  onClose,
  paperTrading,
  livePrices,
  user,
  isSignedIn = false
}) {
  const [tab, setTab] = useState('open'); // 'open' | 'history'
  const [historyFilter, setHistoryFilter] = useState('ALL');

  const {
    openTrades = [],
    closedTrades = [],
    autoTradingEnabled,
    setAutoTradingEnabled,
    startingBalance = 300,
    setStartingBalance,
    leverage = 1000,
    setLeverage,
    closeTradeManually,
    deleteTrade,
    clearJournalHistory,
    deleteBotTradesOnly,
    deleteAllTradingData,
    cloudSynced = false,
    stats = {}
  } = paperTrading || {};

  const filterOptions = useMemo(
    () => [
      {
        value: 'ALL',
        label: 'All Outcomes',
        sublabel: `${closedTrades?.length || 0} recorded trades`,
        badge: String(closedTrades?.length || 0),
        badgeColor: 'bg-stone-100 text-stone-700',
        icon: <Filter className="w-3.5 h-3.5 text-stone-600" />
      },
      {
        value: 'WIN',
        label: 'Wins Only',
        sublabel: `${closedTrades?.filter((t) => t.status === 'WIN').length || 0} profitable trades`,
        badge: 'TP Hit',
        badgeColor: 'bg-emerald-100 text-emerald-800',
        icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
      },
      {
        value: 'LOSS',
        label: 'Losses Only',
        sublabel: `${closedTrades?.filter((t) => t.status === 'LOSS').length || 0} stopped trades`,
        badge: 'SL Hit',
        badgeColor: 'bg-red-100 text-red-800',
        icon: <TrendingDown className="w-3.5 h-3.5 text-red-600" />
      }
    ],
    [closedTrades]
  );

  const displayedClosedTrades = useMemo(() => {
    if (!closedTrades) return [];
    if (historyFilter === 'ALL') return closedTrades;
    return closedTrades.filter((t) => t.status === historyFilter);
  }, [closedTrades, historyFilter]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[75] flex justify-end"
      style={{ backgroundColor: 'rgba(30, 29, 26, 0.45)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg h-full p-4 sm:p-5 overflow-y-auto flex flex-col justify-between shadow-2xl bg-[#fcfaf5] border-l border-[#dfd7c6]">
        <div className="space-y-4">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#e5decb]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#262420] text-amber-400 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3
                  className="text-lg sm:text-xl font-bold leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Paper Trading Journal
                </h3>
                <span className="text-[10px] text-stone-500 font-mono">
                  Starting Balance: ${stats.startingBalance || 300} · 1:1000 Leverage · 1:2 R:R
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-500 hover:text-stone-900 rounded-lg"
              aria-label="Close journal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Supabase Cloud Sync Status Pill */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#ede6d4] border border-[#d8d0bf] text-[10px] font-mono">
            <div className="flex items-center gap-1.5 truncate">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isSignedIn ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-semibold text-stone-800 truncate">
                {isSignedIn
                  ? `Supabase DB Synced: ${user?.primaryEmailAddress?.emailAddress || user?.fullName || 'User'}`
                  : 'Local Storage (Sign in to sync with Supabase)'}
              </span>
            </div>
            <span className={`px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${isSignedIn ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
              {isSignedIn ? 'Cloud' : 'Guest'}
            </span>
          </div>

          {/* Automated Trading Engine Switch Banner */}
          <div className="p-3 rounded-2xl bg-[#f4efe2] border border-[#dcd3bf] flex items-center justify-between gap-3 font-mono">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-white ${
                  autoTradingEnabled ? 'bg-emerald-700 animate-pulse' : 'bg-stone-500'
                }`}
              >
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <span>Auto-Trading Bot</span>
                  <span
                    className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      autoTradingEnabled
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {autoTradingEnabled ? 'Active (ON)' : 'Disabled'}
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5 leading-tight">
                  Auto-enters on R1/B1 zone touch + wick confirmation (1:2 R:R)
                </div>
              </div>
            </div>

            <button
              onClick={() => setAutoTradingEnabled && setAutoTradingEnabled(!autoTradingEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 shrink-0 ${
                autoTradingEnabled
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs'
                  : 'bg-stone-800 text-white hover:bg-stone-900'
              }`}
            >
              {autoTradingEnabled ? 'Enabled ✓' : 'Enable Bot'}
            </button>
          </div>

          {/* User-Configurable Account Starting Balance & Leverage Bar */}
          <div className="p-3 rounded-2xl bg-[#f4efe2] border border-[#dcd3bf] space-y-2 font-mono">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-900">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-stone-700" />
                <span>Account Capital & Leverage:</span>
              </span>
              <span className="text-[10px] text-stone-500 font-normal">Customizable</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-stone-600 block mb-0.5">Starting Equity ($):</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">$</span>
                  <input
                    type="number"
                    min="10"
                    step="50"
                    value={startingBalance}
                    onChange={(e) => setStartingBalance && setStartingBalance(Math.max(10, Number(e.target.value) || 0))}
                    className="w-full pl-6 pr-2 py-1.5 rounded-xl border border-[#d5ccb8] bg-white text-xs font-bold font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-stone-600 block mb-0.5">Trading Leverage (1:X):</label>
                <select
                  value={leverage}
                  onChange={(e) => setLeverage && setLeverage(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[#d5ccb8] bg-white text-xs font-bold font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value={50}>1:50 (Ultra Safe)</option>
                  <option value={100}>1:100 (Safe)</option>
                  <option value={200}>1:200 (Standard)</option>
                  <option value={500}>1:500 (Aggressive)</option>
                  <option value={1000}>1:1000 (Maximum)</option>
                  <option value={2000}>1:2000 (Ultra)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Performance & $100 Normalized Return Metric Cards — Uniform Row Alignment */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
            {/* 1. Account Equity */}
            <div className="h-[74px] p-2.5 rounded-xl bg-white border border-[#e2d8c4] flex flex-col justify-between shadow-2xs">
              <div className="text-[9.5px] uppercase font-bold text-stone-500 tracking-wider truncate">
                Equity
              </div>
              <div className="text-sm sm:text-base font-black text-stone-900 leading-none truncate">
                ${formatPrice(stats.currentEquity || startingBalance)}
              </div>
              <div
                className={`text-[10px] font-bold leading-none truncate ${
                  (stats.returnPct || 0) >= 0 ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {(stats.returnPct || 0) >= 0 ? '+' : ''}
                {(stats.returnPct || 0).toFixed(1)}% Return
              </div>
            </div>

            {/* 2. Normalized $100 Baseline — Clean, non-misplaced single-line format */}
            <div className="h-[74px] p-2.5 rounded-xl bg-[#faf7ed] border border-[#dccfae] flex flex-col justify-between shadow-2xs">
              <div className="text-[9.5px] uppercase font-bold text-amber-800 tracking-wider truncate flex items-center gap-1">
                <DollarSign className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">$100 Baseline</span>
              </div>
              <div className="text-sm sm:text-base font-black text-amber-950 leading-none truncate">
                ${formatPrice(stats.normalized100Current || 100)}
              </div>
              <div
                className={`text-[10px] font-bold leading-none truncate ${
                  (stats.normalized100Profit || 0) >= 0 ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {(stats.normalized100Profit || 0) >= 0 ? '+' : ''}${formatPrice(stats.normalized100Profit || 0)}
              </div>
            </div>

            {/* 3. Win Rate */}
            <div className="h-[74px] p-2.5 rounded-xl bg-white border border-[#e2d8c4] flex flex-col justify-between shadow-2xs">
              <div className="text-[9.5px] uppercase font-bold text-stone-500 tracking-wider truncate">
                Win Rate
              </div>
              <div className="text-sm sm:text-base font-black text-amber-700 leading-none truncate">
                {stats.winRate || 0}%
              </div>
              <div className="text-[10px] text-stone-500 font-medium leading-none truncate">
                {stats.winsCount || 0}W · {stats.lossesCount || 0}L
              </div>
            </div>

            {/* 4. R:R & Leverage */}
            <div className="h-[74px] p-2.5 rounded-xl bg-white border border-[#e2d8c4] flex flex-col justify-between shadow-2xs">
              <div className="text-[9.5px] uppercase font-bold text-stone-500 tracking-wider truncate">
                R:R · Leverage
              </div>
              <div className="text-sm sm:text-base font-black text-emerald-800 leading-none truncate">
                1 : 2.0R
              </div>
              <div className="text-[10px] text-stone-600 font-medium leading-none truncate">
                1:{leverage} Lev
              </div>
            </div>
          </div>

          {/* Tab Switcher: Open Positions vs Trade History */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#eee7d8] border border-[#d8d0be]">
            <button
              onClick={() => setTab('open')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'open'
                  ? 'bg-[#262420] text-white shadow-xs font-bold'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              Open Positions ({openTrades.length})
            </button>
            <button
              onClick={() => setTab('history')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'history'
                  ? 'bg-[#262420] text-white shadow-xs font-bold'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              History ({closedTrades.length})
            </button>
          </div>

          {/* TAB 1: Open Positions */}
          {tab === 'open' && (
            <div className="space-y-2.5">
              {openTrades.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white border border-[#e2dac9] space-y-2">
                  <PlayCircle className="w-8 h-8 text-stone-400 mx-auto" />
                  <div className="font-bold text-xs text-stone-800">
                    No Open Paper Positions
                  </div>
                  <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                    {autoTradingEnabled
                      ? 'Auto-trading bot is monitoring live prices. When price touches an R1 or B1 zone with wick confirmation, it will enter automatically!'
                      : 'Auto-trading is currently off. You can enable it above or manually tap "Take Paper Trade" in the ladder.'}
                  </p>
                </div>
              ) : (
                openTrades.map((t) => {
                  const currentPrice = livePrices[t.symbol] || t.entryPrice;
                  const isLong = t.direction === 'LONG';
                  const livePnlDollar = isLong
                    ? (currentPrice - t.entryPrice) * t.positionUnits
                    : (t.entryPrice - currentPrice) * t.positionUnits;
                  const livePnlPct = isLong
                    ? ((currentPrice - t.entryPrice) / t.entryPrice) * 100
                    : ((t.entryPrice - currentPrice) / t.entryPrice) * 100;
                  const isProfit = livePnlDollar >= 0;

                  return (
                    <div
                      key={t.id}
                      className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#e0d8c6] shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-mono flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isLong ? 'bg-[#e6f4ec] text-[#216e43]' : 'bg-[#faeceb] text-[#b93834]'
                            }`}
                          >
                            {t.direction} · {t.rank} ({t.degree}°)
                          </span>
                          <span className="font-bold text-xs text-stone-900">{t.ticker}</span>
                          <span
                            className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded ${
                              t.isAuto ? 'bg-purple-100 text-purple-800' : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {t.isAuto ? '🤖 AUTO' : '👆 MANUAL'}
                          </span>
                        </div>

                        {/* Live Floating PnL Badge */}
                        <div
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            isProfit ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>
                            {isProfit ? '+' : ''}${formatPrice(livePnlDollar)} ({livePnlPct.toFixed(2)}%)
                          </span>
                        </div>
                      </div>

                      {/* Entry, Stop Loss, Target */}
                      <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] p-2 rounded-xl bg-[#faf7f0] border border-[#ede5d3]">
                        <div>
                          <span className="text-stone-500 block">Entry:</span>
                          <span className="font-bold text-stone-900">${formatPrice(t.entryPrice)}</span>
                        </div>
                        <div>
                          <span className="text-red-600 block">Stop-Loss:</span>
                          <span className="font-bold text-red-700">${formatPrice(t.stopLoss)}</span>
                        </div>
                        <div>
                          <span className="text-emerald-700 block">Target TP1 (1:2):</span>
                          <span className="font-bold text-emerald-800">${formatPrice(t.takeProfit1)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="text-[9.5px] text-stone-500 font-mono">
                          <span>Margin: ${formatPrice(t.marginRequired || (t.notionalUsd / 1000))} (1:1000 Lev)</span>
                          <span className="block text-stone-400">Opened: {t.openTime}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => closeTradeManually(t.id, currentPrice)}
                            className="px-2.5 py-1 rounded-lg bg-stone-800 text-white text-[11px] font-semibold hover:bg-stone-900 active:scale-95 transition"
                          >
                            Close at Market (${formatPrice(currentPrice)})
                          </button>
                          <button
                            onClick={() => deleteTrade && deleteTrade(t.id)}
                            className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition active:scale-90"
                            title="Delete this open trade record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: Trade History */}
          {tab === 'history' && (
            <div className="space-y-2">
              {/* Filter Dropdown Bar */}
              {closedTrades.length > 0 && (
                <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-[#f4efe2] border border-[#e5decb]">
                  <span className="text-[11px] font-mono text-stone-600 pl-1 font-semibold">
                    Filter by Outcome:
                  </span>
                  <CustomDropdown
                    value={historyFilter}
                    onChange={setHistoryFilter}
                    options={filterOptions}
                    size="sm"
                    align="right"
                    buttonClassName="bg-white border-[#d8d0be]"
                  />
                </div>
              )}

              {displayedClosedTrades.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white border border-[#e2dac9] text-xs text-stone-500">
                  {closedTrades.length === 0
                    ? 'No completed trades yet. Once price hits your Take-Profit or Stop-Loss, the result will be recorded here.'
                    : 'No trades match the selected filter.'}
                </div>
              ) : (
                displayedClosedTrades.map((t) => {
                  const isWin = t.status === 'WIN';
                  return (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl bg-white border border-[#e2d8c4] flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold flex-wrap">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] ${
                              isWin ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {t.status}
                          </span>
                          <span className="text-stone-900">{t.ticker}</span>
                          <span className="text-stone-500 font-normal">
                            ({t.direction} · {t.rank})
                          </span>
                          <span
                            className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                              t.isAuto ? 'bg-purple-100 text-purple-800' : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {t.isAuto ? 'AUTO' : 'MANUAL'}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 mt-1">
                          Exit: ${formatPrice(t.exitPrice)} · Reason: {t.exitReason} ({t.closeTime})
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div
                            className={`font-bold text-xs ${
                              t.pnlDollar >= 0 ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {t.pnlDollar >= 0 ? '+' : ''}${formatPrice(t.pnlDollar)}
                          </div>
                          <div className="text-[10px] text-stone-500">
                            {t.pnlPct >= 0 ? '+' : ''}{t.pnlPct.toFixed(2)}%
                          </div>
                        </div>

                        <button
                          onClick={() => deleteTrade && deleteTrade(t.id)}
                          className="p-1 rounded-lg text-stone-300 hover:text-red-600 hover:bg-red-50 transition active:scale-90"
                          title="Delete trade from Supabase history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Trading Bot & Journal Data Management Section */}
        <div className="mt-6 pt-4 border-t border-[#e5decb] space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-600 font-semibold">
            <span>Trading Data Management:</span>
            <span className="text-[10px] text-stone-400 font-normal">
              {isSignedIn ? 'Cloud DB Synced' : 'Local Storage'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono">
            <button
              onClick={() => {
                if (window.confirm('Delete all auto-trading bot trades from your database? Manual trades will be preserved.')) {
                  deleteBotTradesOnly?.();
                }
              }}
              className="py-2 px-2.5 rounded-xl border border-amber-300 bg-amber-50 text-[10.5px] font-bold text-amber-900 hover:bg-amber-100 active:scale-95 transition flex items-center justify-center gap-1.5 shadow-2xs"
              title="Delete all bot orders only"
            >
              <Bot className="w-3.5 h-3.5 text-amber-700" />
              <span>Delete Bot Trades</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to COMPLETELY wipe all trading bot records, journal history, and reset your starting balance to $300? This cannot be undone.')) {
                  deleteAllTradingData?.();
                }
              }}
              className="py-2 px-2.5 rounded-xl border border-red-300 bg-red-50 text-[10.5px] font-bold text-red-800 hover:bg-red-100 active:scale-95 transition flex items-center justify-center gap-1.5 shadow-2xs"
              title="Permanently wipe all trading records"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Wipe All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
