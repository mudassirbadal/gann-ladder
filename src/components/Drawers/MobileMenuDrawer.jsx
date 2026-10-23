import { useState, useEffect, useRef } from 'react';
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
  Compass,
  ChevronRight,
  Cpu,
  LogIn,
  Database,
  Activity
} from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { formatPrice } from '../../utils/formatters';

export default function MobileMenuDrawer({
  isOpen,
  onClose,
  dataMode,
  setDataMode,
  soundEnabled,
  setSoundEnabled,
  paperTrading,
  user,
  isSignedIn = false,
  onOpenAnalytics,
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
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isActive, setIsActive] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setIsRendered(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsActive(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setIsActive(false);
      closeTimerRef.current = setTimeout(() => {
        setIsRendered(false);
      }, 300);
      return () => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      };
    }
  }, [isOpen]);

  const handleAnimatedClose = (callback) => {
    setIsActive(false);
    setTimeout(() => {
      onClose();
      if (typeof callback === 'function') {
        callback();
      }
    }, 280);
  };

  if (!isRendered) return null;

  const currentEquity = paperTrading?.stats?.currentEquity ?? 300;
  const normalized100Current = paperTrading?.stats?.normalized100Current ?? 100;
  const normalized100Profit = paperTrading?.stats?.normalized100Profit ?? 0;
  const autoTradingEnabled = paperTrading?.autoTradingEnabled ?? true;
  const openTradesCount = paperTrading?.openTrades?.length ?? 0;

  return (
    <div
      className={`fixed inset-0 z-[70] flex justify-end transition-opacity duration-300 ease-out ${
        isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{ backgroundColor: 'rgba(30, 29, 26, 0.60)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleAnimatedClose();
      }}
    >
      <div
        className={`w-full max-w-sm sm:max-w-md h-full p-4 sm:p-5 overflow-y-auto shadow-2xl space-y-4 bg-[#fcfaf5] border-l border-[#dfd7c6] flex flex-col justify-between transform transition-transform duration-300 ease-out ${
          isActive ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#e5decb]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#262420] text-amber-400 flex items-center justify-center font-bold text-sm shadow-sm font-mono transition-transform duration-200 hover:scale-105 active:scale-95">
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
              onClick={() => handleAnimatedClose()}
              className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-[#ede7d6] hover:rotate-90 active:scale-75 transition-all duration-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account & Supabase Cloud Sync Card */}
          <div className="p-3 rounded-2xl bg-[#f4efe2] border border-[#dcd3bf]">
            <SignedIn>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonAvatarBox: 'w-8 h-8 border border-amber-500'
                      }
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-stone-900 truncate">
                      {user?.fullName || user?.firstName || 'Gann Trader'}
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Supabase Synced</span>
                    </div>
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ONLINE
                </div>
              </div>
            </SignedIn>
            <SignedOut>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-900">
                    Account & Cloud Sync
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    Sign in to sync trades to Supabase
                  </div>
                </div>
                <SignInButton mode="modal">
                  <button className="px-3 py-1.5 rounded-xl bg-[#262420] text-amber-300 hover:bg-stone-800 text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95 transition">
                    <LogIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sign In</span>
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
          </div>

          {/* Paper Trading & Auto-Bot Quick Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#262420] to-[#1c1b18] text-[#fcfaf5] shadow-md border border-[#3e3a32] transition-transform duration-200 hover:shadow-lg">
            <div className="flex items-center justify-between pb-2.5 border-b border-stone-700/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold font-mono tracking-wider flex items-center gap-1.5">
                    <span>AUTO-TRADING BOT</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        autoTradingEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'
                      }`}
                    />
                  </div>
                  <div className="text-[9px] text-stone-400 font-mono">
                    1:1000 Lev · 1:2 R:R · $300 Base
                  </div>
                </div>
              </div>

              {/* Bot Toggle Switch */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-stone-300">
                  {autoTradingEnabled ? 'ON' : 'OFF'}
                </span>
                <button
                  type="button"
                  onClick={() => paperTrading?.toggleAutoTrading?.()}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out active:scale-90 focus:outline-hidden ${
                    autoTradingEnabled ? 'bg-emerald-500' : 'bg-stone-700'
                  }`}
                  aria-label="Toggle auto trading bot"
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
                      autoTradingEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Account Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 my-2.5 font-mono">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 transition-transform duration-150 hover:bg-white/10">
                <div className="text-[9px] text-stone-400 uppercase">Account Equity</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  ${formatPrice(currentEquity)}
                </div>
                <div className="text-[8px] text-stone-400 mt-0.5">
                  Start: $300 · Lev 1:1000
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 transition-transform duration-150 hover:bg-white/10">
                <div className="text-[9px] text-stone-400 uppercase">$100 Baseline</div>
                <div
                  className={`text-sm font-bold mt-0.5 ${
                    normalized100Profit >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  ${formatPrice(normalized100Current)}
                </div>
                <div
                  className={`text-[8px] mt-0.5 font-semibold ${
                    normalized100Profit >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {normalized100Profit >= 0 ? '+' : ''}
                  {normalized100Profit.toFixed(1)}% Return
                </div>
              </div>
            </div>

            {/* Rules Badge Bar */}
            <div className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 mb-2.5 text-[9px] font-mono text-stone-300 flex items-center justify-between">
              <span>SL: Gold 15pt ($15) · BTC $15 · Alt $10</span>
              <span className="text-amber-400 font-bold">1:2 R:R</span>
            </div>

            <button
              onClick={() => handleAnimatedClose(onOpenJournal)}
              className="w-full py-2 px-3 rounded-xl bg-[#d4a72c] hover:bg-[#b88c19] text-stone-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-[0.96] hover:brightness-105 shadow-sm"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Open Trading Journal ({openTradesCount} Active)</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto transition-transform duration-150 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Main Navigation Actions */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 px-1">
              Main Sections
            </span>

            {/* Trading Bot Analytics Option in Hamburger Menu */}
            <button
              onClick={() => handleAnimatedClose(onOpenAnalytics)}
              className="w-full p-2.5 rounded-xl bg-[#faf7f0] border border-[#e2dac9] hover:bg-[#f3ede0] hover:translate-x-1 text-stone-800 flex items-center justify-between transition-all duration-150 active:scale-[0.97] group shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-110">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>Bot Trading Analytics</span>
                    <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {paperTrading?.stats?.winRate || 0}% WR
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    Win/Loss ratios, breakeven & delete bot data
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 transition-transform duration-150 group-hover:translate-x-1" />
            </button>

            {/* Trading Rules & Playbook */}
            <button
              onClick={() => handleAnimatedClose(onOpenRules)}
              className="w-full p-2.5 rounded-xl bg-[#faf7f0] border border-[#e2dac9] hover:bg-[#f3ede0] hover:translate-x-1 text-stone-800 flex items-center justify-between transition-all duration-150 active:scale-[0.97] group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-110">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">Gann Trading Rules & Playbook</div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    Entry triggers, 15pt Gold SL, 1:2 R:R guidelines
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 transition-transform duration-150 group-hover:translate-x-1" />
            </button>

            {/* Alerts Center */}
            <button
              onClick={() => handleAnimatedClose(onOpenAlerts)}
              className="w-full p-2.5 rounded-xl bg-[#faf7f0] border border-[#e2dac9] hover:bg-[#f3ede0] hover:translate-x-1 text-stone-800 flex items-center justify-between transition-all duration-150 active:scale-[0.97] group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-110">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>Reactions & Alerts</span>
                    {alertsCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-600 text-white font-mono animate-pulse">
                        {alertsCount}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    Degree touches, rejection & bounce logs
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 transition-transform duration-150 group-hover:translate-x-1" />
            </button>

            {/* Settings & Telegram */}
            <button
              onClick={() => handleAnimatedClose(onOpenSettings)}
              className="w-full p-2.5 rounded-xl bg-[#faf7f0] border border-[#e2dac9] hover:bg-[#f3ede0] hover:translate-x-1 text-stone-800 flex items-center justify-between transition-all duration-150 active:scale-[0.97] group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-110">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">Settings & Telegram Bot</div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    Connect Telegram alerts, configure pivots
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 transition-transform duration-150 group-hover:translate-x-1" />
            </button>

            {/* PWA Mobile App Setup */}
            <button
              onClick={() => handleAnimatedClose(onOpenPwa)}
              className="w-full p-2.5 rounded-xl bg-[#faf7f0] border border-[#e2dac9] hover:bg-[#f3ede0] hover:translate-x-1 text-stone-800 flex items-center justify-between transition-all duration-150 active:scale-[0.97] group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-110">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">Install as Mobile App (PWA)</div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    Add to iPhone or Android Home Screen
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 transition-transform duration-150 group-hover:translate-x-1" />
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
                    className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all duration-150 active:scale-90 ${
                      dataMode === 'reference'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600'
                    }`}
                  >
                    Preset
                  </button>
                  <button
                    onClick={() => setDataMode('live')}
                    className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all duration-150 active:scale-90 flex items-center justify-center gap-1 ${
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
                  className={`mt-1 py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 border transition-all duration-150 active:scale-90 ${
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
                  onClick={() => handleAnimatedClose(() => onSimulateReaction?.('rejection'))}
                  className="py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold bg-[#fdedec] text-[#b93834] border border-[#f3c4c2] hover:bg-[#fbd9d7] active:scale-90 hover:brightness-105 transition-all duration-150 flex items-center justify-center gap-1"
                >
                  <Zap className="w-2.5 h-2.5" />
                  <span>R1 Rejection</span>
                </button>
                <button
                  onClick={() => handleAnimatedClose(() => onSimulateReaction?.('bounce'))}
                  className="py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold bg-[#e6f4ec] text-[#226e44] border border-[#bce3cd] hover:bg-[#d3ecde] active:scale-90 hover:brightness-105 transition-all duration-150 flex items-center justify-center gap-1"
                >
                  <Zap className="w-2.5 h-2.5" />
                  <span>B1 Bounce</span>
                </button>
                <button
                  onClick={() => handleAnimatedClose(() => onResetPresets?.())}
                  className="py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold bg-white text-stone-700 border border-[#d2c8b4] hover:bg-[#f0ebe0] active:scale-90 transition-all duration-150 flex items-center justify-center gap-1"
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
