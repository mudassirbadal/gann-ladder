import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  computeFullAstroState,
  evaluateAstroGannConfluence
} from '../utils/astroMath';

export function useAstroEngine() {
  const [nowDate, setNowDate] = useState(() => new Date());
  const [astroOverride, setAstroOverride] = useState('bearish_short');

  // Update clock every 10 seconds for live ephemeris & Hora shifts
  useEffect(() => {
    const timer = setInterval(() => setNowDate(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const astroState = useMemo(
    () => computeFullAstroState(nowDate, astroOverride),
    [nowDate, astroOverride]
  );

  const getConfluenceSignal = useCallback(
    (activeItem) => {
      if (!activeItem || !activeItem.ladder) return null;
      return evaluateAstroGannConfluence({
        currentPrice: activeItem.priceNow,
        r1Level: activeItem.ladder.r1,
        b1Level: activeItem.ladder.b1,
        wickRatio: activeItem.wickRatio || 58.0,
        astroState
      });
    },
    [astroState]
  );

  return {
    nowDate,
    astroOverride,
    setAstroOverride,
    astroState,
    getConfluenceSignal
  };
}
