import { useMemo } from 'react';
import { Anchor, X, Wifi, Layers, BarChart2, Award, Compass } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import CustomDropdown from '../Common/CustomDropdown';

export default function ModalHeader({
  activeItem,
  allAssets,
  onSelectSymbol,
  dataMode,
  wsConnected,
  priceTickFlash,
  showAnchorPopover,
  setShowAnchorPopover,
  modalTab,
  setModalTab,
  onClose
}) {
  const assetsList = useMemo(() => (allAssets ? Object.values(allAssets) : []), [allAssets]);

  const coinDropdownOptions = useMemo(() => {
    return assetsList.map((coin) => {
      const isUp = (coin.change24h || 0) >= 0;
      return {
        value: coin.id,
        label: coin.name,
        sublabel: `${coin.ticker} · $${formatPrice(coin.priceNow)}`,
        badge: `${isUp ? '+' : ''}${coin.change24h ? coin.change24h.toFixed(2) : '0.00'}%`,
        badgeColor: isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800',
        icon: (
          <span
            className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
            style={{ backgroundColor: coin.badgeColor }}
          >
            {coin.symbolBadge}
          </span>
        )
      };
    });
  }, [assetsList]);

  return (
    <div className="shrink-0 border-b border-[#ece5d5]">
      {/* Quick 5-Coin Switcher Row directly inside modal header */}
      {assetsList.length > 0 && (
        <div className="px-3 sm:px-5 pt-2 pb-1.5 bg-[#f4efe2] border-b border-[#e5decb]">
          <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
            {assetsList.map((coin) => {
              const isCurrent = activeItem.id === coin.id;
              const shortLabel = coin.id.includes('PAXG') || coin.id.includes('XAU') ? 'Gold' : coin.ticker.split('/')[0];
              return (
                <button
                  key={coin.id}
                  onClick={() => onSelectSymbol && onSelectSymbol(coin.id)}
                  className={`py-1 px-1 sm:px-2 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95 ${
                    isCurrent
                      ? 'bg-[#262420] text-[#fcfaf5] shadow-xs ring-1 ring-[#c59416]'
                      : 'bg-[#fcfaf5] text-stone-700 hover:bg-[#ede6d6] border border-[#dcd3bf]'
                  }`}
                  title={`${coin.name} ($${formatPrice(coin.priceNow)})`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                    style={{ backgroundColor: coin.badgeColor }}
                  >
                    {coin.symbolBadge}
                  </span>
                  <span className="truncate">
                    <span className="sm:hidden">{shortLabel}</span>
                    <span className="hidden sm:inline">{coin.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Asset Header: Emblem, Title, Price, Close */}
      <div className="px-3.5 sm:px-5 pt-3 pb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          {/* Asset Emblem */}
          {activeItem.id === 'PAXGUSDT' ? (
            <div
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 shadow-xs"
              style={{
                backgroundColor: '#faf5e6',
                border: '1.5px solid #d4b257',
                color: '#9e7b1c',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                fontSize: '15px'
              }}
            >
              Au
            </div>
          ) : (
            <div
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 shadow-xs p-0.5"
              style={{
                backgroundColor: '#fdfaf2',
                border: '1.5px solid #e6dec8'
              }}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg"
                style={{ backgroundColor: activeItem.badgeColor }}
              >
                {activeItem.symbolBadge}
              </div>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2
                className="text-lg sm:text-[24px] leading-tight text-[#1e1d1a] truncate"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: 'italic',
                  fontWeight: 700
                }}
              >
                {activeItem.name}
              </h2>
              {/* Desktop-only dropdown option, keeping mobile view 100% clean and non-overlapping */}
              <div className="hidden md:inline-block">
                <CustomDropdown
                  value={activeItem.id}
                  onChange={(id) => onSelectSymbol && onSelectSymbol(id)}
                  options={coinDropdownOptions}
                  size="sm"
                  align="left"
                  buttonClassName="bg-[#f4efe2] border-[#dcd3bf] hover:bg-white text-[10px] sm:text-xs py-0.5 px-2 font-mono shrink-0"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-0.5 font-mono">
              <span className="text-[11px] sm:text-xs text-[#7c776b] font-medium">
                {activeItem.ticker.split('/')[0]}
                <span className="opacity-70">/{activeItem.ticker.split('/')[1]}</span>
              </span>

              {activeItem.isPerp && (
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-semibold bg-[#fcf6e4] border border-[#d9be6c] text-[#997411]">
                  PERP
                </span>
              )}

              <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.2 rounded font-semibold bg-[#fcf6e4] border border-[#d9be6c] text-[#997411]">
                {activeItem.activeCycle}
              </span>

              {/* Custom Anchor Quick Pill */}
              <button
                onClick={() => setShowAnchorPopover(!showAnchorPopover)}
                className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.2 rounded font-semibold flex items-center gap-1 transition active:scale-95"
                style={{
                  backgroundColor: showAnchorPopover ? '#262420' : '#f2ece0',
                  border: '1px solid #d5ccb8',
                  color: showAnchorPopover ? '#fcfaf5' : '#5c574f'
                }}
                title="Customize 0° Gann Base Pivot & Step Size"
              >
                <Anchor className="w-2.5 h-2.5" />
                <span>0°=${formatPrice(activeItem.effectiveAnchor, 0)}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Price + 24h Pill + Close X */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-right z-10 pl-1">
          <div className="text-right flex flex-col items-end shrink-0">
            <div
              className="text-base sm:text-[20px] font-bold tracking-tight transition-colors duration-300 px-1 rounded font-mono whitespace-nowrap"
              style={{
                color:
                  priceTickFlash[activeItem.id] === 'up'
                    ? '#1f7a46'
                    : priceTickFlash[activeItem.id] === 'down'
                    ? '#c93b37'
                    : '#1e1d1a',
                backgroundColor:
                  priceTickFlash[activeItem.id] === 'up'
                    ? '#e6f5ec'
                    : priceTickFlash[activeItem.id] === 'down'
                    ? '#fbe9e8'
                    : 'transparent'
              }}
            >
              ${formatPrice(activeItem.priceNow)}
            </div>
            <div className="mt-0.5 flex justify-end items-center gap-1 shrink-0">
              {dataMode === 'live' && wsConnected && (
                <span
                  className="inline-flex items-center gap-0.5 text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono font-bold shrink-0"
                  title="Sub-second Binance WebSocket Stream Active"
                >
                  <Wifi className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                  LIVE
                </span>
              )}
              <span
                className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-semibold px-2 py-0.2 rounded-full font-mono shrink-0 whitespace-nowrap"
                style={{
                  backgroundColor: activeItem.change24h < 0 ? '#faeceb' : '#e5f5ec',
                  border:
                    activeItem.change24h < 0
                      ? '1px solid #ecc6c4'
                      : '1px solid #bce3cd',
                  color: activeItem.change24h < 0 ? '#b93834' : '#216e43'
                }}
              >
                {activeItem.change24h < 0 ? '▼' : '▲'}{' '}
                {Math.abs(activeItem.change24h).toFixed(2)}%
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#8c8577] hover:text-[#1e1d1a] p-1.5 -mr-1 rounded-lg hover:bg-[#efe9dc] transition shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs Switcher + Live Confluence & Wick Bar */}
      <div className="px-3.5 sm:px-5 pb-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* View Switcher Tabs */}
        <div className="inline-flex rounded-xl p-0.5 bg-[#efe9da] border border-[#dcd3c0] overflow-x-auto">
          <button
            onClick={() => setModalTab('ladder')}
            className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold transition flex items-center gap-1 active:scale-95 ${
              modalTab === 'ladder'
                ? 'bg-[#fcfaf5] text-[#1e1d1a] shadow-sm'
                : 'text-[#6e685c] hover:text-[#1e1d1a]'
            }`}
          >
            <Layers className="w-3 h-3 text-amber-700" />
            <span>Ladder</span>
          </button>
          <button
            onClick={() => setModalTab('astro')}
            className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold transition flex items-center gap-1 active:scale-95 ${
              modalTab === 'astro'
                ? 'bg-[#fcfaf5] text-[#1e1d1a] shadow-sm'
                : 'text-[#6e685c] hover:text-[#1e1d1a]'
            }`}
          >
            <Compass className="w-3 h-3 text-purple-700" />
            <span>Astro</span>
          </button>
          <button
            onClick={() => setModalTab('chart')}
            className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold transition flex items-center gap-1 active:scale-95 ${
              modalTab === 'chart'
                ? 'bg-[#fcfaf5] text-[#1e1d1a] shadow-sm'
                : 'text-[#6e685c] hover:text-[#1e1d1a]'
            }`}
          >
            <BarChart2 className="w-3 h-3 text-emerald-700" />
            <span>Chart</span>
          </button>
          <button
            onClick={() => setModalTab('analytics')}
            className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold transition flex items-center gap-1 active:scale-95 ${
              modalTab === 'analytics'
                ? 'bg-[#fcfaf5] text-[#1e1d1a] shadow-sm'
                : 'text-[#6e685c] hover:text-[#1e1d1a]'
            }`}
          >
            <Award className="w-3 h-3 text-amber-700" />
            <span>Win-Rate</span>
          </button>
        </div>

        {/* Live Confluence Badges: 14-Period RSI + 15m Wick Ratio Meter */}
        <div className="flex items-center gap-1.5 font-mono ml-auto">
          {/* 15m RSI Pill */}
          <span
            className="text-[9px] sm:text-[10px] px-2 py-0.5 sm:py-1 rounded-lg font-semibold border"
            style={{
              backgroundColor:
                activeItem.rsi15m <= 33
                  ? '#e6f4ec'
                  : activeItem.rsi15m >= 67
                  ? '#faeceb'
                  : '#f5f0e4',
              borderColor:
                activeItem.rsi15m <= 33
                  ? '#b4dec6'
                  : activeItem.rsi15m >= 67
                  ? '#e6b8b6'
                  : '#ded6c3',
              color:
                activeItem.rsi15m <= 33
                  ? '#216e43'
                  : activeItem.rsi15m >= 67
                  ? '#b93834'
                  : '#5c574f'
            }}
            title="14-Period RSI Confluence Filter"
          >
            RSI {activeItem.rsi15m}
          </span>

          {/* 15m Rejection Wick Meter Pill */}
          <div
            className="px-2 py-0.5 sm:py-1 rounded-lg border flex items-center gap-1.5"
            style={{
              backgroundColor: activeItem.wickRatio >= 50 ? '#fcf6e4' : '#f5f0e4',
              borderColor: activeItem.wickRatio >= 50 ? '#d9be6c' : '#ded6c3',
              color: activeItem.wickRatio >= 50 ? '#997411' : '#5c574f'
            }}
            title="Latest 15m Candle Rejection Wick Ratio"
          >
            <span className="text-[9px] sm:text-[10px] font-semibold">
              Wick {activeItem.wickRatio}%
            </span>
            <div className="w-6 sm:w-8 h-1.5 rounded-full bg-[#e3dccb] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, activeItem.wickRatio)}%`,
                  backgroundColor: activeItem.wickRatio >= 50 ? '#c59416' : '#8c8577'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
