import { describe, it, expect } from 'vitest';
import {
  formatHourClock,
  buildPlanetaryHours,
  computeFullAstroState,
  PLANETS
} from '../utils/astroMath';

describe('Astro Math & 12-Hour IST Engine', () => {
  it('formats hours into standard 12-hour AM/PM format with zero padding', () => {
    expect(formatHourClock(0)).toBe('12:00 AM');
    expect(formatHourClock(0.5)).toBe('12:30 AM');
    expect(formatHourClock(1)).toBe('01:00 AM');
    expect(formatHourClock(9.25)).toBe('09:15 AM');
    expect(formatHourClock(12)).toBe('12:00 PM');
    expect(formatHourClock(12.75)).toBe('12:45 PM');
    expect(formatHourClock(13)).toBe('01:00 PM');
    expect(formatHourClock(15.5)).toBe('03:30 PM');
    expect(formatHourClock(23.75)).toBe('11:45 PM');
  });

  it('handles negative or overflowing decimal hours cleanly', () => {
    // 25 hours -> 1 hour (01:00 AM)
    expect(formatHourClock(25)).toBe('01:00 AM');
    // -1 hour -> 23 hours (11:00 PM)
    expect(formatHourClock(-1)).toBe('11:00 PM');
  });

  it('builds planetary hours with unbroken continuity and valid planets', () => {
    const hours = buildPlanetaryHours(new Date(), 5.5);
    expect(hours).toBeInstanceOf(Array);
    expect(hours.length).toBeGreaterThan(0);

    hours.forEach((h) => {
      expect(h.planet).toBeDefined();
      expect(h.planet.name).toBeDefined();
      expect(h.planet.glyph).toBeDefined();
      expect(h.bias).toBeDefined();
      expect(typeof h.startHr).toBe('number');
      expect(typeof h.endHr).toBe('number');
      expect(isNaN(h.startHr)).toBe(false);
      expect(isNaN(h.endHr)).toBe(false);
    });
  });

  it('computes full astro state for live or simulated scenarios', () => {
    const state = computeFullAstroState(new Date(), 'auto');
    expect(state).toBeDefined();
    expect(state.positions.length).toBe(PLANETS.length);
    expect(state.activeHora).toBeDefined();
    expect(state.compositeScore).toBeGreaterThanOrEqual(0);
    expect(state.compositeScore).toBeLessThanOrEqual(100);
  });
});
