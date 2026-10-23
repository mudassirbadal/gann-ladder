import { describe, it, expect } from 'vitest';
import { formatPrice } from '../utils/formatters';

describe('Analytics Metrics & Formatters Verification', () => {
  it('formats prices with varying decimals and handles NaN/null/undefined safely', () => {
    expect(formatPrice(null)).toBe('0.00');
    expect(formatPrice(undefined)).toBe('0.00');
    expect(formatPrice(NaN)).toBe('0.00');
    expect(formatPrice(0)).toBe('0.00');
    expect(formatPrice(2745.5)).toBe('2,745.50');
    expect(formatPrice(82500)).toBe('82,500.00');
    expect(formatPrice(0.0245)).toBe('0.0245'); // sub-10 assets use 4 decimals
  });

  it('verifies performance calculation edge cases', () => {
    const calculateMockStats = (trades, startingBalance, leverage) => {
      const closed = trades.filter((t) => t.status !== 'OPEN');
      const wins = closed.filter((t) => t.status === 'WIN' || t.pnlDollar > 0.05);
      const breakeven = closed.filter((t) => t.status === 'BREAKEAVEN' || Math.abs(t.pnlDollar || 0) <= 0.05);
      const losses = closed.filter((t) => (t.status === 'LOSS') && !(Math.abs(t.pnlDollar || 0) <= 0.05));

      const totalRealizedPnl = closed.reduce((acc, t) => acc + (t.pnlDollar || 0), 0);
      const closedCount = closed.length;
      const winRate = closedCount > 0 ? (wins.length / closedCount) * 100 : 0;
      const breakevenRate = closedCount > 0 ? (breakeven.length / closedCount) * 100 : 0;
      const lossRate = closedCount > 0 ? (losses.length / closedCount) * 100 : 0;

      const safeBalance = Math.max(1, startingBalance || 300);
      const currentEquity = Number((safeBalance + totalRealizedPnl).toFixed(2));
      const returnPct = Number(((totalRealizedPnl / safeBalance) * 100).toFixed(2));
      const normalized100Current = Number((100 + (100 * (returnPct / 100))).toFixed(2));
      const normalized100Profit = Number((normalized100Current - 100).toFixed(2));

      return {
        totalTrades: trades.length,
        closedCount,
        winsCount: wins.length,
        breakevenCount: breakeven.length,
        lossesCount: losses.length,
        winRate: Number(winRate.toFixed(1)),
        breakevenRate: Number(breakevenRate.toFixed(1)),
        lossRate: Number(lossRate.toFixed(1)),
        totalRealizedPnl: Number(totalRealizedPnl.toFixed(2)),
        currentEquity,
        returnPct,
        normalized100Current,
        normalized100Profit,
        leverage
      };
    };

    // 0 trades
    const emptyStats = calculateMockStats([], 300, 1000);
    expect(emptyStats.winRate).toBe(0);
    expect(emptyStats.breakevenRate).toBe(0);
    expect(emptyStats.lossRate).toBe(0);
    expect(emptyStats.totalRealizedPnl).toBe(0);
    expect(emptyStats.currentEquity).toBe(300);
    expect(emptyStats.normalized100Current).toBe(100);
    expect(emptyStats.normalized100Profit).toBe(0);

    // 1 win (+$30), 1 loss (-$15), 1 breakeven ($0) -> 3 trades, +$15 PnL
    const sampleTrades = [
      { status: 'WIN', pnlDollar: 30, rrRatio: 2.0 },
      { status: 'LOSS', pnlDollar: -15, rrRatio: 2.0 },
      { status: 'BREAKEAVEN', pnlDollar: 0, rrRatio: 2.0 }
    ];
    const computed = calculateMockStats(sampleTrades, 300, 1000);
    expect(computed.closedCount).toBe(3);
    expect(computed.winsCount).toBe(1);
    expect(computed.lossesCount).toBe(1);
    expect(computed.breakevenCount).toBe(1);
    expect(computed.winRate).toBe(33.3);
    expect(computed.lossRate).toBe(33.3);
    expect(computed.breakevenRate).toBe(33.3);
    expect(computed.totalRealizedPnl).toBe(15);
    expect(computed.currentEquity).toBe(315);
    expect(computed.returnPct).toBe(5);
    expect(computed.normalized100Current).toBe(105);
    expect(computed.normalized100Profit).toBe(5);
  });
});
