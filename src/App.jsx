import { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_ASSETS } from './constants/assets';
import { formatPrice, getISTTimeStr } from './utils/formatters';
import { playAlertChime } from './utils/audio';
import {
  calculateRSI,
  calculateWickMetrics,
  generatePresetCandles,
  buildGannLadder,
  assignRanksAndTrimLadder
} from './utils/gannMath';
import { useBinanceMarket } from './hooks/useBinanceMarket';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AssetSelector from './components/AssetSelector';
import ToastAlert from './components/ToastAlert';
import MobileBottomNav from './components/MobileBottomNav';
import GannModal from './components/Modal/GannModal';
import AlertsDrawer from './components/Drawers/AlertsDrawer';
import SettingsDrawer from './components/Drawers/SettingsDrawer';
import PwaDrawer from './components/Drawers/PwaDrawer';

export default function App() {
  const [dataMode, setDataMode] = useState('reference');
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [modalTab, setModalTab] = useState('ladder');
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Global Risk & Position Sizing Account Settings
  const [accountBalance, setAccountBalance] = useState(10000);
  const [riskPerTradePct, setRiskPerTradePct] = useState(1.0);

  // Inline Custom Anchor Popover
  const [showAnchorPopover, setShowAnchorPopover] = useState(false);

  // Active Drawer
  const [activeDrawer, setActiveDrawer] = useState(null); // 'alerts' | 'settings' | 'pwa' | null

  // Audio and Push
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [browserPushEnabled, setBrowserPushEnabled] = useState(false);
  const [telegramConfig, setTelegramConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('gann_tg_config');
      return saved ? JSON.parse(saved) : { botToken: '', chatId: '', enabled: false };
    } catch {
      return { botToken: '', chatId: '', enabled: false };
    }
  });

  const [alertsLog, setAlertsLog] = useState([
    {
      id: 'init-1',
      symbol: 'BTC/USDT',
      type: 'bounce',
      title: 'Bounced from 90° · Cycle 12',
      levelPrice: 81462.69,
      currentPrice: 81548.00,
      degree: '90° · Cycle 12',
      message: 'Degree 90° marked as USED. Moved +$85.31 (0.10%) from bounce zone.',
      time: 'Today · 19:45 IST'
    },
    {
      id: 'init-2',
      symbol: 'XAU/USDT',
      type: 'rejection',
      title: 'Rejected from 270° · Cycle 1',
      levelPrice: 4138.93,
      currentPrice: 4061.06,
      degree: '270°',
      message: 'Degree 270° marked as USED. Moved -$85.28 (2.06%) from rejection zone.',
      time: 'Oct 21 · 14:30 IST'
    }
  ]);

  const [activeToast, setActiveToast] = useState(null);

  // Save Telegram config
  useEffect(() => {
    try {
      localStorage.setItem('gann_tg_config', JSON.stringify(telegramConfig));
    } catch {
      // ignore storage error
    }
  }, [telegramConfig]);

  // Prevent background body scroll when modal or any drawer is open
  useEffect(() => {
    if (isModalOpen || activeDrawer) {
      const scrollY = window.scrollY;
      const prevOverflow = document.body.style.overflow;
      const prevPosition = document.body.style.position;
      const prevTop = document.body.style.top;
      const prevWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.position = prevPosition;
        document.body.style.top = prevTop;
        document.body.style.width = prevWidth;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isModalOpen, activeDrawer]);

  // Hook for live market stream
  const {
    livePrices,
    liveChanges,
    liveCandles,
    liveCandles15m,
    wsConnected,
    priceTickFlash,
    fetchBinanceLiveMarket
  } = useBinanceMarket({ assets, dataMode });

  // Notification dispatcher
  const triggerNotification = useCallback(
    async ({ symbol, type, title, levelPrice, currentPrice, degree, message }) => {
      const newAlert = {
        id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        symbol,
        type,
        title,
        levelPrice,
        currentPrice,
        degree,
        message,
        time: getISTTimeStr()
      };

      setAlertsLog((prev) => [newAlert, ...prev.slice(0, 49)]);
      setActiveToast(newAlert);

      if (soundEnabled) {
        playAlertChime(type === 'rejection' ? 'rejection' : 'bounce');
      }

      // Browser push notification
      if (browserPushEnabled && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(`${symbol}: ${title}`, {
            body: `${message} | Price: $${formatPrice(currentPrice)}`,
            tag: newAlert.id
          });
        } catch {
          // mobile notification fallback
        }
      }

      // Telegram push
      if (telegramConfig.enabled && telegramConfig.botToken && telegramConfig.chatId) {
        const emoji = type === 'rejection' ? '🔴' : type === 'bounce' ? '🟢' : '⚠️';
        const tgText =
          `${emoji} <b>${title}</b>\n\n` +
          `<b>Asset:</b> ${symbol}\n` +
          `<b>Degree:</b> ${degree}\n` +
          `<b>Level Price:</b> $${formatPrice(levelPrice)}\n` +
          `<b>Price Now:</b> $${formatPrice(currentPrice)}\n` +
          `<b>Note:</b> ${message}\n` +
          `<b>Time:</b> ${newAlert.time}`;

        try {
          await fetch(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramConfig.chatId,
              text: tgText,
              parse_mode: 'HTML'
            })
          });
        } catch (err) {
          console.warn('Telegram push error:', err);
        }
      }
    },
    [soundEnabled, browserPushEnabled, telegramConfig]
  );

  // Auto-hide toast after 6s
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => setActiveToast(null), 6000);
    return () => clearTimeout(timer);
  }, [activeToast]);

  // Request browser push permissions
  const requestBrowserNotifications = async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setBrowserPushEnabled(true);
      triggerNotification({
        symbol: 'SYSTEM',
        type: 'bounce',
        title: 'Browser Push Alerts Enabled',
        levelPrice: 0,
        currentPrice: livePrices[selectedSymbol] || assets[selectedSymbol]?.snapshotPrice || 0,
        degree: 'Gann Engine',
        message: 'Instant notifications enabled for Gann degree reactions.'
      });
    }
  };

  // Compute active ladder, confluence metrics, and candles
  const computedLadders = useMemo(() => {
    const result = {};

    for (const sym of Object.keys(assets)) {
      const cfg = assets[sym];
      const priceNow =
        dataMode === 'live' && livePrices[sym] ? livePrices[sym] : cfg.snapshotPrice;
      const change24h =
        dataMode === 'live' && liveChanges[sym] !== undefined
          ? liveChanges[sym]
          : cfg.snapshotChange24h;

      let ladderData;
      const candles4h = liveCandles[sym] || [];
      const candles15m = liveCandles15m[sym] || [];
      let effectiveAnchor = cfg.baseAnchor;

      if (dataMode === 'reference' && cfg.presetLevels) {
        ladderData = assignRanksAndTrimLadder(cfg.presetLevels, priceNow);
      } else {
        if (dataMode === 'live' && cfg.liveAnchorMode === 'auto' && candles4h.length > 10) {
          const closed = candles4h.slice(0, -1);
          const minLow = Math.min(...closed.map((c) => c.low));
          effectiveAnchor = Number((minLow * 0.96).toFixed(2));
        }

        ladderData = buildGannLadder({
          baseAnchor: effectiveAnchor,
          currentPrice: priceNow,
          stepDegrees: cfg.stepDegrees,
          showCycleInRows: cfg.showCycleInRows,
          scaleFactor: cfg.scaleFactor,
          candles: candles4h,
          tolerancePct: cfg.tolerancePct,
          minReactionPct: cfg.minReactionPct
        });
      }

      const activeCycle =
        ladderData.r1?.cycle
          ? `Cycle ${ladderData.r1.cycle}`
          : cfg.snapshotCycle;

      const liveRsi = calculateRSI(candles15m.length > 15 ? candles15m : candles4h, 14);
      const rsi15m = dataMode === 'live' && liveRsi !== null ? liveRsi : cfg.presetRsi15m || 45.0;

      const liveWick = calculateWickMetrics(candles15m.length > 2 ? candles15m : candles4h);
      const wickRatio =
        dataMode === 'live' && candles15m.length > 2
          ? liveWick.ratio
          : cfg.presetWickRatio || 58.0;

      const allDisplayed = [...ladderData.above, ...ladderData.below];
      const usedLevels = allDisplayed.filter((l) => l.used || l.rank === 'USED');
      const avgMovePct =
        usedLevels.length > 0
          ? usedLevels.reduce((acc, l) => acc + (l.movePct || 0), 0) / usedLevels.length
          : 3.45;

      const chartCandles =
        candles4h.length > 10 ? candles4h : generatePresetCandles(cfg, ladderData);

      result[sym] = {
        ...cfg,
        priceNow,
        change24h,
        activeCycle,
        effectiveAnchor,
        rsi15m,
        wickRatio,
        wickDetails: liveWick,
        usedLevels,
        avgMovePct,
        winRatePct: cfg.presetWinRate || 84.0,
        chartCandles,
        ladder: ladderData
      };
    }

    return result;
  }, [assets, dataMode, livePrices, liveChanges, liveCandles, liveCandles15m]);

  // Simulate instant reaction
  const handleSimulateReaction = (type = 'rejection') => {
    const activeItem = computedLadders[selectedSymbol];
    if (!activeItem) return;

    if (type === 'rejection') {
      const r1 = activeItem.ladder.r1;
      if (!r1) return;

      const rejectionPrice = r1.price * 0.988;
      const moveDollar = -(r1.price - rejectionPrice);
      const movePct = 1.20;

      const updated = (activeItem.presetLevels || activeItem.ladder.allSortedDesc).map((lvl) => {
        if (lvl.id === r1.id || lvl.degree === r1.degree) {
          return {
            ...lvl,
            used: true,
            reactionType: 'rejection',
            reactionDate: 'today',
            moveDollar,
            movePct
          };
        }
        return lvl;
      });

      setAssets((prev) => ({
        ...prev,
        [selectedSymbol]: {
          ...prev[selectedSymbol],
          presetLevels: updated,
          snapshotPrice: Number(rejectionPrice.toFixed(2))
        }
      }));

      triggerNotification({
        symbol: activeItem.ticker,
        type: 'rejection',
        title: `Rejected from ${r1.degree}° · ${r1.cycle ? `Cycle ${r1.cycle}` : ''}`,
        levelPrice: r1.price,
        currentPrice: rejectionPrice,
        degree: `${r1.degree}°`,
        message: `Price rejected by ${movePct.toFixed(2)}%. Degree ${r1.degree}° marked as USED; next degree promoted to R1.`
      });
    } else {
      const b1 = activeItem.ladder.b1;
      if (!b1) return;

      const bouncePrice = b1.price * 1.015;
      const moveDollar = bouncePrice - b1.price;
      const movePct = 1.50;

      const updated = (activeItem.presetLevels || activeItem.ladder.allSortedDesc).map((lvl) => {
        if (lvl.id === b1.id || lvl.degree === b1.degree) {
          return {
            ...lvl,
            used: true,
            reactionType: 'bounce',
            reactionDate: 'today',
            moveDollar,
            movePct
          };
        }
        return lvl;
      });

      setAssets((prev) => ({
        ...prev,
        [selectedSymbol]: {
          ...prev[selectedSymbol],
          presetLevels: updated,
          snapshotPrice: Number(bouncePrice.toFixed(2))
        }
      }));

      triggerNotification({
        symbol: activeItem.ticker,
        type: 'bounce',
        title: `Bounced from ${b1.degree}° · ${b1.cycle ? `Cycle ${b1.cycle}` : ''}`,
        levelPrice: b1.price,
        currentPrice: bouncePrice,
        degree: `${b1.degree}°`,
        message: `Price bounced by +${movePct.toFixed(2)}%. Degree ${b1.degree}° marked as USED; next degree promoted to B1.`
      });
    }
  };

  const handleResetPresets = () => {
    setAssets(INITIAL_ASSETS);
  };

  const activeItem = computedLadders[selectedSymbol];

  return (
    <div
      className="min-h-screen w-full relative select-none sm:select-auto pb-20 sm:pb-16"
      style={{
        backgroundColor: '#ebe5d8',
        backgroundImage: `radial-gradient(circle at 50% 0%, #f6f3ec 0%, #e6dfd1 75%, #ded6c6 100%)`,
        color: '#1e1d1a',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* Floating Live Notification Toast */}
      <ToastAlert
        alert={activeToast}
        onClose={() => setActiveToast(null)}
      />

      {/* Top Header & Mode Controls */}
      <Header
        dataMode={dataMode}
        setDataMode={setDataMode}
        wsConnected={wsConnected}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        alertsCount={alertsLog.length}
        onOpenAlerts={() => setActiveDrawer('alerts')}
        onOpenSettings={() => setActiveDrawer('settings')}
        onOpenPwa={() => setActiveDrawer('pwa')}
        onRefreshLive={fetchBinanceLiveMarket}
      />

      {/* Editorial Title & Subtitle */}
      <HeroSection
        selectedAsset={activeItem}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {/* Touch-Friendly Asset Pills & Simulation Bar */}
      <AssetSelector
        computedLadders={computedLadders}
        selectedSymbol={selectedSymbol}
        onSelectSymbol={(sym) => {
          setSelectedSymbol(sym);
          setIsModalOpen(true);
        }}
        isModalOpen={isModalOpen}
        onSimulateReaction={handleSimulateReaction}
        onResetPresets={handleResetPresets}
      />

      {/* Primary Gann Trading Terminal / Modal View */}
      <GannModal
        isOpen={isModalOpen}
        activeItem={activeItem}
        allAssets={computedLadders}
        onSelectSymbol={setSelectedSymbol}
        onClose={() => setIsModalOpen(false)}
        dataMode={dataMode}
        wsConnected={wsConnected}
        priceTickFlash={priceTickFlash}
        modalTab={modalTab}
        setModalTab={setModalTab}
        expandedRowId={expandedRowId}
        setExpandedRowId={setExpandedRowId}
        accountBalance={accountBalance}
        setAccountBalance={setAccountBalance}
        riskPerTradePct={riskPerTradePct}
        setRiskPerTradePct={setRiskPerTradePct}
        showAnchorPopover={showAnchorPopover}
        setShowAnchorPopover={setShowAnchorPopover}
        selectedSymbol={selectedSymbol}
        assets={assets}
        setAssets={setAssets}
        onResetPresets={handleResetPresets}
        onSimulateReaction={handleSimulateReaction}
      />

      {/* Mobile Bottom Thumb Navigation */}
      <MobileBottomNav
        modalTab={modalTab}
        setModalTab={setModalTab}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        alertsCount={alertsLog.length}
        onOpenAlerts={() => setActiveDrawer('alerts')}
        onOpenSettings={() => setActiveDrawer('settings')}
      />

      {/* Drawers */}
      <AlertsDrawer
        isOpen={activeDrawer === 'alerts'}
        onClose={() => setActiveDrawer(null)}
        alertsLog={alertsLog}
        setAlertsLog={setAlertsLog}
        browserPushEnabled={browserPushEnabled}
        onRequestBrowserNotifications={requestBrowserNotifications}
      />

      <SettingsDrawer
        isOpen={activeDrawer === 'settings'}
        onClose={() => setActiveDrawer(null)}
        activeItem={activeItem}
        selectedSymbol={selectedSymbol}
        assets={assets}
        setAssets={setAssets}
        telegramConfig={telegramConfig}
        setTelegramConfig={setTelegramConfig}
        onTestNotification={() =>
          triggerNotification({
            symbol: activeItem.ticker,
            type: 'bounce',
            title: 'Test Gann Alert Connected',
            levelPrice: activeItem.ladder.b1?.price || activeItem.priceNow,
            currentPrice: activeItem.priceNow,
            degree: '180° · Test',
            message: 'Your Higher Probability Zones app is connected to Telegram!'
          })
        }
      />

      <PwaDrawer
        isOpen={activeDrawer === 'pwa'}
        onClose={() => setActiveDrawer(null)}
      />
    </div>
  );
}
