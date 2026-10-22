import {
  X,
  Briefcase,
  BookOpen,
  Bell,
  Settings,
  Smartphone,
  Volume2,
  VolumeX,
  Radio,
  Zap,
  RotateCcw,
  ShieldCheck,
  Compass,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function MobileMenuDrawer({
  isOpen,
  onClose,
  dataMode,
  setDataMode,
  soundEnabled,
  setSoundEnabled,
  paperTrading,
  onOpenJournal,
  onOpenRules,
  onOpenAlerts,
  onOpenSettings,
  onOpenPwa,
  alertsCount = 0,
  onSimulateReaction,
  onResetPresets,
  astroState
}) {
  if (!isOpen) return null;

  const currentEquity = paperTrading?.stats?.currentEquity ?? 300;
  const normalized100Current = paperTrading?.stats?.normalized100Current ?? 100;
  const normalized100Profit = paperTrading?.stats?.normalized100Profit ?? 0;
  const autoTradingEnabled = paperTrading?.autoTradingEnabled ?? true;
  const openTradesCount = paperTrading?.openTrades?.length ?? 0;

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-end"
      style={{ backgroundColor: 'rgba(30, 29, 26, 0.55)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm sm:max-w-md h-full p-4 sm:p-5 overflow-y-auto shadow-2xl space-y-4 bg-[#fcfaf5] border-l border-[#dfd7c6] flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#e5decb]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#262420] text-amber-400 flex items-center justify-center font-bold text-sm shadow-sm font-mono">
                9°
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm tracking-wide">
                  GANN RADAR MENU
                </h3>
                <p className="text-[10px] text-stone-500 font-mono">
                  1:1000 Lev · $300 Base · 1:2 R:R
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-[#ede7d6] transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Paper Trading & Auto-Bot Quick Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#262420] to-[#1c1b18] text-[#fcfaf5] shadow-md border border-[#3e3a32]">
            <div className="flex items-center justify-between pb-2 border-b border-stone-700/60">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono tracking-wider">
                  PAPER AUTO-TRADING BOT
                </span>
              </div>
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                  autoTradingEnabled
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                    : 'bg-stone-800 text-stone-400 border border-stone-600'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    autoTradingEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'
                  }`}
                />
                {autoTradingEnabled ? 'BOT ACTIVE' : 'PAUSED'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 my-2.5 font-mono">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[9px] text-stone-400 uppercase">Account Equity</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  ${formatPrice(currentEquity)}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[9px] text-stone-400 uppercase">$100 Baseline</div>
                <div
                  className={`text-sm font-bold mt-0.5 ${
                    normalized100Profit >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  ${formatPrice(normalized100Current)}{' '}
                  <span className="text-[10px]">
                    ({normalized100Profit >= 0 ? '+' : ''}
                    {normalized100Profit.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenJournal();
              }}
              className="w-full py-2 px-3 rounded-xl bg-[#d4a72c] hover:bg-[#b88c19] text-stone-900 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Open Trading Journal ({openTradesCount} Active)</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto" />
            </button>
          </div>

          {/* Main Navigation Actions */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 px-1">
              Main Sections
            </span>

            {/* Trading Rules & Playbook */}
            <button
              onClick={() => {
                onClose();
                onOpenRules();
              }}
              className="w-full p-2.5 rounded-xl bg-[#faf7f0] border border-[#e2dac9] hover:bg-[#f3ede0] text-stone-800 flex items-center justify-between transition active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">Gann Trading Rules & Playbook</div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    Entry triggers, 15pt Gold SL, 1:2 R:R guidelines
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Alerts Center */}
            <button
              onClick={() => {
                onClose();
                onOpenAlerts();
              }}
              className="w-full p-2.5 rounded-xl bg-[#faf7f0] border border-[#e2dac9] hover:bg-[#f3ede0] text-stone-800 flex items-center justify-between transition active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>Reactions & Alerts</span>
                    {alertsCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-600 text-white font-mono">
                        {alertsCount}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    Degree touches, rejection & bounce logs
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Settings & Telegram */}
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="w-full p-2.5 rounded-xl bg-[#faf7f0] border border-[#e2dac9] hover:bg-[#f3ede0] text-stone-800 flex items-center justify-between transition active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">Settings & Telegram Bot</div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    Connect Telegram alerts, configure pivots
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* PWA Mobile App Setup */}
            <button
              onClick={() => {
                onClose();
                onOpenPwa();
              }}
              className="w-full p-2.5 rounded-xl bg-[#faf7f0] border border-[#e2dac9] hover:bg-[#f3ede0] text-stone-800 flex items-center justify-between transition active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">Install as Mobile App (PWA)</div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    Add to iPhone or Android Home Screen
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
          </div>

          {/* Quick Settings & Toggles */}
          <div className="space-y-2 pt-2 border-t border-[#e5decb]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 px-1">
              Quick Controls
            </span>

            <div className="grid grid-cols-2 gap-2">
              {/* Data Mode Switcher */}
              <div className="p-2.5 rounded-xl bg-[#f5f0e4] border border-[#ded5c2] flex flex-col justify-between">
                <span className="text-[10px] text-stone-500 font-mono font-semibold">
                  Market Stream
                </span>
                <div className="mt-1 flex rounded-lg p-0.5 bg-[#e5decf] border border-[#d2c8b4]">
                  <button
                    onClick={() => setDataMode('reference')}
                    className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition ${
                      dataMode === 'reference'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600'
                    }`}
                  >
                    Preset
                  </button>
                  <button
                    onClick={() => setDataMode('live')}
                    className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition flex items-center justify-center gap-1 ${
                      dataMode === 'live'
                        ? 'bg-white text-emerald-800 shadow-2xs'
                        : 'text-stone-600'
                    }`}
                  >
                    <Radio className="w-2.5 h-2.5 text-emerald-600" />
                    Live
                  </button>
                </div>
              </div>

              {/* Sound Chime Toggle */}
              <div className="p-2.5 rounded-xl bg-[#f5f0e4] border border-[#ded5c2] flex flex-col justify-between">
                <span className="text-[10px] text-stone-500 font-mono font-semibold">
                  Audio Alerts
                </span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`mt-1 py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 border transition ${
                    soundEnabled
                      ? 'bg-white text-amber-900 border-[#c59416]'
                      : 'bg-[#ded6c3] text-stone-600 border-transparent'
                  }`}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>Chime ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                      <span>Muted</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Test Simulation Controls */}
            <div className="p-2.5 rounded-xl bg-[#f5f0e4] border border-[#ded5c2] space-y-1.5">
              <span className="text-[10px] text-stone-500 font-mono font-semibold block">
                Simulate Instant Reaction:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => {
                    onSimulateReaction?.('rejection');
                    onClose();
                  }}
                  className="py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold bg-[#fdedec] text-[#b93834] border border-[#f3c4c2] hover:bg-[#fbd9d7] active:scale-95 transition flex items-center justify-center gap-1"
                >
                  <Zap className="w-2.5 h-2.5" />
                  <span>R1 Rejection</span>
                </button>
                <button
                  onClick={() => {
                    onSimulateReaction?.('bounce');
                    onClose();
                  }}
                  className="py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold bg-[#e6f4ec] text-[#226e44] border border-[#bce3cd] hover:bg-[#d3ecde] active:scale-95 transition flex items-center justify-center gap-1"
                >
                  <Zap className="w-2.5 h-2.5" />
                  <span>B1 Bounce</span>
                </button>
                <button
                  onClick={() => {
                    onResetPresets?.();
                    onClose();
                  }}
                  className="py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold bg-white text-stone-700 border border-[#d2c8b4] hover:bg-[#f0ebe0] active:scale-95 transition flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#e5decb] text-center text-[10px] text-stone-400 font-mono">
          Gann Square of 9 · v2.5 Auto-Trader · 1:1000 Leverage
        </div>
      </div>
    </div>
  );
}
