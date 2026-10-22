import { useState, useEffect, useCallback, useMemo } from 'react';
import { getISTTimeStr } from '../utils/formatters';

const STORAGE_KEY = 'gann_paper_trades';

export function usePaperTrading({ livePrices, onTradeAlert }) {
  const [trades, setTrades] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist trades to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
    } catch {
      // ignore storage error
    }
  }, [trades]);

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
          // Check Take Profit 1 Hit
          if (currentPrice >= trade.takeProfit1) {
            changed = true;
            const pnlDollar = (trade.takeProfit1 - trade.entryPrice) * trade.positionUnits;
            const pnlPct = ((trade.takeProfit1 - trade.entryPrice) / trade.entryPrice) * 100;

            if (onTradeAlert) {
              onTradeAlert({
                symbol: trade.ticker,
                type: 'bounce',
                title: `Target TP1 Reached (+${pnlPct.toFixed(2)}%)`,
                message: `Paper trade on ${trade.ticker} closed as WIN at $${trade.takeProfit1.toFixed(2)} (+${pnlDollar.toFixed(2)}).`
              });
            }

            return {
              ...trade,
              status: 'WIN',
              closeTime: getISTTimeStr(),
              exitPrice: trade.takeProfit1,
              exitReason: 'TP1 Hit',
              pnlDollar,
              pnlPct
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
                title: `Stop-Loss Triggered (${pnlPct.toFixed(2)}%)`,
                message: `Paper trade on ${trade.ticker} stopped out at $${trade.stopLoss.toFixed(2)} (${pnlDollar.toFixed(2)}).`
              });
            }

            return {
              ...trade,
              status: 'LOSS',
              closeTime: getISTTimeStr(),
              exitPrice: trade.stopLoss,
              exitReason: 'SL Hit',
              pnlDollar,
              pnlPct
            };
          }
        } else {
          // Short Position Monitoring
          // Check Take Profit 1 Hit
          if (currentPrice <= trade.takeProfit1) {
            changed = true;
            const pnlDollar = (trade.entryPrice - trade.takeProfit1) * trade.positionUnits;
            const pnlPct = ((trade.entryPrice - trade.takeProfit1) / trade.entryPrice) * 100;

            if (onTradeAlert) {
              onTradeAlert({
                symbol: trade.ticker,
                type: 'bounce',
                title: `Target TP1 Reached (+${pnlPct.toFixed(2)}%)`,
                message: `Paper trade on ${trade.ticker} closed as WIN at $${trade.takeProfit1.toFixed(2)} (+${pnlDollar.toFixed(2)}).`
              });
            }

            return {
              ...trade,
              status: 'WIN',
              closeTime: getISTTimeStr(),
              exitPrice: trade.takeProfit1,
              exitReason: 'TP1 Hit',
              pnlDollar,
              pnlPct
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
                title: `Stop-Loss Triggered (${pnlPct.toFixed(2)}%)`,
                message: `Paper trade on ${trade.ticker} stopped out at $${trade.stopLoss.toFixed(2)} (${pnlDollar.toFixed(2)}).`
              });
            }

            return {
              ...trade,
              status: 'LOSS',
              closeTime: getISTTimeStr(),
              exitPrice: trade.stopLoss,
              exitReason: 'SL Hit',
              pnlDollar,
              pnlPct
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

  // Execute a new paper trade with 1 tap
  const executePaperTrade = useCallback((tradeSetup, activeItem, rank, degree) => {
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
      riskDollars: tradeSetup.riskDollars,
      notionalUsd: tradeSetup.notionalUsd,
      rrRatio: tradeSetup.rrRatio,
      slDistancePct: tradeSetup.slDistancePct,
      tp1DistancePct: tradeSetup.tp1DistancePct,
      openTime: getISTTimeStr(),
      status: 'OPEN',
      exitPrice: null,
      exitReason: null,
      pnlDollar: 0,
      pnlPct: 0
    };

    setTrades((prev) => [newTrade, ...prev]);
    return newTrade;
  }, []);

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
          exitReason: 'Manual Close',
          pnlDollar,
          pnlPct
        };
      })
    );
  }, []);

  const clearJournalHistory = useCallback(() => {
    setTrades([]);
  }, []);

  // Compute overall performance statistics
  const stats = useMemo(() => {
    const closed = trades.filter((t) => t.status !== 'OPEN');
    const open = trades.filter((t) => t.status === 'OPEN');
    const wins = closed.filter((t) => t.status === 'WIN');
    const losses = closed.filter((t) => t.status === 'LOSS');

    const totalRealizedPnl = closed.reduce((acc, t) => acc + (t.pnlDollar || 0), 0);
    const winRate = closed.length > 0 ? (wins.length / closed.length) * 100 : 0;
    const avgRr =
      closed.length > 0
        ? closed.reduce((acc, t) => acc + (t.rrRatio || 2.0), 0) / closed.length
        : 2.5;

    return {
      totalTrades: trades.length,
      openCount: open.length,
      closedCount: closed.length,
      winsCount: wins.length,
      lossesCount: losses.length,
      winRate: Number(winRate.toFixed(1)),
      totalRealizedPnl: Number(totalRealizedPnl.toFixed(2)),
      avgRr: Number(avgRr.toFixed(2))
    };
  }, [trades]);

  return {
    trades,
    openTrades: trades.filter((t) => t.status === 'OPEN'),
    closedTrades: trades.filter((t) => t.status !== 'OPEN'),
    executePaperTrade,
    closeTradeManually,
    clearJournalHistory,
    stats
  };
}
