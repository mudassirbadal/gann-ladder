import { useState, useMemo } from 'react';
import {
  Briefcase,
  X,
  TrendingUp,
  TrendingDown,
  Trash2,
  PlayCircle,
  Filter
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import CustomDropdown from '../Common/CustomDropdown';

export default function TradingJournalDrawer({
  isOpen,
  onClose,
  paperTrading,
  livePrices
}) {
  const [tab, setTab] = useState('open'); // 'open' | 'history'
  const [historyFilter, setHistoryFilter] = useState('ALL');

  const { openTrades, closedTrades = [], closeTradeManually, clearJournalHistory, stats } =
    paperTrading || {};

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
      <div
        className="w-full max-w-lg h-full p-4 sm:p-5 overflow-y-auto flex flex-col justify-between shadow-2xl bg-[#fcfaf5] border-l border-[#dfd7c6]"
      >
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
                  Real-time simulation on live Binance prices
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

          {/* 4 Performance KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
            <div className="p-2.5 rounded-xl bg-white border border-[#e2d8c4]">
              <div className="text-[9px] uppercase text-stone-500">Net Realized PnL</div>
              <div
                className={`text-sm sm:text-base font-bold mt-0.5 ${
                  stats.totalRealizedPnl >= 0 ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {stats.totalRealizedPnl >= 0 ? '+' : ''}${formatPrice(stats.totalRealizedPnl)}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-[#e2d8c4]">
              <div className="text-[9px] uppercase text-stone-500">Win Rate</div>
              <div className="text-sm sm:text-base font-bold text-amber-700 mt-0.5">
                {stats.winRate}%
              </div>
              <div className="text-[9px] text-stone-500">
                {stats.winsCount}W / {stats.lossesCount}L
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-[#e2d8c4]">
              <div className="text-[9px] uppercase text-stone-500">Open Trades</div>
              <div className="text-sm sm:text-base font-bold text-stone-900 mt-0.5">
                {stats.openCount}
              </div>
              <div className="text-[9px] text-stone-500">Active Market</div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-[#e2d8c4]">
              <div className="text-[9px] uppercase text-stone-500">Avg R:R</div>
              <div className="text-sm sm:text-base font-bold text-stone-900 mt-0.5">
                1 : {stats.avgRr}R
              </div>
              <div className="text-[9px] text-stone-500">{stats.totalTrades} Executed</div>
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
                    Open any coin's Gann Ladder, tap an active <strong>R</strong> or <strong>B</strong> row to expand the risk calculator, and tap <strong>"Take Paper Trade"</strong>.
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
                        <div className="flex items-center gap-1.5 font-mono">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isLong ? 'bg-[#e6f4ec] text-[#216e43]' : 'bg-[#faeceb] text-[#b93834]'
                            }`}
                          >
                            {t.direction} · {t.rank} ({t.degree}°)
                          </span>
                          <span className="font-bold text-xs text-stone-900">{t.ticker}</span>
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
                          <span className="text-emerald-700 block">Target TP1:</span>
                          <span className="font-bold text-emerald-800">${formatPrice(t.takeProfit1)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-[10px] text-stone-500 font-mono">
                          Opened: {t.openTime}
                        </span>

                        <button
                          onClick={() => closeTradeManually(t.id, currentPrice)}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 text-white text-[11px] font-semibold hover:bg-stone-900 active:scale-95 transition"
                        >
                          Close at Market (${formatPrice(currentPrice)})
                        </button>
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
                        <div className="flex items-center gap-1.5 font-bold">
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
                        </div>
                        <div className="text-[10px] text-stone-500 mt-1">
                          Exit: ${formatPrice(t.exitPrice)} · Reason: {t.exitReason} ({t.closeTime})
                        </div>
                      </div>

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
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Clear History Button */}
        {closedTrades.length > 0 && (
          <button
            onClick={clearJournalHistory}
            className="mt-6 w-full py-2 rounded-xl border border-[#dcd4c4] text-xs font-semibold text-stone-600 hover:bg-[#f2ece0] active:scale-98 transition flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Journal History</span>
          </button>
        )}
      </div>
    </div>
  );
}
