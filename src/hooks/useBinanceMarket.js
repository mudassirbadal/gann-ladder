import { useState, useEffect, useRef, useCallback } from 'react';
import { getISTTimeStr } from '../utils/formatters';
import { fetchXmCurrentPrice, fetchXmCandles } from '../utils/xmMetaApi';

export function useBinanceMarket({ assets, dataMode, xmConfig }) {
  const [livePrices, setLivePrices] = useState({});
  const [liveChanges, setLiveChanges] = useState({});
  const [liveCandles, setLiveCandles] = useState({});
  const [liveCandles15m, setLiveCandles15m] = useState({});
  const [wsConnected, setWsConnected] = useState(false);
  const [xmFeedActive, setXmFeedActive] = useState(false);
  const [priceTickFlash, setPriceTickFlash] = useState({});
  const [lastSyncTime, setLastSyncTime] = useState(getISTTimeStr());
  const [isSyncing, setIsSyncing] = useState(false);

  const prevPricesRef = useRef({});

  // 1. WebSocket Stream (Binance for Crypto)
  useEffect(() => {
    if (dataMode !== 'live') {
      return;
    }

    const streams = Object.keys(assets)
      .map((s) => `${s.toLowerCase()}@ticker`)
      .join('/');
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;

    let ws;
    let reconnectTimer;

    const connectWs = () => {
      try {
        ws = new WebSocket(wsUrl);
        ws.onopen = () => {
          setWsConnected(true);
        };
        ws.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            const data = payload?.data;
            if (!data || !data.s) return;

            const sym = data.s;

            // If XM feed is active for Gold, let XM quotes take exclusive precedence
            if (sym === 'PAXGUSDT' && xmConfig?.enabled && xmConfig?.token && xmConfig?.accountId) {
              return;
            }

            const newPrice = parseFloat(data.c);
            const changePct = parseFloat(data.P);

            if (!isNaN(newPrice)) {
              const oldPrice = prevPricesRef.current[sym];
              if (oldPrice && oldPrice !== newPrice) {
                const dir = newPrice > oldPrice ? 'up' : 'down';
                setPriceTickFlash((prev) => ({ ...prev, [sym]: dir }));
                setTimeout(() => {
                  setPriceTickFlash((prev) => ({ ...prev, [sym]: null }));
                }, 650);
              }
              prevPricesRef.current[sym] = newPrice;

              setLivePrices((prev) => ({ ...prev, [sym]: newPrice }));
              if (!isNaN(changePct)) {
                setLiveChanges((prev) => ({ ...prev, [sym]: changePct }));
              }
            }
          } catch {
            // ignore JSON parse errors
          }
        };
        ws.onerror = () => {
          setWsConnected(false);
        };
        ws.onclose = () => {
          setWsConnected(false);
          reconnectTimer = setTimeout(connectWs, 5000);
        };
      } catch {
        setWsConnected(false);
      }
    };

    connectWs();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
      setWsConnected(false);
    };
  }, [dataMode, assets, xmConfig]);

  // 1b. Real-Time Polling for XM Broker Gold (MetaApi Cloud)
  const isXmActive = Boolean(
    xmConfig && xmConfig.enabled && xmConfig.token && xmConfig.accountId
  );

  useEffect(() => {
    if (dataMode !== 'live' || !isXmActive) {
      setXmFeedActive(false);
      return;
    }

    let isMounted = true;

    const pollXmQuote = async () => {
      try {
        const xmRes = await fetchXmCurrentPrice(xmConfig);
        if (!isMounted || !xmRes || !xmRes.price) return;

        const newPrice = xmRes.price;
        const oldPrice = prevPricesRef.current['PAXGUSDT'];
        if (oldPrice && oldPrice !== newPrice) {
          const dir = newPrice > oldPrice ? 'up' : 'down';
          setPriceTickFlash((prev) => ({ ...prev, PAXGUSDT: dir }));
          setTimeout(() => {
            setPriceTickFlash((prev) => ({ ...prev, PAXGUSDT: null }));
          }, 650);
        }
        prevPricesRef.current['PAXGUSDT'] = newPrice;

        setLivePrices((prev) => ({ ...prev, PAXGUSDT: newPrice }));
        setXmFeedActive(true);
      } catch {
        // ignore XM poll error
      }
    };

    pollXmQuote();
    const interval = setInterval(pollXmQuote, 3500); // Poll XM quote every 3.5s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [dataMode, xmConfig]);

  // 2. REST Kline Fetcher
  const fetchBinanceLiveMarket = useCallback(async () => {
    setIsSyncing(true);
    try {
      const symbolsList = Object.keys(assets);
      const updatedPrices = {};
      const updatedChanges = {};
      const updatedCandles4h = {};
      const updatedCandles15m = {};

      await Promise.all(
        symbolsList.map(async (sym) => {
          try {
            // If XM feed is active for Gold, try fetching XM candles first
            if (sym === 'PAXGUSDT' && isXmActive) {
              try {
                const [xm4h, xm15m] = await Promise.all([
                  fetchXmCandles(xmConfig, '4h', 60),
                  fetchXmCandles(xmConfig, '15m', 25)
                ]);
                if (xm4h && xm4h.length > 0) updatedCandles4h[sym] = xm4h;
                if (xm15m && xm15m.length > 0) updatedCandles15m[sym] = xm15m;
              } catch (xmErr) {
                console.warn('XM candles fetch fallback to Binance:', xmErr);
              }
            }

            const tickerRes = await fetch(
              `https://api.binance.com/api/v3/ticker/24hr?symbol=${sym}`
            );
            if (tickerRes.ok) {
              const tickerData = await tickerRes.json();
              // Don't overwrite PAXGUSDT if XM feed is active
              if (!(sym === 'PAXGUSDT' && isXmActive)) {
                updatedPrices[sym] = parseFloat(tickerData.lastPrice);
                updatedChanges[sym] = parseFloat(tickerData.priceChangePercent);
              }
            }

            if (!updatedCandles4h[sym]) {
              const klines4hRes = await fetch(
                `https://api.binance.com/api/v3/klines?symbol=${sym}&interval=4h&limit=60`
              );
              if (klines4hRes.ok) {
                const rawKlines = await klines4hRes.json();
                updatedCandles4h[sym] = rawKlines.map((k) => ({
                  openTime: k[0],
                  open: parseFloat(k[1]),
                  high: parseFloat(k[2]),
                  low: parseFloat(k[3]),
                  close: parseFloat(k[4]),
                  closeTime: k[6]
                }));
              }
            }

            if (!updatedCandles15m[sym]) {
              const klines15mRes = await fetch(
                `https://api.binance.com/api/v3/klines?symbol=${sym}&interval=15m&limit=25`
              );
              if (klines15mRes.ok) {
                const raw15m = await klines15mRes.json();
                updatedCandles15m[sym] = raw15m.map((k) => ({
                  openTime: k[0],
                  open: parseFloat(k[1]),
                  high: parseFloat(k[2]),
                  low: parseFloat(k[3]),
                  close: parseFloat(k[4]),
                  closeTime: k[6]
                }));
              }
            }
          } catch (innerErr) {
            console.warn(`Error fetching ${sym} from Binance:`, innerErr);
          }
        })
      );

      if (Object.keys(updatedPrices).length > 0) {
        setLivePrices((prev) => ({ ...prev, ...updatedPrices }));
        setLiveChanges((prev) => ({ ...prev, ...updatedChanges }));
      }
      if (Object.keys(updatedCandles4h).length > 0) {
        setLiveCandles((prev) => ({ ...prev, ...updatedCandles4h }));
      }
      if (Object.keys(updatedCandles15m).length > 0) {
        setLiveCandles15m((prev) => ({ ...prev, ...updatedCandles15m }));
      }
      setLastSyncTime(getISTTimeStr());
    } catch (e) {
      console.warn('Market sync error:', e);
    } finally {
      setIsSyncing(false);
    }
  }, [assets, isXmActive, xmConfig]);

  const fetchKlinesByInterval = useCallback(async (symbol, interval = '4h', limit = 45) => {
    if (symbol === 'PAXGUSDT' && isXmActive) {
      try {
        const xmCandles = await fetchXmCandles(xmConfig, interval, limit);
        if (xmCandles && xmCandles.length > 0) {
          return xmCandles;
        }
      } catch (e) {
        console.warn('Failed XM candles in fetchKlinesByInterval, falling back to Binance:', e);
      }
    }
    try {
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      if (res.ok) {
        const raw = await res.json();
        return raw.map((k) => ({
          openTime: k[0],
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
          closeTime: k[6]
        }));
      }
    } catch (err) {
      console.warn(`Failed to fetch ${interval} candles for ${symbol}:`, err);
    }
    return null;
  }, [isXmActive, xmConfig]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!active) return;
      await fetchBinanceLiveMarket();
    };
    run();

    if (dataMode === 'live') {
      const interval = setInterval(fetchBinanceLiveMarket, 25000);
      return () => {
        active = false;
        clearInterval(interval);
      };
    }
    return () => {
      active = false;
    };
  }, [dataMode, fetchBinanceLiveMarket]);

  return {
    livePrices,
    liveChanges,
    liveCandles,
    liveCandles15m,
    wsConnected: dataMode === 'live' && wsConnected,
    priceTickFlash,
    lastSyncTime,
    isSyncing,
    xmFeedActive,
    fetchBinanceLiveMarket,
    fetchKlinesByInterval
  };
}

export default useBinanceMarket;
