// ============================================================================
// GANN & ASTRO TRADING ENGINE — RISK & POSITION SIZING RULES
// Starting Capital: $300 | Leverage: 1:1000 | Strict 1:2 R:R Ratio
// Gold SL: 15 points (Max $15 risk) | BTC SL: Max $15 risk | Crypto SL: Max $10 risk
// ============================================================================

export const DEFAULT_STARTING_BALANCE = 300;
export const DEFAULT_LEVERAGE = 1000;

export const ASSET_RISK_RULES = {
  // Gold (PAXG / XAU): 15 points SL, $15 max dollar risk, 30 points TP (1:2 R:R)
  GOLD: {
    maxRiskDollar: 15,
    slPoints: 15,
    rrRatio: 2.0, // 1:2 R:R
    tpPoints: 30
  },
  // Bitcoin (BTC): Max $15 dollar risk, 1:2 R:R
  BTC: {
    maxRiskDollar: 15,
    slBufferPct: 0.35, // ~0.35% buffer
    rrRatio: 2.0
  },
  // Altcoin Cryptos (ETH, SOL, BNB, etc.): Max $10 dollar risk, 1:2 R:R
  CRYPTO_ALT: {
    maxRiskDollar: 10,
    slBufferPct: 0.50, // ~0.50% buffer
    rrRatio: 2.0
  }
};

/**
 * Identify asset category
 */
export function getAssetCategory(symbol, ticker = '') {
  const s = (symbol || '').toUpperCase();
  const t = (ticker || '').toUpperCase();
  if (s.includes('PAXG') || s.includes('XAU') || t.includes('XAU') || t.includes('GOLD')) {
    return 'GOLD';
  }
  if (s.includes('BTC') || t.includes('BTC')) {
    return 'BTC';
  }
  return 'CRYPTO_ALT';
}

/**
 * Calculate precise trade parameters adhering to user's strict rules:
 * - Starting capital: $300
 * - Leverage: 1:1000
 * - 1:2 R:R ratio
 * - SL max $15 on Gold/BTC, max $10 on Crypto
 */
export function calculatePreciseTradeSetup({
  lvl,
  isShort,
  ticker,
  symbol,
  currentPrice,
  accountBalance = DEFAULT_STARTING_BALANCE,
  leverage = DEFAULT_LEVERAGE
}) {
  const entry = lvl?.price ? Number(lvl.price) : Number(currentPrice);
  const category = getAssetCategory(symbol, ticker);
  const rule = ASSET_RISK_RULES[category];

  let stopLoss;
  let takeProfit1;
  let slDistanceDollar;
  let slDistancePoints;
  const maxRiskDollar = rule.maxRiskDollar;

  if (category === 'GOLD') {
    // Gold: 15 points / dollars SL, 30 points TP (exact 1:2 R:R)
    slDistancePoints = rule.slPoints; // 15
    const tpDistancePoints = rule.tpPoints; // 30

    if (isShort) {
      stopLoss = Number((entry + slDistancePoints).toFixed(2));
      takeProfit1 = Number((entry - tpDistancePoints).toFixed(2));
    } else {
      stopLoss = Number((entry - slDistancePoints).toFixed(2));
      takeProfit1 = Number((entry + tpDistancePoints).toFixed(2));
    }

    slDistanceDollar = slDistancePoints;
  } else if (category === 'BTC') {
    // BTC: Max $15 risk, 1:2 R:R
    const slPct = rule.slBufferPct / 100;
    slDistancePoints = Number((entry * slPct).toFixed(2));

    if (isShort) {
      stopLoss = Number((entry + slDistancePoints).toFixed(2));
      takeProfit1 = Number((entry - (slDistancePoints * rule.rrRatio)).toFixed(2));
    } else {
      stopLoss = Number((entry - slDistancePoints).toFixed(2));
      takeProfit1 = Number((entry + (slDistancePoints * rule.rrRatio)).toFixed(2));
    }

    slDistanceDollar = slDistancePoints;
  } else {
    // Crypto Altcoins (ETH, SOL, BNB, etc.): Max $10 risk, 1:2 R:R
    const slPct = rule.slBufferPct / 100;
    slDistancePoints = Number((entry * slPct).toFixed(2));

    if (isShort) {
      stopLoss = Number((entry + slDistancePoints).toFixed(2));
      takeProfit1 = Number((entry - (slDistancePoints * rule.rrRatio)).toFixed(2));
    } else {
      stopLoss = Number((entry - slDistancePoints).toFixed(2));
      takeProfit1 = Number((entry + (slDistancePoints * rule.rrRatio)).toFixed(2));
    }

    slDistanceDollar = slDistancePoints;
  }

  // Calculate lot units so that if SL is hit, the loss equals exactly maxRiskDollar ($15 or $10)
  const positionUnits = slDistanceDollar > 0 ? Number((maxRiskDollar / slDistanceDollar).toFixed(4)) : 0;
  const notionalUsd = Number((positionUnits * entry).toFixed(2));
  // Leverage 1:1000: Margin required is notional / 1000
  const marginRequired = Number((notionalUsd / leverage).toFixed(2));

  const slDistancePct = Number(((slDistancePoints / entry) * 100).toFixed(2));
  const tp1DistancePoints = Math.abs(takeProfit1 - entry);
  const tp1DistancePct = Number(((tp1DistancePoints / entry) * 100).toFixed(2));
  const rrRatio = slDistancePoints > 0 ? Number((tp1DistancePoints / slDistancePoints).toFixed(2)) : 2.0;

  return {
    direction: isShort ? 'SHORT' : 'LONG',
    isShort,
    entry,
    stopLoss,
    takeProfit1,
    takeProfit2: Number((isShort ? entry - (tp1DistancePoints * 1.5) : entry + (tp1DistancePoints * 1.5)).toFixed(2)),
    slDistancePoints,
    slDistancePct,
    tp1DistancePoints,
    tp1DistancePct,
    rrRatio,
    maxRiskDollar,
    riskDollars: maxRiskDollar,
    positionUnits,
    notionalUsd,
    marginRequired,
    leverage,
    accountBalance,
    category
  };
}
