/**
 * Gann Degree Descriptions & Math Engine
 */

export function getDegreeDescription(deg, showCycleInRows) {
  if (deg === 0) return 'Base pivot · major swing low';
  if (deg === 450) return 'Extended pivot level';
  const norm = ((deg % 360) + 360) % 360;
  switch (norm) {
    case 0:
      return 'Full cycle · heavy rejection';
    case 45:
      return 'Minor level (1/8 square)';
    case 90:
      return showCycleInRows ? 'Intermediate pivot' : 'Intermediate pivot (1/4 square)';
    case 135:
      return 'Minor reaction zone';
    case 180:
      return 'Major reversal zone';
    case 225:
      return 'Intermediate continuation';
    case 270:
      return 'Strong demand & bounce zone';
    case 315:
      return 'Pre-target extension';
    default:
      return 'Gann harmonic level';
  }
}

export function isGoldHighlightDegree(deg) {
  const norm = ((deg % 360) + 360) % 360;
  return deg === 0 || norm === 0 || norm === 180;
}

/**
 * Calculates 14-period RSI from candle array
 */
export function calculateRSI(candles, period = 14) {
  if (!candles || candles.length < period + 1) return null;
  let gains = 0;
  let losses = 0;

  for (let i = candles.length - period; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Number((100 - 100 / (1 + rs)).toFixed(1));
}

/**
 * Calculates rejection wick ratio (%) on the latest candle
 */
export function calculateWickMetrics(candles) {
  if (!candles || candles.length < 2) {
    return { ratio: 58.4, dominant: 'lower', ohlc: null };
  }
  const c = candles[candles.length - 2];
  const range = c.high - c.low;
  if (range <= 0) return { ratio: 0, dominant: 'neutral', ohlc: c };
  const upperWick = c.high - Math.max(c.open, c.close);
  const lowerWick = Math.min(c.open, c.close) - c.low;
  const maxWick = Math.max(upperWick, lowerWick);
  const ratio = Number(((maxWick / range) * 100).toFixed(1));
  return {
    ratio,
    dominant: lowerWick >= upperWick ? 'lower' : 'upper',
    upperPct: Number(((upperWick / range) * 100).toFixed(1)),
    lowerPct: Number(((lowerWick / range) * 100).toFixed(1)),
    ohlc: c
  };
}

/**
 * Generates synthetic realistic OHLC candles around preset levels across multiple timeframes
 */
export function generatePresetCandles(asset, ladder, interval = '4h') {
  const now = Date.now();
  const intervalsMap = {
    '1m': { stepMs: 60 * 1000, volRatio: 0.04, count: 40 },
    '3m': { stepMs: 3 * 60 * 1000, volRatio: 0.055, count: 40 },
    '5m': { stepMs: 5 * 60 * 1000, volRatio: 0.075, count: 40 },
    '15m': { stepMs: 15 * 60 * 1000, volRatio: 0.095, count: 38 },
    '1h': { stepMs: 60 * 60 * 1000, volRatio: 0.12, count: 36 },
    '4h': { stepMs: 4 * 60 * 60 * 1000, volRatio: 0.14, count: 36 }
  };

  const config = intervalsMap[interval] || intervalsMap['4h'];
  const pNow = asset.snapshotPrice || asset.priceNow || 81500;
  const r1Price = ladder?.r1?.price || pNow * 1.012;
  const b1Price = ladder?.b1?.price || pNow * 0.985;
  const volatility = Math.max(1, (r1Price - b1Price) * config.volRatio);

  const synthetic = [];
  let cursor = pNow * 1.008;

  for (let i = config.count; i >= 0; i--) {
    const t = now - i * config.stepMs;
    const wave = Math.sin(i * 0.35) * volatility * 1.35;
    const open = cursor;
    let close = pNow + wave + (i === 0 ? 0 : (Math.random() - 0.48) * volatility * 0.5);
    if (i === 0) close = pNow;

    const bodyMax = Math.max(open, close);
    const bodyMin = Math.min(open, close);
    const extraWickMultiplier = i === 1 || i === 5 || i === 11 ? 1.75 : 0.65;
    const high = bodyMax + Math.abs(volatility * extraWickMultiplier * (0.4 + Math.random() * 0.5));
    const low = bodyMin - Math.abs(volatility * extraWickMultiplier * (0.4 + Math.random() * 0.5));

    synthetic.push({
      openTime: t,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      closeTime: t + config.stepMs
    });
    cursor = close;
  }
  return synthetic;
}

/**
 * Generates dynamic Gann Square of 9 levels around currentPrice
 */
export function buildGannLadder({
  baseAnchor,
  currentPrice,
  stepDegrees,
  showCycleInRows,
  scaleFactor = 1.0,
  candles = [],
  tolerancePct = 0.15,
  minReactionPct = 0.40
}) {
  const sqrtBase = Math.sqrt(Math.max(0.0001, baseAnchor));
  const sqrtCurrent = Math.sqrt(Math.max(0.0001, currentPrice));

  const rawTotalDegrees = ((sqrtCurrent - sqrtBase) * 180) / scaleFactor;
  const centerStepIndex = Math.round(rawTotalDegrees / stepDegrees);

  const rawLevels = [];
  for (let idx = centerStepIndex + 14; idx >= centerStepIndex - 14; idx--) {
    const totalDeg = idx * stepDegrees;
    const rootVal = sqrtBase + (totalDeg / 180.0) * scaleFactor;
    if (rootVal <= 0) continue;

    const price = rootVal * rootVal;
    let cycle;
    let displayDeg;

    if (showCycleInRows) {
      if (totalDeg > 0) {
        cycle = Math.floor((totalDeg - 1) / 360) + 1;
        displayDeg = totalDeg - (cycle - 1) * 360;
      } else if (totalDeg === 0) {
        cycle = 1;
        displayDeg = 0;
      } else {
        cycle = 1;
        displayDeg = totalDeg;
      }
    } else {
      cycle = Math.max(1, Math.floor(Math.max(0, totalDeg) / 360) + 1);
      displayDeg = totalDeg;
    }

    let used = false;
    let reactionType = null;
    let reactionDate = null;
    let moveDollar = 0;
    let movePct = 0;

    if (candles && candles.length > 3) {
      const tol = price * (tolerancePct / 100);
      for (let i = 1; i < candles.length - 1; i++) {
        const c = candles[i];
        const touched = c.low - tol <= price && c.high + tol >= price;
        if (touched) {
          const bounceGain = currentPrice - price;
          const bounceGainPct = (Math.abs(bounceGain) / price) * 100;

          if (currentPrice > price && bounceGainPct >= minReactionPct) {
            used = true;
            reactionType = 'bounce';
            moveDollar = bounceGain;
            movePct = bounceGainPct;
            const d = new Date(c.openTime);
            const now = new Date();
            const isToday = d.toDateString() === now.toDateString();
            reactionDate = isToday
              ? 'today'
              : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            break;
          } else if (currentPrice < price && bounceGainPct >= minReactionPct) {
            used = true;
            reactionType = 'rejection';
            moveDollar = currentPrice - price;
            movePct = bounceGainPct;
            const d = new Date(c.openTime);
            const now = new Date();
            const isToday = d.toDateString() === now.toDateString();
            reactionDate = isToday
              ? 'today'
              : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            break;
          }
        }
      }
    }

    const normDeg = ((displayDeg % 360) + 360) % 360;
    const mtfConfluence = normDeg === 0 || normDeg === 180 || displayDeg === 0;

    rawLevels.push({
      id: `lvl-${totalDeg}`,
      degree: displayDeg,
      cycle,
      totalDeg,
      price,
      desc: getDegreeDescription(displayDeg, showCycleInRows),
      used,
      reactionType,
      reactionDate,
      moveDollar,
      movePct,
      mtfConfluence
    });
  }

  return assignRanksAndTrimLadder(rawLevels, currentPrice);
}

/**
 * Assigns R1..R4 and B1..B4 to active levels, keeping intermediate USED levels
 */
export function assignRanksAndTrimLadder(allLevelsDesc, currentPrice) {
  const sortedDesc = [...allLevelsDesc].sort((a, b) => b.price - a.price);

  const aboveAsc = sortedDesc.filter((l) => l.price > currentPrice).sort((a, b) => a.price - b.price);
  const belowDesc = sortedDesc.filter((l) => l.price <= currentPrice).sort((a, b) => b.price - a.price);

  let rCount = 0;
  const taggedAbove = [];

  for (const lvl of aboveAsc) {
    if (!lvl.used) {
      rCount += 1;
      if (rCount <= 4) {
        taggedAbove.push({ ...lvl, rank: `R${rCount}` });
      }
    } else if (rCount < 4) {
      taggedAbove.push({ ...lvl, rank: 'USED' });
    }
  }

  let bCount = 0;
  const taggedBelow = [];

  for (const lvl of belowDesc) {
    if (!lvl.used) {
      bCount += 1;
      if (bCount <= 4) {
        taggedBelow.push({ ...lvl, rank: `B${bCount}` });
      }
    } else if (bCount < 4) {
      taggedBelow.push({ ...lvl, rank: 'USED' });
    }
  }

  const finalAboveDesc = taggedAbove.sort((a, b) => b.price - a.price);
  const finalBelowDesc = taggedBelow.sort((a, b) => b.price - a.price);

  const r1 = finalAboveDesc.find((l) => l.rank === 'R1') || null;
  const b1 = finalBelowDesc.find((l) => l.rank === 'B1') || null;

  return {
    above: finalAboveDesc,
    below: finalBelowDesc,
    r1,
    b1,
    allSortedDesc: sortedDesc
  };
}
