import { Sliders, X, Send } from 'lucide-react';

export default function SettingsDrawer({
  isOpen,
  onClose,
  activeItem,
  selectedSymbol,
  assets,
  setAssets,
  telegramConfig,
  setTelegramConfig,
  onTestNotification
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-end"
      style={{ backgroundColor: 'rgba(30, 29, 26, 0.45)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md h-full p-4 sm:p-5 overflow-y-auto shadow-2xl space-y-5 sm:space-y-6 bg-[#fcfaf5] border-l border-[#dfd7c6]"
      >
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#e5decb]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-700" />
            <h3
              className="text-lg sm:text-xl font-bold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Telegram & Gann Parameters
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-stone-900 rounded-lg"
            aria-label="Close settings drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section A: Telegram Live Alerts */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
            1. Direct Telegram Bot Push
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Enter your Telegram Bot Token and Chat ID to receive instant alerts whenever an{' '}
            <span className="font-mono font-semibold text-red-700">R1</span> rejection or{' '}
            <span className="font-mono font-semibold text-emerald-700">B1</span> bounce occurs.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              Telegram Bot Token
            </label>
            <input
              type="password"
              placeholder="e.g. 7123456789:AAH_xyz..."
              value={telegramConfig.botToken}
              onChange={(e) =>
                setTelegramConfig({ ...telegramConfig, botToken: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-[#d8d0be] bg-white text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              Telegram Chat ID
            </label>
            <input
              type="text"
              placeholder="e.g. 123456789"
              value={telegramConfig.chatId}
              onChange={(e) =>
                setTelegramConfig({ ...telegramConfig, chatId: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-[#d8d0be] bg-white text-xs font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={telegramConfig.enabled}
                onChange={(e) =>
                  setTelegramConfig({ ...telegramConfig, enabled: e.target.checked })
                }
                className="rounded accent-amber-700"
              />
              <span>Enable Telegram Alerts</span>
            </label>

            <button
              onClick={onTestNotification}
              className="px-3 py-1.5 rounded-lg bg-[#262420] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-800 active:scale-95 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Test</span>
            </button>
          </div>
        </div>

        {/* Section B: Customizing Base Anchor Price & Step */}
        <div className="pt-4 border-t border-[#e5decb] space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
            2. Gann Base Anchor ({activeItem?.name})
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Formula:{' '}
            <code className="px-1.5 py-0.5 rounded bg-[#efe9da] font-mono text-[11px]">
              Level = (√BaseAnchor + Degrees/180)²
            </code>
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                0° Base Anchor ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={assets[selectedSymbol]?.baseAnchor || 0}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 1;
                  setAssets((prev) => ({
                    ...prev,
                    [selectedSymbol]: {
                      ...prev[selectedSymbol],
                      baseAnchor: val,
                      liveAnchorMode: 'manual',
                      presetLevels: null
                    }
                  }));
                }}
                className="w-full px-3 py-2 rounded-lg border border-[#d8d0be] bg-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Step Size (Degrees)
              </label>
              <select
                value={assets[selectedSymbol]?.stepDegrees || 90}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setAssets((prev) => ({
                    ...prev,
                    [selectedSymbol]: {
                      ...prev[selectedSymbol],
                      stepDegrees: val,
                      presetLevels: null
                    }
                  }));
                }}
                className="w-full px-3 py-2 rounded-lg border border-[#d8d0be] bg-white text-xs font-mono"
              >
                <option value={45}>45° (Fine / 1/8 Sq)</option>
                <option value={90}>90° (Standard / 1/4 Cyc)</option>
                <option value={180}>180° (Major Pivots)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
