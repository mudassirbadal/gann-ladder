import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Scale,
  Trash2,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Bot,
  X,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function BotAnalyticsDrawer({
  isOpen,
  onClose,
  paperTrading,
  onOpenJournal,
  isSignedIn = false,
  user
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  if (!isOpen) return null;

  const {
    stats = {},
    trades = [],
    deleteBotTradesOnly,
    deleteAllTradingData,
    cloudSynced = false
  } = paperTrading || {};

  const totalTrades = stats.totalTrades || 0;
  const closedCount = stats.closedCount || 0;
  const openCount = stats.openCount || 0;
  const winsCount = stats.winsCount || 0;
  const breakevenCount = stats.breakevenCount || 0;
  const lossesCount = stats.lossesCount || 0;

  const winRate = stats.winRate || 0;
  const breakevenRate = stats.breakevenRate || 0;
  const lossRate = stats.lossRate || 0;

  const totalRealizedPnl = stats.totalRealizedPnl || 0;
  const isPnlPositive = totalRealizedPnl >= 0;

  // Segment widths for visual ratio bar
  const totalBarCount = closedCount > 0 ? closedCount : 1;
  const winWidthPct = closedCount > 0 ? (winsCount / totalBarCount) * 100 : 0;
  const beWidthPct = closedCount > 0 ? (breakevenCount / totalBarCount) * 100 : 0;
  const lossWidthPct = closedCount > 0 ? (lossesCount / totalBarCount) * 100 : 0;

  const handleDeleteBotOnly = async () => {
    setIsDeleting(true);
    try {
      if (deleteBotTradesOnly) await deleteBotTradesOnly();
      setDeleteSuccess('Bot trades successfully wiped from database.');
      setTimeout(() => {
        setDeleteSuccess(null);
        setShowDeleteModal(false);
      }, 1400);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      if (deleteAllTradingData) await deleteAllTradingData();
      setDeleteSuccess('All trading bot & journal records completely deleted.');
      setTimeout(() => {
        setDeleteSuccess(null);
        setShowDeleteModal(false);
      }, 1400);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[78] flex justify-end"
      style={{ backgroundColor: 'rgba(30, 29, 26, 0.50)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div
        className="w-full max-w-lg h-full p-4 sm:p-5 overflow-y-auto flex flex-col justify-between shadow-2xl bg-[#fcfaf5] border-l border-[#dfd7c6] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#e5decb]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#262420] text-amber-400 flex items-center justify-center font-bold shadow-xs">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3
                  className="text-lg sm:text-xl font-bold leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Trading Bot Analytics
                </h3>
                <span className="text-[10px] text-stone-500 font-mono">
                  Gann Square of 9 · 1:{stats.leverage || 1000} Leverage · 1:2 R:R Target
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-[#ede7d6] active:scale-75 transition"
              aria-label="Close analytics drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cloud Sync Status */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#ede6d4] border border-[#d8d0bf] text-[10px] font-mono">
            <div className="flex items-center gap-1.5 truncate">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isSignedIn ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-semibold text-stone-800 truncate">
                {isSignedIn
                  ? `Supabase DB Synced: ${user?.primaryEmailAddress?.emailAddress || user?.fullName || 'Active User'}`
                  : 'Local Storage (Sign in to sync with Supabase)'}
              </span>
            </div>
            <span className={`px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${isSignedIn ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
              {isSignedIn ? 'Cloud' : 'Guest'}
            </span>
          </div>

          {/* 4 Core Metric Tiles */}
          <div className="grid grid-cols-2 gap-2.5 font-mono">
            {/* Tile 1: Total Trades Taken */}
            <div className="p-3 rounded-xl bg-white border border-[#e5decb] shadow-2xs flex flex-col justify-between min-h-[82px]">
              <div className="flex items-center justify-between text-stone-500 text-[10px] font-bold uppercase tracking-wider">
                <span>Total Taken</span>
                <Bot className="w-3.5 h-3.5 text-stone-600" />
              </div>
              <div className="mt-1">
                <div className="text-xl font-black text-stone-900 leading-none">
                  {totalTrades}
                </div>
                <div className="text-[10px] text-stone-500 mt-1 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>{openCount} active open</span>
                </div>
              </div>
            </div>

            {/* Tile 2: Trades in Profit */}
            <div className="p-3 rounded-xl bg-[#f0f9f4] border border-[#c4e7d4] shadow-2xs flex flex-col justify-between min-h-[82px]">
              <div className="flex items-center justify-between text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                <span>In Profit</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="mt-1">
                <div className="text-xl font-black text-emerald-900 leading-none">
                  {winsCount} Won
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                  {winRate.toFixed(1)}% Win Rate
                </div>
              </div>
            </div>

            {/* Tile 3: Breakeven Trades */}
            <div className="p-3 rounded-xl bg-[#fdf9f0] border border-[#ebd8b0] shadow-2xs flex flex-col justify-between min-h-[82px]">
              <div className="flex items-center justify-between text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                <span>Breakeven</span>
                <Scale className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="mt-1">
                <div className="text-xl font-black text-amber-900 leading-none">
                  {breakevenCount} BE
                </div>
                <div className="text-[10px] text-amber-700 font-semibold mt-1">
                  {breakevenRate.toFixed(1)}% of Closed
                </div>
              </div>
            </div>

            {/* Tile 4: Trades in Loss */}
            <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] shadow-2xs flex flex-col justify-between min-h-[82px]">
              <div className="flex items-center justify-between text-red-800 text-[10px] font-bold uppercase tracking-wider">
                <span>In Loss</span>
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
              </div>
              <div className="mt-1">
                <div className="text-xl font-black text-red-900 leading-none">
                  {lossesCount} Lost
                </div>
                <div className="text-[10px] text-red-700 font-semibold mt-1">
                  {lossRate.toFixed(1)}% Stopped Out
                </div>
              </div>
            </div>
          </div>

          {/* Visual Outcome Distribution Ratio Bar */}
          <div className="p-3 rounded-xl bg-white border border-[#e5decb] space-y-2">
            <div className="flex items-center justify-between text-[10.5px] font-mono font-medium text-stone-600">
              <span>Outcome Distribution ({closedCount} Closed)</span>
              <span className={`font-bold ${isPnlPositive ? 'text-emerald-700' : 'text-red-700'}`}>
                PnL: {isPnlPositive ? '+' : ''}${formatPrice(totalRealizedPnl)} ({stats.returnPct ? (stats.returnPct >= 0 ? '+' : '') + stats.returnPct.toFixed(2) + '%' : '0.00%'})
              </span>
            </div>

            {/* Segmented Bar */}
            <div className="h-3 w-full rounded-full bg-stone-100 overflow-hidden flex shadow-inner border border-stone-200/80">
              {closedCount === 0 ? (
                <div className="w-full h-full bg-stone-200/70 flex items-center justify-center text-[8.5px] text-stone-400 font-mono">
                  No completed trades yet
                </div>
              ) : (
                <>
                  {winWidthPct > 0 && (
                    <div
                      style={{ width: `${winWidthPct}%` }}
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-500"
                      title={`Profit: ${winsCount} trades (${winRate.toFixed(1)}%)`}
                    />
                  )}
                  {beWidthPct > 0 && (
                    <div
                      style={{ width: `${beWidthPct}%` }}
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                      title={`Breakeven: ${breakevenCount} trades (${breakevenRate.toFixed(1)}%)`}
                    />
                  )}
                  {lossWidthPct > 0 && (
                    <div
                      style={{ width: `${lossWidthPct}%` }}
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                      title={`Loss: ${lossesCount} trades (${lossRate.toFixed(1)}%)`}
                    />
                  )}
                </>
              )}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[9.5px] font-mono text-stone-500 pt-0.5">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  <span>Profit ({winsCount})</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span>Breakeven ({breakevenCount})</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                  <span>Loss ({lossesCount})</span>
                </span>
              </div>

              <span className="font-semibold text-stone-800">
                Equity: ${formatPrice(stats.currentEquity || stats.startingBalance || 300)}
              </span>
            </div>
          </div>

          {/* Quick Shortcut to Trading Journal */}
          <button
            onClick={() => {
              onClose();
              if (onOpenJournal) onOpenJournal();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#262420] text-amber-300 hover:bg-stone-800 active:scale-95 transition text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>Open Complete Trading Journal</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

        {/* Delete Bot Data Button at bottom */}
        <div className="pt-4 border-t border-[#e5decb] space-y-2">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-2.5 px-3 rounded-xl border border-red-300 bg-red-50 text-red-800 hover:bg-red-100 active:scale-95 transition text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-2xs"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
            <span>Delete Trading Bot Data Completely</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal to Delete Trading Bot Data Completely */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          style={{ backgroundColor: 'rgba(26, 24, 20, 0.70)', backdropFilter: 'blur(3px)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting) setShowDeleteModal(false);
          }}
        >
          <div
            className="w-full max-w-md bg-[#fcfaf5] rounded-2xl shadow-2xl border border-red-300 p-4 sm:p-5 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-stone-900 tracking-tight font-serif">
                  Delete Trading Bot Data
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  Choose whether to delete only the auto-bot orders or wipe all trading records and reset starting capital.
                </p>
              </div>
            </div>

            {deleteSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{deleteSuccess}</span>
              </div>
            ) : (
              <div className="space-y-2 pt-1 font-mono">
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[10px] text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                    <span>Scope:</span>
                  </div>
                  <p className="text-stone-600">
                    {isSignedIn
                      ? `Your records (${user?.primaryEmailAddress?.emailAddress || 'User'}) will be permanently deleted from Supabase Cloud DB.`
                      : 'Local storage trade history will be reset.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <button
                    disabled={isDeleting}
                    onClick={handleDeleteBotOnly}
                    className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Bot Trades Only</span>
                  </button>

                  <button
                    disabled={isDeleting}
                    onClick={handleDeleteAll}
                    className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Wipe All Data</span>
                  </button>
                </div>

                <button
                  disabled={isDeleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full mt-2 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-[#ede5d3] active:scale-98 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
