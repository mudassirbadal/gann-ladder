import { useState, useMemo } from 'react';
import { Sliders, X, Send, Compass, Layers, RotateCw, ExternalLink, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import CustomDropdown from '../Common/CustomDropdown';
import { testXmConnection } from '../../utils/xmMetaApi';

export default function SettingsDrawer({
  isOpen,
  onClose,
  activeItem,
  selectedSymbol,
  assets,
  setAssets,
  telegramConfig,
  setTelegramConfig,
  xmConfig = { token: '', accountId: '', symbol: 'GOLD', enabled: false },
  setXmConfig,
  onTestNotification
}) {
  const [testingXm, setTestingXm] = useState(false);
  const [xmTestResult, setXmTestResult] = useState(null);
  const [xmTestError, setXmTestError] = useState(null);

  const handleTestXm = async () => {
    setTestingXm(true);
    setXmTestResult(null);
    setXmTestError(null);
    try {
      const res = await testXmConnection(xmConfig);
      setXmTestResult(res);
    } catch (err) {
      setXmTestError(err.message || 'Connection failed. Please check token and account ID.');
    } finally {
      setTestingXm(false);
    }
  };
  const stepOptions = useMemo(
    () => [
      {
        value: 45,
        label: '45° · Fine Step',
        sublabel: '1/8 Square of 9 · Best for scalp & 15m moves',
        badge: 'Scalp',
        badgeColor: 'bg-blue-100 text-blue-800',
        icon: <Compass className="w-4 h-4 text-blue-600" />
      },
      {
        value: 90,
        label: '90° · Standard Step',
        sublabel: '1/4 Gann Cycle · Cardinal cross levels',
        badge: 'Default',
        badgeColor: 'bg-amber-100 text-amber-800',
        icon: <Layers className="w-4 h-4 text-amber-600" />
      },
      {
        value: 180,
        label: '180° · Major Step',
        sublabel: 'Half Cycle · Major swing reversal zones',
        badge: 'Macro',
        badgeColor: 'bg-purple-100 text-purple-800',
        icon: <RotateCw className="w-4 h-4 text-purple-600" />
      }
    ],
    []
  );

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

        {/* Section B: XM Broker Gold Data (MetaApi Cloud) */}
        <div className="pt-4 border-t border-[#e5decb] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>2. XM Broker Gold Feed (MetaApi Cloud)</span>
            </h4>
            <a
              href="https://app.metaapi.cloud"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-amber-800 hover:underline flex items-center gap-0.5 font-mono"
            >
              <span>MetaApi Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Connect your <strong>XM MT4 or MT5</strong> account in the cloud. Streams exact XM bid/ask quotes and candles for Gold (<code className="px-1 py-0.2 bg-[#f0ebe0] rounded font-mono text-[10px]">GOLD</code> or <code className="px-1 py-0.2 bg-[#f0ebe0] rounded font-mono text-[10px]">XAUUSD</code>) directly on your phone or computer.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              MetaApi API Token
            </label>
            <input
              type="password"
              placeholder="e.g. eyJhbGciOi..."
              value={xmConfig.token || ''}
              onChange={(e) =>
                setXmConfig?.({ ...xmConfig, token: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-[#d8d0be] bg-white text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                MetaApi Account ID
              </label>
              <input
                type="text"
                placeholder="e.g. 5e1a2b3c-4d5e..."
                value={xmConfig.accountId || ''}
                onChange={(e) =>
                  setXmConfig?.({ ...xmConfig, accountId: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#d8d0be] bg-white text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                XM Symbol
              </label>
              <select
                value={xmConfig.symbol || 'GOLD'}
                onChange={(e) =>
                  setXmConfig?.({ ...xmConfig, symbol: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#d8d0be] bg-white text-xs font-mono font-bold"
              >
                <option value="GOLD">GOLD (XM Standard)</option>
                <option value="XAUUSD">XAUUSD (Spot Gold)</option>
                <option value="GOLDmicro">GOLDmicro (XM Micro)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(xmConfig.enabled)}
                onChange={(e) =>
                  setXmConfig?.({ ...xmConfig, enabled: e.target.checked })
                }
                className="rounded accent-amber-700"
              />
              <span>Enable XM Feed for Gold</span>
            </label>

            <button
              onClick={handleTestXm}
              disabled={testingXm}
              className="px-3 py-1.5 rounded-lg bg-[#b88c19] text-stone-900 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500 active:scale-95 transition shadow-2xs disabled:opacity-50"
            >
              {testingXm ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Test Connection</span>
                </>
              )}
            </button>
          </div>

          {/* Test Result Message */}
          {xmTestResult && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono flex items-start gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">XM Account Connected Successfully!</div>
                <div className="text-[11px] mt-0.5 text-emerald-800">
                  Symbol: <strong>{xmTestResult.symbol}</strong> · Price: <strong>${xmTestResult.price?.toFixed(2)}</strong> (Bid: ${xmTestResult.bid?.toFixed(2)} / Ask: ${xmTestResult.ask?.toFixed(2)})
                </div>
              </div>
            </div>
          )}

          {xmTestError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-mono flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Connection Failed</div>
                <div className="text-[11px] mt-0.5 text-rose-700">{xmTestError}</div>
              </div>
            </div>
          )}

          {/* Quick Setup Instructions Accordion */}
          <div className="p-2.5 rounded-xl bg-[#f5efe4] border border-[#dcd3bf] text-[11px] text-stone-600 space-y-1">
            <span className="font-bold text-stone-800 block">How to get your credentials (2 mins):</span>
            <ol className="list-decimal list-inside space-y-0.5 text-[10.5px]">
              <li>Sign up for free at <a href="https://app.metaapi.cloud" target="_blank" rel="noreferrer" className="text-amber-800 underline font-semibold">app.metaapi.cloud</a>.</li>
              <li>Click <strong>&quot;Add Account&quot;</strong> ➔ Select MT4/MT5 ➔ Search your XM server (e.g. <em>XMGlobal-Real 50</em>).</li>
              <li>Enter your XM login &amp; investor (read-only) password.</li>
              <li>Copy your <strong>API Token</strong> and <strong>Account ID</strong> into this box.</li>
            </ol>
          </div>
        </div>

        {/* Section C: Customizing Base Anchor Price & Step */}
        <div className="pt-4 border-t border-[#e5decb] space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
            3. Gann Base Anchor ({activeItem?.name})
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
              <CustomDropdown
                value={assets[selectedSymbol]?.stepDegrees || 90}
                onChange={(val) => {
                  setAssets((prev) => ({
                    ...prev,
                    [selectedSymbol]: {
                      ...prev[selectedSymbol],
                      stepDegrees: Number(val),
                      presetLevels: null
                    }
                  }));
                }}
                options={stepOptions}
                size="md"
                align="right"
                className="w-full"
                buttonClassName="w-full bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
