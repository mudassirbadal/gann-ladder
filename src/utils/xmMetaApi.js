// ============================================================================
// XM BROKER METAAPI CLOUD DATA CLIENT
// Streams exact XM MetaTrader (MT4/MT5) GOLD / XAUUSD quotes & candles
// ============================================================================

const CLIENT_API_BASE = 'https://mt-client-api-v1.agiliumtrade.agiliumtrade.ai';
const MARKET_DATA_BASE = 'https://mt-market-data-client-api-v1.agiliumtrade.agiliumtrade.ai';

const DEFAULT_XM_CONFIG = {
  token: '',
  accountId: '',
  symbol: 'GOLD', // XM default is 'GOLD' or 'XAUUSD' or 'GOLDmicro'
  enabled: false
};

/**
 * Load persisted XM MetaApi configuration from localStorage
 */
export function loadXmConfig() {
  try {
    const raw = localStorage.getItem('gann_xm_config');
    return raw ? { ...DEFAULT_XM_CONFIG, ...JSON.parse(raw) } : DEFAULT_XM_CONFIG;
  } catch {
    return DEFAULT_XM_CONFIG;
  }
}

/**
 * Save XM MetaApi configuration to localStorage
 */
export function saveXmConfig(config) {
  try {
    localStorage.setItem('gann_xm_config', JSON.stringify(config));
  } catch (err) {
    console.warn('Failed to save XM config:', err);
  }
}

/**
 * Test connectivity to XM MT4/MT5 account via MetaApi
 */
export async function testXmConnection({ token, accountId, symbol = 'GOLD' }) {
  if (!token?.trim() || !accountId?.trim()) {
    throw new Error('Please enter both MetaApi Token and Account ID.');
  }

  const cleanToken = token.trim();
  const cleanAccountId = accountId.trim();
  const cleanSymbol = (symbol || 'GOLD').trim().toUpperCase();

  const url = `${CLIENT_API_BASE}/users/current/accounts/${cleanAccountId}/symbols/${cleanSymbol}/current-price`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'auth-token': cleanToken,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    let errMsg = `MetaApi returned HTTP ${res.status}`;
    try {
      const errJson = await res.json();
      errMsg = errJson.message || errMsg;
    } catch {
      // ignore json parse error
    }
    throw new Error(errMsg);
  }

  const data = await res.json();
  const price = data.price || (data.bid && data.ask ? (data.bid + data.ask) / 2 : data.bid);

  return {
    success: true,
    symbol: cleanSymbol,
    price: Number(price),
    bid: data.bid,
    ask: data.ask,
    time: data.time || new Date().toISOString()
  };
}

/**
 * Fetch current price for XM symbol
 */
export async function fetchXmCurrentPrice({ token, accountId, symbol = 'GOLD' }) {
  if (!token || !accountId) return null;

  try {
    const cleanToken = token.trim();
    const cleanAccountId = accountId.trim();
    const cleanSymbol = (symbol || 'GOLD').trim().toUpperCase();

    const url = `${CLIENT_API_BASE}/users/current/accounts/${cleanAccountId}/symbols/${cleanSymbol}/current-price`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'auth-token': cleanToken,
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const price = data.price || (data.bid && data.ask ? (data.bid + data.ask) / 2 : data.bid);
      return {
        price: Number(price),
        bid: Number(data.bid || price),
        ask: Number(data.ask || price),
        time: data.time
      };
    }
  } catch (err) {
    console.warn('MetaApi fetch current price error:', err);
  }
  return null;
}

/**
 * Fetch historical candles for XM symbol
 */
export async function fetchXmCandles({
  token,
  accountId,
  symbol = 'GOLD',
  timeframe = '4h',
  limit = 45
}) {
  if (!token || !accountId) return null;

  try {
    const cleanToken = token.trim();
    const cleanAccountId = accountId.trim();
    const cleanSymbol = (symbol || 'GOLD').trim().toUpperCase();

    // Map common timeframes to MetaApi format
    const tfMap = {
      '1m': '1m',
      '3m': '1m', // MetaApi standard is 1m / 5m
      '5m': '5m',
      '15m': '15m',
      '1h': '1h',
      '4h': '4h'
    };
    const mappedTf = tfMap[timeframe] || '4h';

    const url = `${MARKET_DATA_BASE}/users/current/accounts/${cleanAccountId}/historical-market-data/symbols/${cleanSymbol}/timeframes/${mappedTf}/candles?limit=${limit}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'auth-token': cleanToken,
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      const raw = await res.json();
      if (Array.isArray(raw)) {
        return raw.map((c) => ({
          openTime: new Date(c.time).getTime(),
          open: Number(c.open),
          high: Number(c.high),
          low: Number(c.low),
          close: Number(c.close),
          closeTime: new Date(c.time).getTime() + 60000,
          volume: c.volume || c.tickVolume || 0
        }));
      }
    }
  } catch (err) {
    console.warn('MetaApi fetch candles error:', err);
  }
  return null;
}
