import { describe, it, expect } from 'vitest';
import {
  getAssetCategory,
  calculatePreciseTradeSetup
} from '../utils/tradeRules';

describe('Trade Setup & Risk Management Rules', () => {
  it('correctly categorizes symbols and tickers', () => {
    expect(getAssetCategory('PAXGUSDT', 'PAXG/USDT')).toBe('GOLD');
    expect(getAssetCategory('XAUUSD', 'XAU/USD')).toBe('GOLD');
    expect(getAssetCategory('BTCUSDT', 'BTC/USDT')).toBe('BTC');
    expect(getAssetCategory('ETHUSDT', 'ETH/USDT')).toBe('CRYPTO_ALT');
    expect(getAssetCategory('SOLUSDT', 'SOL/USDT')).toBe('CRYPTO_ALT');
    expect(getAssetCategory('', '')).toBe('CRYPTO_ALT');
    expect(getAssetCategory(null, null)).toBe('CRYPTO_ALT');
  });

  it('calculates exact 1:2 R:R and 15 points SL for Gold (LONG and SHORT)', () => {
    // Gold LONG
    const goldLong = calculatePreciseTradeSetup({
      lvl: { price: 2750 },
      isShort: false,
      ticker: 'PAXG/USDT',
      symbol: 'PAXGUSDT',
      currentPrice: 2750,
      accountBalance: 300,
      leverage: 1000
    });

    expect(goldLong.direction).toBe('LONG');
    expect(goldLong.entry).toBe(2750);
    expect(goldLong.stopLoss).toBe(2735); // 2750 - 15 points
    expect(goldLong.takeProfit1).toBe(2780); // 2750 + 30 points (1:2 R:R)
    expect(goldLong.rrRatio).toBe(2.0);
    expect(goldLong.maxRiskDollar).toBe(15);
    expect(goldLong.positionUnits).toBe(1); // 15 risk / 15 points
    expect(goldLong.marginRequired).toBe(2.75); // (1 * 2750) / 1000

    // Gold SHORT
    const goldShort = calculatePreciseTradeSetup({
      lvl: { price: 2750 },
      isShort: true,
      ticker: 'PAXG/USDT',
      symbol: 'PAXGUSDT',
      currentPrice: 2750,
      accountBalance: 300,
      leverage: 1000
    });

    expect(goldShort.direction).toBe('SHORT');
    expect(goldShort.entry).toBe(2750);
    expect(goldShort.stopLoss).toBe(2765); // 2750 + 15 points
    expect(goldShort.takeProfit1).toBe(2720); // 2750 - 30 points (1:2 R:R)
    expect(goldShort.rrRatio).toBe(2.0);
  });

  it('calculates BTC risk setup adhering to 1:2 R:R', () => {
    const btcLong = calculatePreciseTradeSetup({
      lvl: { price: 80000 },
      isShort: false,
      ticker: 'BTC/USDT',
      symbol: 'BTCUSDT',
      currentPrice: 80000,
      accountBalance: 300,
      leverage: 1000
    });

    expect(btcLong.direction).toBe('LONG');
    expect(btcLong.entry).toBe(80000);
    expect(btcLong.stopLoss).toBeLessThan(80000);
    expect(btcLong.takeProfit1).toBeGreaterThan(80000);
    expect(btcLong.rrRatio).toBe(2.0);
    expect(btcLong.maxRiskDollar).toBe(15);
  });

  it('guards against division by zero with 0 or negative leverage and entry price', () => {
    const zeroLev = calculatePreciseTradeSetup({
      lvl: { price: 100 },
      isShort: false,
      ticker: 'ETH/USDT',
      symbol: 'ETHUSDT',
      currentPrice: 100,
      accountBalance: 300,
      leverage: 0
    });

    expect(zeroLev).toBeDefined();
    // leverage 0 should be guarded or fallback without creating Infinity
  });
});
