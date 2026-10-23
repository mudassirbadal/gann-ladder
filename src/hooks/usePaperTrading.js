import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getISTTimeStr, formatPrice } from '../utils/formatters';
import {
  calculatePreciseTradeSetup,
  DEFAULT_STARTING_BALANCE,
  DEFAULT_LEVERAGE
} from '../utils/tradeRules';
import {
  fetchUserTrades,
  insertUserTrade,
  updateUserTradeStatus,
  deleteUserTrade,
  clearAllUserTrades,
  deleteUserBotTrades
} from '../utils/supabaseClient';

const STORAGE_KEY = 'gann_paper_trades';
const AUTO_TRADE_KEY = 'gann_auto_trading_enabled';
const STARTING_BALANCE_KEY = 'gann_starting_balance';

function mapDbTradeToUi(t) {
  const isWon = t.status === 'WON' || t.status === 'WIN';
  const isLost = t.status === 'LOST' || t.status === 'LOSS';
  const status = isWon ? 'WIN' : isLost ? 'LOSS' : t.status || 'OPEN';
  const pnlDollar = Number(t.pnl || 0);
  const pnlPct = t.entry_price ? (pnlDollar / (Number(t.entry_price) * 0.01)) : 0;

  return {
    id: `db-${t.id}`,
    dbId: t.id,
    symbol: t.symbol,
    ticker: t.symbol.includes('USDT') ? t.symbol.replace('USDT', '/USDT') : t.symbol,
    direction: t.direction,
    entryPrice: Number(t.entry_price),
    stopLoss: Number(t.stop_loss),
    takeProfit1: Number(t.take_profit),
    takeProfit2: Number(t.take_profit),
    status,
    exitPrice: t.exit_price ? Number(t.exit_price) : null,
    exitReason: t.notes || (isWon ? 'TP Hit (1:2 R:R)' : isLost ? 'SL Hit' : 'Open Position'),
    pnlDollar,
    pnlPct: Number(pnlPct.toFixed(2)),
    openTime: t.created_at
      ? new Date(t.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST'
      : getISTTimeStr(),
    closeTime: t.closed_at
      ? new Date(t.closed_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST'
      : null,
    isAuto: t.notes?.includes('Auto') || false,
    rank: 'GANN',
    degree: 0,
    positionUnits: 1,
    marginRequired: 15,
    notionalUsd: 15000,
    leverage: DEFAULT_LEVERAGE,
    rrRatio: 2.0
  };
}

export function usePaperTrading({ livePrices, onTradeAlert, user }) {
  const userId = user?.id;

  const [trades, setTrades] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cloudSynced, setCloudSynced] = useState(false);

  // Sync trades with Supabase on user sign-in
  useEffect(() => {
    if (!userId) {
      setCloudSynced(false);
      return;
    }

    let isMounted = true;
    fetchUserTrades(userId).then((dbTrades) => {
      if (!isMounted) return;
      if (Array.isArray(dbTrades) && dbTrades.length > 0) {
        const mapped = dbTrades.map(mapDbTradeToUi);
        setTrades(mapped);
      }
      setCloudSynced(true);
    });

    return () => {
      isMounted = false;
    };
  }, [userId]);

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

              if (userId && trade.dbId) {
                updateUserTradeStatus(userId, trade.dbId, {
                  status: 'WON',
                  exitPrice: trade.takeProfit1,
                  pnl: pnlDollar,
                  closedAt: new Date().toISOString()
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

              if (userId && trade.dbId) {
                updateUserTradeStatus(userId, trade.dbId, {
                  status: 'LOST',
                  exitPrice: trade.stopLoss,
                  pnl: pnlDollar,
                  closedAt: new Date().toISOString()
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

              if (userId && trade.dbId) {
                updateUserTradeStatus(userId, trade.dbId, {
                  status: 'WON',
                  exitPrice: trade.takeProfit1,
                  pnl: pnlDollar,
                  closedAt: new Date().toISOString()
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

              if (userId && trade.dbId) {
                updateUserTradeStatus(userId, trade.dbId, {
                  status: 'LOST',
                  exitPrice: trade.stopLoss,
                  pnl: pnlDollar,
                  closedAt: new Date().toISOString()
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

      if (userId) {
        insertUserTrade(userId, {
          symbol: activeItem.id,
          direction: tradeSetup.isShort ? 'SHORT' : 'LONG',
          entryPrice: tradeSetup.entry,
          stopLoss: tradeSetup.stopLoss,
          takeProfit: tradeSetup.takeProfit1,
          status: 'OPEN',
          notes: `${isAuto ? 'Auto-Trading Bot' : 'Manual'} | Rank ${rank || 'Gann'} (${degree || 0}°) | 1:2 R:R`
        }).then((saved) => {
          if (saved?.id) {
            setTrades((prev) =>
              prev.map((t) => (t.id === newTrade.id ? { ...t, dbId: saved.id } : t))
            );
          }
        });
      }

      return newTrade;
    },
    [userId]
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
  const closeTradeManually = useCallback(
    (tradeId, currentPrice) => {
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

          if (userId && trade.dbId) {
            updateUserTradeStatus(userId, trade.dbId, {
              status: pnlDollar >= 0 ? 'WON' : 'LOST',
              exitPrice: currentPrice,
              pnl: pnlDollar,
              closedAt: new Date().toISOString()
            });
          }

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
    },
    [userId]
  );

  const deleteTrade = useCallback(
    async (tradeId) => {
      const target = trades.find((t) => t.id === tradeId);
      if (userId && target?.dbId) {
        await deleteUserTrade(userId, target.dbId);
      }
      setTrades((prev) => prev.filter((t) => t.id !== tradeId));
    },
    [trades, userId]
  );

  const clearJournalHistory = useCallback(async () => {
    if (userId) {
      await clearAllUserTrades(userId);
    }
    setTrades([]);
  }, [userId]);

  // Permanently delete only Bot trades (preserving manual records)
  const deleteBotTradesOnly = useCallback(async () => {
    if (userId) {
      await deleteUserBotTrades(userId);
    }
    setTrades((prev) => prev.filter((t) => !t.isAuto));
  }, [userId]);

  // Completely wipe all trading bot and personal trade data
  const deleteAllTradingData = useCallback(async () => {
    if (userId) {
      await clearAllUserTrades(userId);
    }
    setTrades([]);
    setStartingBalance(DEFAULT_STARTING_BALANCE);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STARTING_BALANCE_KEY);
    } catch {
      // ignore
    }
  }, [userId]);

  // Compute overall performance statistics & monthly profit metrics
  const stats = useMemo(() => {
    const closed = trades.filter((t) => t.status !== 'OPEN');
    const open = trades.filter((t) => t.status === 'OPEN');
    
    // Win, Breakeven, and Loss classification
    const wins = closed.filter(
      (t) => t.status === 'WIN' || t.status === 'WON' || (t.pnlDollar > 0.05)
    );
    const breakeven = closed.filter(
      (t) =>
        t.status === 'BREAKEAVEN' ||
        t.status === 'BREAKEVEN' ||
        Math.abs(t.pnlDollar || 0) <= 0.05
    );
    const losses = closed.filter(
      (t) =>
        (t.status === 'LOSS' || t.status === 'LOST') &&
        !(Math.abs(t.pnlDollar || 0) <= 0.05)
    );

    const autoTrades = trades.filter((t) => t.isAuto);

    const totalRealizedPnl = closed.reduce((acc, t) => acc + (t.pnlDollar || 0), 0);
    const totalCount = trades.length;
    const closedCount = closed.length;

    const winRate = closedCount > 0 ? (wins.length / closedCount) * 100 : 0;
    const breakevenRate = closedCount > 0 ? (breakeven.length / closedCount) * 100 : 0;
    const lossRate = closedCount > 0 ? (losses.length / closedCount) * 100 : 0;

    const avgRr =
      closedCount > 0
        ? closed.reduce((acc, t) => acc + (t.rrRatio || 2.0), 0) / closedCount
        : 2.0;

    const currentEquity = Number((startingBalance + totalRealizedPnl).toFixed(2));
    const returnPct = Number(((totalRealizedPnl / startingBalance) * 100).toFixed(2));

    // Normalized $100 starting baseline requested by user
    const normalized100Current = Number((100 + (100 * (returnPct / 100))).toFixed(2));
    const normalized100Profit = Number((normalized100Current - 100).toFixed(2));

    return {
      totalTrades: totalCount,
      openCount: open.length,
      closedCount,
      winsCount: wins.length,
      breakevenCount: breakeven.length,
      lossesCount: losses.length,
      autoCount: autoTrades.length,
      winRate: Number(winRate.toFixed(1)),
      breakevenRate: Number(breakevenRate.toFixed(1)),
      lossRate: Number(lossRate.toFixed(1)),
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
    deleteTrade,
    clearJournalHistory,
    deleteBotTradesOnly,
    deleteAllTradingData,
    cloudSynced,
    stats
  };
}
