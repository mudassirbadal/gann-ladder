import { describe, it, expect } from 'vitest';
import {
  calculateRSI,
  calculateWickMetrics,
  getDegreeDescription,
  isGoldHighlightDegree,
  buildGannLadder
} from '../utils/gannMath';

describe('Gann Math & Degree Engine', () => {
  it('normalizes degrees correctly across cycles', () => {
    expect(getDegreeDescription(0, false)).toContain('Base pivot');
    expect(getDegreeDescription(360, false)).toContain('Full cycle');
    expect(getDegreeDescription(720, false)).toContain('Full cycle');
    expect(getDegreeDescription(180, false)).toContain('Major reversal zone');
    expect(getDegreeDescription(-180, false)).toContain('Major reversal zone');
  });

  it('identifies gold highlight degrees', () => {
    expect(isGoldHighlightDegree(0)).toBe(true);
    expect(isGoldHighlightDegree(180)).toBe(true);
    expect(isGoldHighlightDegree(360)).toBe(true);
    expect(isGoldHighlightDegree(540)).toBe(true);
    expect(isGoldHighlightDegree(90)).toBe(false);
  });

  it('handles RSI boundary conditions safely', () => {
    // Empty array or insufficient candles
    expect(calculateRSI([])).toBeNull();
    expect(calculateRSI(null)).toBeNull();
    expect(calculateRSI([{ close: 100 }])).toBeNull();

    // 14 candles of purely upward moves (avgLoss = 0)
    const bullCandles = Array.from({ length: 20 }, (_, i) => ({ close: 100 + i * 5 }));
    expect(calculateRSI(bullCandles, 14)).toBe(100);

    // 14 candles of flat prices
    const flatCandles = Array.from({ length: 20 }, () => ({ close: 100 }));
    expect(calculateRSI(flatCandles, 14)).toBe(100);
  });

  it('handles calculateWickMetrics on empty, single, and zero-range candles', () => {
    const emptyResult = calculateWickMetrics([]);
    expect(emptyResult.ratio).toBe(58.4); // graceful default

    const singleResult = calculateWickMetrics([{ high: 100, low: 90, open: 95, close: 95 }]);
    expect(singleResult.ratio).toBe(58.4);

    // Zero range candle (high === low)
    const zeroRangeResult = calculateWickMetrics([
      { high: 100, low: 90, open: 95, close: 95 },
      { high: 100, low: 100, open: 100, close: 100 },
      { high: 101, low: 99, open: 100, close: 100 }
    ]);
    expect(zeroRangeResult.ratio).toBe(0);
    expect(zeroRangeResult.dominant).toBe('neutral');
  });

  it('buildsGannLadder with extreme prices and does not throw NaN or crash', () => {
    // Zero or near zero base anchor
    const ladderZero = buildGannLadder({
      baseAnchor: 0,
      currentPrice: 100,
      stepDegrees: 45,
      showCycleInRows: false
    });
    expect(ladderZero).toBeDefined();
    expect(ladderZero.above).toBeInstanceOf(Array);
    expect(ladderZero.below).toBeInstanceOf(Array);

    // High price (e.g. BTC 100,000)
    const ladderBtc = buildGannLadder({
      baseAnchor: 80000,
      currentPrice: 85000,
      stepDegrees: 45,
      showCycleInRows: true
    });
    expect(ladderBtc.r1).toBeDefined();
    expect(ladderBtc.b1).toBeDefined();
    expect(ladderBtc.r1.price).toBeGreaterThan(85000);
    expect(ladderBtc.b1.price).toBeLessThanOrEqual(85000);
  });
});
