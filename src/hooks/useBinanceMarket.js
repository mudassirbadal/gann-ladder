import { useState, useEffect, useRef, useCallback } from 'react';
import { getISTTimeStr } from '../utils/formatters';

export function useBinanceMarket({ assets, dataMode }) {
  const [livePrices, setLivePrices] = useState({});
  const [liveChanges, setLiveChanges] = useState({});
  const [liveCandles, setLiveCandles] = useState({});
  const [liveCandles15m, setLiveCandles15m] = useState({});
  const [wsConnected, setWsConnected] = useState(false);
  const [priceTickFlash, setPriceTickFlash] = useState({});
  const [lastSyncTime, setLastSyncTime] = useState(getISTTimeStr());
  const [isSyncing, setIsSyncing] = useState(false);

  const prevPricesRef = useRef({});

  // 1. WebSocket Stream
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
  }, [dataMode, assets]);

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
            const tickerRes = await fetch(
              `https://api.binance.com/api/v3/ticker/24hr?symbol=${sym}`
            );
            if (tickerRes.ok) {
              const tickerData = await tickerRes.json();
              updatedPrices[sym] = parseFloat(tickerData.lastPrice);
              updatedChanges[sym] = parseFloat(tickerData.priceChangePercent);
            }

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
          } catch (innerErr) {
            console.warn(`Error fetching ${sym} from Binance:`, innerErr);
          }
        })
      );

      if (Object.keys(updatedPrices).length > 0) {
        setLivePrices((prev) => ({ ...prev, ...updatedPrices }));
        setLiveChanges((prev) => ({ ...prev, ...updatedChanges }));
        setLiveCandles((prev) => ({ ...prev, ...updatedCandles4h }));
        setLiveCandles15m((prev) => ({ ...prev, ...updatedCandles15m }));
        setLastSyncTime(getISTTimeStr());
      }
    } catch (e) {
      console.warn('Market sync error:', e);
    } finally {
      setIsSyncing(false);
    }
  }, [assets]);

  const fetchKlinesByInterval = useCallback(async (symbol, interval = '4h', limit = 45) => {
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
  }, []);

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
    fetchBinanceLiveMarket,
    fetchKlinesByInterval
  };
}
