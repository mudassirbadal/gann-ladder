import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getISTTimeStr, formatPrice } from '../utils/formatters';
import {
  calculatePreciseTradeSetup,
  DEFAULT_STARTING_BALANCE,
  DEFAULT_LEVERAGE
} from '../utils/tradeRules';

const STORAGE_KEY = 'gann_paper_trades';
const AUTO_TRADE_KEY = 'gann_auto_trading_enabled';
const STARTING_BALANCE_KEY = 'gann_starting_balance';

export function usePaperTrading({ livePrices, onTradeAlert }) {
  const [trades, setTrades] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [autoTradingEnabled, setAutoTradingEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTO_TRADE_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [startingBalance, setStartingBalance] = useState(() => {
    try {
      const saved = localStorage.getItem(STARTING_BALANCE_KEY);
      return saved ? Number(saved) : DEFAULT_STARTING_BALANCE;
    } catch {
      return DEFAULT_STARTING_BALANCE;
    }
  });

  const lastAutoTradeRef = useRef({});

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
    } catch {
      // ignore storage error
    }
  }, [trades]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTO_TRADE_KEY, JSON.stringify(autoTradingEnabled));
    } catch {
      // ignore storage error
    }
  }, [autoTradingEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(STARTING_BALANCE_KEY, String(startingBalance));
    } catch {
      // ignore storage error
    }
  }, [startingBalance]);

  // Automated monitoring of OPEN trades against live price ticks
  useEffect(() => {
    if (!livePrices || Object.keys(livePrices).length === 0) return;

    const timer = setTimeout(() => {
      setTrades((prevTrades) => {
        let changed = false;
        const updated = prevTrades.map((trade) => {
          if (trade.status !== 'OPEN') return trade;

          const currentPrice = livePrices[trade.symbol];
          if (!currentPrice) return trade;

          const isLong = trade.direction.includes('LONG') || trade.direction === 'LONG';

          if (isLong) {
            // Check Take Profit 1 Hit (1:2 R:R Target)
            if (currentPrice >= trade.takeProfit1) {
              changed = true;
              const pnlDollar = (trade.takeProfit1 - trade.entryPrice) * trade.positionUnits;
              const pnlPct = ((trade.takeProfit1 - trade.entryPrice) / trade.entryPrice) * 100;

              if (onTradeAlert) {
                onTradeAlert({
                  symbol: trade.ticker,
                  type: 'bounce',
                  title: `🎯 Target TP1 Reached (+${pnlPct.toFixed(2)}%)`,
                  message: `Paper trade on ${trade.ticker} closed as WIN at $${formatPrice(trade.takeProfit1)} (+${pnlDollar >= 0 ? '+' : ''}$${pnlDollar.toFixed(2)}, 1:2 R:R).`
                });
              }

              return {
                ...trade,
                status: 'WIN',
                closeTime: getISTTimeStr(),
                exitPrice: trade.takeProfit1,
                exitReason: 'TP1 Hit (1:2 R:R)',
                pnlDollar: Number(pnlDollar.toFixed(2)),
                pnlPct: Number(pnlPct.toFixed(2))
              };
            }

            // Check Stop Loss Hit
            if (currentPrice <= trade.stopLoss) {
              changed = true;
              const pnlDollar = (trade.stopLoss - trade.entryPrice) * trade.positionUnits;
              const pnlPct = ((trade.stopLoss - trade.entryPrice) / trade.entryPrice) * 100;

              if (onTradeAlert) {
                onTradeAlert({
                  symbol: trade.ticker,
                  type: 'rejection',
                  title: `🛑 Stop-Loss Hit (${pnlPct.toFixed(2)}%)`,
                  message: `Paper trade on ${trade.ticker} stopped out at $${formatPrice(trade.stopLoss)} (${pnlDollar.toFixed(2)}).`
                });
              }

              return {
                ...trade,
                status: 'LOSS',
                closeTime: getISTTimeStr(),
                exitPrice: trade.stopLoss,
                exitReason: 'SL Hit',
                pnlDollar: Number(pnlDollar.toFixed(2)),
                pnlPct: Number(pnlPct.toFixed(2))
              };
            }
          } else {
            // Short Position Monitoring
            // Check Take Profit 1 Hit (1:2 R:R Target)
            if (currentPrice <= trade.takeProfit1) {
              changed = true;
              const pnlDollar = (trade.entryPrice - trade.takeProfit1) * trade.positionUnits;
              const pnlPct = ((trade.entryPrice - trade.takeProfit1) / trade.entryPrice) * 100;

              if (onTradeAlert) {
                onTradeAlert({
                  symbol: trade.ticker,
                  type: 'bounce',
                  title: `🎯 Target TP1 Reached (+${pnlPct.toFixed(2)}%)`,
                  message: `Paper trade on ${trade.ticker} closed as WIN at $${formatPrice(trade.takeProfit1)} (+${pnlDollar >= 0 ? '+' : ''}$${pnlDollar.toFixed(2)}, 1:2 R:R).`
                });
              }

              return {
                ...trade,
                status: 'WIN',
                closeTime: getISTTimeStr(),
                exitPrice: trade.takeProfit1,
                exitReason: 'TP1 Hit (1:2 R:R)',
                pnlDollar: Number(pnlDollar.toFixed(2)),
                pnlPct: Number(pnlPct.toFixed(2))
              };
            }

            // Check Stop Loss Hit
            if (currentPrice >= trade.stopLoss) {
              changed = true;
              const pnlDollar = (trade.entryPrice - trade.stopLoss) * trade.positionUnits;
              const pnlPct = ((trade.entryPrice - trade.stopLoss) / trade.entryPrice) * 100;

              if (onTradeAlert) {
                onTradeAlert({
                  symbol: trade.ticker,
                  type: 'rejection',
                  title: `🛑 Stop-Loss Hit (${pnlPct.toFixed(2)}%)`,
                  message: `Paper trade on ${trade.ticker} stopped out at $${formatPrice(trade.stopLoss)} (${pnlDollar.toFixed(2)}).`
                });
              }

              return {
                ...trade,
                status: 'LOSS',
                closeTime: getISTTimeStr(),
                exitPrice: trade.stopLoss,
                exitReason: 'SL Hit',
                pnlDollar: Number(pnlDollar.toFixed(2)),
                pnlPct: Number(pnlPct.toFixed(2))
              };
            }
          }

          return trade;
        });

        return changed ? updated : prevTrades;
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [livePrices, onTradeAlert]);

  // Execute a paper trade (manual or automated)
  const executePaperTrade = useCallback(
    (tradeSetup, activeItem, rank, degree, isAuto = false) => {
      if (!tradeSetup || !activeItem) return null;

      const newTrade = {
        id: `trade-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        symbol: activeItem.id,
        ticker: activeItem.ticker,
        direction: tradeSetup.isShort ? 'SHORT' : 'LONG',
        rank: rank || 'GANN',
        degree: degree || 0,
        entryPrice: tradeSetup.entry,
        stopLoss: tradeSetup.stopLoss,
        takeProfit1: tradeSetup.takeProfit1,
        takeProfit2: tradeSetup.takeProfit2,
        positionUnits: tradeSetup.positionUnits,
        riskDollars: tradeSetup.riskDollars || tradeSetup.maxRiskDollar || 15,
        notionalUsd: tradeSetup.notionalUsd,
        marginRequired: tradeSetup.marginRequired || Number((tradeSetup.notionalUsd / DEFAULT_LEVERAGE).toFixed(2)),
        leverage: DEFAULT_LEVERAGE,
        rrRatio: tradeSetup.rrRatio || 2.0,
        slDistancePct: tradeSetup.slDistancePct,
        tp1DistancePct: tradeSetup.tp1DistancePct,
        openTime: getISTTimeStr(),
        status: 'OPEN',
        isAuto: Boolean(isAuto),
        exitPrice: null,
        exitReason: null,
        pnlDollar: 0,
        pnlPct: 0
      };

      setTrades((prev) => [newTrade, ...prev]);
      return newTrade;
    },
    []
  );

  // Auto-Trading Evaluation Engine
  const evaluateAndTriggerAutoTrade = useCallback(
    ({ activeItem, confluenceSignal }) => {
      if (!autoTradingEnabled) return;
      if (!activeItem || !activeItem.ladder || !activeItem.priceNow) return;

      // Rule: Do not enter if Moon Void-of-Course veto is active
      if (confluenceSignal?.code === 'VOID_OF_COURSE_VETO') return;

      const sym = activeItem.id;
      const priceNow = activeItem.priceNow;
      const r1 = activeItem.ladder.r1;
      const b1 = activeItem.ladder.b1;

      // Check duplicate open trade for this asset
      const hasOpen = trades.some((t) => t.symbol === sym && t.status === 'OPEN');
      if (hasOpen) return;

      // Cooldown check: 10 minutes between automated triggers per symbol
      const lastTrigger = lastAutoTradeRef.current[sym] || 0;
      if (Date.now() - lastTrigger < 10 * 60 * 1000) return;

      const wickConfirmed = (activeItem.wickRatio || 0) >= 48;

      // 1. Check R1 Final Rejection Zone Touch / Proximity (SHORT Entry)
      if (r1 && r1.price) {
        const distPct = Math.abs((priceNow - r1.price) / priceNow) * 100;
        const touchedOrNear = distPct <= 0.20 || priceNow >= r1.price;

        if (touchedOrNear && (wickConfirmed || confluenceSignal?.downsideSignal)) {
          lastAutoTradeRef.current[sym] = Date.now();

          const setup = calculatePreciseTradeSetup({
            lvl: r1,
            isShort: true,
            ticker: activeItem.ticker,
            symbol: activeItem.id,
            currentPrice: priceNow,
            accountBalance: startingBalance,
            leverage: DEFAULT_LEVERAGE
          });

          executePaperTrade(setup, activeItem, r1.rank, r1.degree, true);

          if (onTradeAlert) {
            onTradeAlert({
              symbol: activeItem.ticker,
              type: 'rejection',
              title: `🤖 Auto-Trade SHORT Executed (${r1.degree}°)`,
              message: `Auto-entered SHORT on ${activeItem.ticker} at $${formatPrice(setup.entry)} | SL: $${formatPrice(setup.stopLoss)} (-$${setup.maxRiskDollar}), TP: $${formatPrice(setup.takeProfit1)} (+$${setup.maxRiskDollar * 2}, 1:2 R:R, 1:1000 Lev).`
            });
          }
          return;
        }
      }

      // 2. Check B1 Final Bounce Zone Touch / Proximity (LONG Entry)
      if (b1 && b1.price) {
        const distPct = Math.abs((priceNow - b1.price) / priceNow) * 100;
        const touchedOrNear = distPct <= 0.20 || priceNow <= b1.price;

        if (touchedOrNear && (wickConfirmed || confluenceSignal?.upsideSignal)) {
          lastAutoTradeRef.current[sym] = Date.now();

          const setup = calculatePreciseTradeSetup({
            lvl: b1,
            isShort: false,
            ticker: activeItem.ticker,
            symbol: activeItem.id,
            currentPrice: priceNow,
            accountBalance: startingBalance,
            leverage: DEFAULT_LEVERAGE
          });

          executePaperTrade(setup, activeItem, b1.rank, b1.degree, true);

          if (onTradeAlert) {
            onTradeAlert({
              symbol: activeItem.ticker,
              type: 'bounce',
              title: `🤖 Auto-Trade LONG Executed (${b1.degree}°)`,
              message: `Auto-entered LONG on ${activeItem.ticker} at $${formatPrice(setup.entry)} | SL: $${formatPrice(setup.stopLoss)} (-$${setup.maxRiskDollar}), TP: $${formatPrice(setup.takeProfit1)} (+$${setup.maxRiskDollar * 2}, 1:2 R:R, 1:1000 Lev).`
            });
          }
        }
      }
    },
    [autoTradingEnabled, trades, startingBalance, executePaperTrade, onTradeAlert]
  );

  // Close an open trade manually at market
  const closeTradeManually = useCallback((tradeId, currentPrice) => {
    setTrades((prev) =>
      prev.map((trade) => {
        if (trade.id !== tradeId || trade.status !== 'OPEN') return trade;

        const isLong = trade.direction === 'LONG';
        const pnlDollar = isLong
          ? (currentPrice - trade.entryPrice) * trade.positionUnits
          : (trade.entryPrice - currentPrice) * trade.positionUnits;
        const pnlPct = isLong
          ? ((currentPrice - trade.entryPrice) / trade.entryPrice) * 100
          : ((trade.entryPrice - currentPrice) / trade.entryPrice) * 100;

        return {
          ...trade,
          status: pnlDollar >= 0 ? 'WIN' : 'LOSS',
          closeTime: getISTTimeStr(),
          exitPrice: currentPrice,
          exitReason: 'Manual Market Close',
          pnlDollar: Number(pnlDollar.toFixed(2)),
          pnlPct: Number(pnlPct.toFixed(2))
        };
      })
    );
  }, []);

  const clearJournalHistory = useCallback(() => {
    setTrades([]);
  }, []);

  // Compute overall performance statistics & monthly profit metrics
  const stats = useMemo(() => {
    const closed = trades.filter((t) => t.status !== 'OPEN');
    const open = trades.filter((t) => t.status === 'OPEN');
    const wins = closed.filter((t) => t.status === 'WIN');
    const losses = closed.filter((t) => t.status === 'LOSS');
    const autoTrades = trades.filter((t) => t.isAuto);

    const totalRealizedPnl = closed.reduce((acc, t) => acc + (t.pnlDollar || 0), 0);
    const winRate = closed.length > 0 ? (wins.length / closed.length) * 100 : 0;
    const avgRr =
      closed.length > 0
        ? closed.reduce((acc, t) => acc + (t.rrRatio || 2.0), 0) / closed.length
        : 2.0;

    const currentEquity = Number((startingBalance + totalRealizedPnl).toFixed(2));
    const returnPct = Number(((totalRealizedPnl / startingBalance) * 100).toFixed(2));

    // Normalized $100 starting baseline requested by user
    const normalized100Current = Number((100 + (100 * (returnPct / 100))).toFixed(2));
    const normalized100Profit = Number((normalized100Current - 100).toFixed(2));

    return {
      totalTrades: trades.length,
      openCount: open.length,
      closedCount: closed.length,
      winsCount: wins.length,
      lossesCount: losses.length,
      autoCount: autoTrades.length,
      winRate: Number(winRate.toFixed(1)),
      totalRealizedPnl: Number(totalRealizedPnl.toFixed(2)),
      avgRr: Number(avgRr.toFixed(2)),
      startingBalance,
      currentEquity,
      returnPct,
      normalized100Current,
      normalized100Profit,
      leverage: DEFAULT_LEVERAGE
    };
  }, [trades, startingBalance]);

  return {
    trades,
    openTrades: trades.filter((t) => t.status === 'OPEN'),
    closedTrades: trades.filter((t) => t.status !== 'OPEN'),
    autoTradingEnabled,
    setAutoTradingEnabled,
    startingBalance,
    setStartingBalance,
    executePaperTrade,
    evaluateAndTriggerAutoTrade,
    closeTradeManually,
    clearJournalHistory,
    stats
  };
}
