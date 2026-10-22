import {
  Volume2,
  VolumeX,
  Bell,
  Settings,
  Smartphone,
  Radio,
  Wifi,
  BookOpen
} from 'lucide-react';

export default function Header({
  dataMode,
  setDataMode,
  wsConnected,
  soundEnabled,
  setSoundEnabled,
  alertsCount,
  onOpenAlerts,
  onOpenSettings,
  onOpenPwa,
  onOpenRules,
  onRefreshLive
}) {
  return (
    <header className="max-w-5xl mx-auto pt-4 sm:pt-6 pb-2 sm:pb-4 px-3 sm:px-6">
      <div className="flex items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-[#dcd4c4]">
        {/* Brand & Live Connection Indicator */}
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-pulse shrink-0"
            style={{ backgroundColor: dataMode === 'live' ? '#2e8b57' : '#d4a72c' }}
          />
          <div className="flex flex-col">
            <span
              className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-stone-700 truncate"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              GANN SQUARE OF 9
            </span>
            <span
              className="text-[9px] sm:text-[10px] text-stone-500 font-mono flex items-center gap-1"
            >
              {dataMode === 'live' ? (
                <>
                  {wsConnected ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                      <Wifi className="w-2.5 h-2.5" /> WS STREAM
                    </span>
                  ) : (
                    <span className="text-amber-700">LIVE POLLING</span>
                  )}
                </>
              ) : (
                <span className="text-stone-600">PRESET MODE</span>
              )}
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-lg p-0.5 bg-[#dfd8c8] border border-[#cfc6b4]">
            <button
              onClick={() => setDataMode('reference')}
              className={`px-2 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all ${
                dataMode === 'reference'
                  ? 'bg-[#fcfaf5] text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Preset
            </button>
            <button
              onClick={() => {
                setDataMode('live');
                if (onRefreshLive) onRefreshLive();
              }}
              className={`px-2 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all flex items-center gap-1 ${
                dataMode === 'live'
                  ? 'bg-[#fcfaf5] text-emerald-800 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Radio className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />
              <span>Live</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="Toggle Alert Chime"
            className="p-1.5 sm:p-2 rounded-lg bg-[#fcfaf5] border border-[#dcd4c4] text-stone-700 hover:bg-[#f4efe4] active:scale-95 transition"
            aria-label="Toggle alert chime"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
            )}
          </button>

          {/* Alerts Drawer Button */}
          <button
            onClick={onOpenAlerts}
            className="relative px-2 sm:px-3 py-1.5 rounded-lg bg-[#fcfaf5] border border-[#dcd4c4] text-stone-800 hover:bg-[#f4efe4] active:scale-95 transition flex items-center gap-1 text-[11px] sm:text-xs font-medium"
            aria-label="View alerts"
          >
            <Bell className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-700" />
            <span className="hidden xs:inline">Alerts</span>
            {alertsCount > 0 && (
              <span
                className="px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-100 text-amber-900"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {alertsCount}
              </span>
            )}
          </button>

          {/* Trading Rules Button */}
          <button
            onClick={onOpenRules}
            className="px-2 sm:px-3 py-1.5 rounded-lg bg-[#fcfaf5] border border-[#dcd4c4] text-stone-800 hover:bg-[#f4efe4] active:scale-95 transition flex items-center gap-1.5 text-xs font-medium"
            title="Gann Trading Rules & Playbook"
            aria-label="Open trading rules"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#fcfaf5] border border-[#dcd4c4] text-stone-800 hover:bg-[#f4efe4] active:scale-95 transition flex items-center gap-1.5 text-xs font-medium"
            title="Settings & Telegram"
            aria-label="Open settings"
          >
            <Settings className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden md:inline">Settings</span>
          </button>

          {/* PWA Android Guide Button */}
          <button
            onClick={onOpenPwa}
            className="hidden sm:flex px-2.5 py-1.5 rounded-lg bg-[#2b2925] text-[#fcfaf5] hover:bg-stone-800 active:scale-95 transition items-center gap-1.5 text-xs font-medium shadow-sm"
            title="Android & iOS PWA Guide"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Install App</span>
          </button>
        </div>
      </div>
    </header>
  );
}
