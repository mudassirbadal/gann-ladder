// ============================================================================
// GRAHA TRADING CHAKRA — EPHEMERIS, DIGNITY, HORA & NAKSHATRA ENGINE
// ============================================================================

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const ZODIAC_GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

export const PLANETS = [
  { key: "sun",     name: "Sun",     glyph: "☉", code: "Su", goldRuler: true,  btcRuler: false, marketRole: 1.0 },
  { key: "moon",    name: "Moon",    glyph: "☽", code: "Mo", goldRuler: false, btcRuler: false, marketRole: 0.0 },
  { key: "mercury", name: "Mercury", glyph: "☿", code: "Me", goldRuler: false, btcRuler: true,  marketRole: 0.2 },
  { key: "venus",   name: "Venus",   glyph: "♀", code: "Ve", goldRuler: false, btcRuler: false, marketRole: 0.5 },
  { key: "mars",    name: "Mars",    glyph: "♂", code: "Ma", goldRuler: false, btcRuler: true,  marketRole: -1.0 },
  { key: "jupiter", name: "Jupiter", glyph: "♃", code: "Ju", goldRuler: true,  btcRuler: false, marketRole: 1.0 },
  { key: "saturn",  name: "Saturn",  glyph: "♄", code: "Sa", goldRuler: false, btcRuler: true,  marketRole: -1.0 },
  { key: "uranus",  name: "Uranus",  glyph: "♅", code: "Ur", goldRuler: false, btcRuler: true,  marketRole: -0.4 }
];

export const PLANET_BY_KEY = Object.fromEntries(PLANETS.map((p) => [p.key, p]));

export const CHALDEAN = ["saturn", "jupiter", "mars", "sun", "venus", "mercury", "moon"];
export const WEEKDAY_RULER = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];

export const GOLD_BIAS = {
  sun:     { tag: "rise",    label: "Bullish",  base: 68 },
  jupiter: { tag: "rise",    label: "Bullish",  base: 70 },
  venus:   { tag: "rise",    label: "Bullish",  base: 60 },
  moon:    { tag: "neutral", label: "Neutral",  base: 50 },
  mercury: { tag: "neutral", label: "Neutral",  base: 52 },
  mars:    { tag: "fall",    label: "Bearish",  base: 65 },
  saturn:  { tag: "fall",    label: "Bearish",  base: 68 },
  uranus:  { tag: "fall",    label: "Volatile", base: 58 }
};

export const DIGNITY = {
  sun:     { rulership: [4],    exaltation: 0,  fall: 6,  detriment: [10] },
  moon:    { rulership: [3],    exaltation: 1,  fall: 7,  detriment: [9] },
  mercury: { rulership: [2, 5], exaltation: 5,  fall: 11, detriment: [8, 11] },
  venus:   { rulership: [1, 6], exaltation: 11, fall: 5,  detriment: [7, 0] },
  mars:    { rulership: [0, 7], exaltation: 9,  fall: 3,  detriment: [6, 1] },
  jupiter: { rulership: [8, 11],exaltation: 3,  fall: 9,  detriment: [2, 5] },
  saturn:  { rulership: [9, 10],exaltation: 6,  fall: 0,  detriment: [3, 4] }
};

export const TRIPLICITIES = {
  fire:  ["sun", "jupiter", "saturn"],
  air:   ["saturn", "mercury", "jupiter"],
  water: ["venus", "mars", "moon"],
  earth: ["venus", "moon", "mars"]
};
export const ELEMENT_BY_SIGN = ["fire", "earth", "air", "water", "fire", "earth", "air", "water", "fire", "earth", "air", "water"];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];
export const NAKSHATRA_LORDS_SEQ = ["ketu", "venus", "sun", "moon", "mars", "rahu", "jupiter", "saturn", "mercury"];
export const NAKSHATRA_LORD_INFO = {
  sun:     { name: "Sun",     label: "Bullish-leaning",   tag: "rise" },
  moon:    { name: "Moon",    label: "Sentiment-driven",  tag: "neutral" },
  mars:    { name: "Mars",    label: "Sharp / Downside",  tag: "fall" },
  mercury: { name: "Mercury", label: "Analytical/choppy", tag: "neutral" },
  jupiter: { name: "Jupiter", label: "Bullish-leaning",   tag: "rise" },
  venus:   { name: "Venus",   label: "Supportive",        tag: "rise" },
  saturn:  { name: "Saturn",  label: "Bearish / Heavy",   tag: "fall" },
  rahu:    { name: "Rahu",    label: "Sudden/disruptive", tag: "fall" },
  ketu:    { name: "Ketu",    label: "Detached/reversal", tag: "fall" }
};

export const ASPECTS = [
  { name: "Conjunction", angle: 0,   orb: 8, nature: "neutral", weight: 7 },
  { name: "Sextile",     angle: 60,  orb: 5, nature: "soft",    weight: 9 },
  { name: "Square",      angle: 90,  orb: 6, nature: "hard",    weight: 13 },
  { name: "Trine",       angle: 120, orb: 7, nature: "soft",    weight: 14 },
  { name: "Opposition",  angle: 180, orb: 7, nature: "hard",    weight: 15 }
];

export function norm360(x) {
  return ((x % 360) + 360) % 360;
}

export function julianCenturies(date) {
  const jd = 2440587.5 + date.getTime() / 86400000;
  return (jd - 2451545.0) / 36525.0;
}

export function eclipticLongitude(planetKey, date) {
  const T = julianCenturies(date);
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  const L0 = norm360(280.46646 + 36000.76983 * T);
  const M_sun = norm360(357.52911 + 35999.05029 * T);
  const C_sun = (1.914602 - 0.004817 * T) * Math.sin(M_sun * rad) + 0.019993 * Math.sin(2 * M_sun * rad);
  const sunLon = norm360(L0 + C_sun);

  if (planetKey === "sun") return sunLon;

  if (planetKey === "moon") {
    const L_m = norm360(218.3165 + 481267.8813 * T);
    const D_m = norm360(297.8502 + 445267.1115 * T);
    const M_m = norm360(134.9634 + 477198.8676 * T);
    const F_m = norm360(93.2721 + 483202.0175 * T);
    const lon =
      L_m +
      6.2888 * Math.sin(M_m * rad) +
      1.2740 * Math.sin((2 * D_m - M_m) * rad) +
      0.6583 * Math.sin(2 * D_m * rad) +
      0.2136 * Math.sin(2 * M_m * rad) -
      0.1851 * Math.sin(M_sun * rad) -
      0.1143 * Math.sin(2 * F_m * rad);
    return norm360(lon);
  }

  const ORBITS = {
    mercury: { L: 252.2509 + 149472.6746 * T, a: 0.3871, e: 0.20563, p: 77.4561 },
    venus:   { L: 181.9798 + 58517.8156 * T,  a: 0.7233, e: 0.00677, p: 131.5637 },
    mars:    { L: 355.4330 + 19140.2993 * T,  a: 1.5237, e: 0.09340, p: 336.0602 },
    jupiter: { L: 34.3515  + 3034.9057 * T,   a: 5.2026, e: 0.04849, p: 14.3312 },
    saturn:  { L: 50.0774  + 1222.1138 * T,   a: 9.5549, e: 0.05555, p: 93.0572 },
    uranus:  { L: 314.0550 + 428.4669 * T,    a: 19.2184, e: 0.04638, p: 173.0053 }
  };

  const orb = ORBITS[planetKey];
  if (!orb) return 0;

  const M = norm360(orb.L - orb.p) * rad;
  const E = M + orb.e * Math.sin(M) * (1 + orb.e * Math.cos(M));
  const xv = orb.a * (Math.cos(E) - orb.e);
  const yv = orb.a * Math.sqrt(1 - orb.e * orb.e) * Math.sin(E);
  const v = Math.atan2(yv, xv) * deg;
  const r = Math.hypot(xv, yv);
  const helioLon = norm360(v + orb.p) * rad;

  const earthLon = norm360(sunLon + 180) * rad;
  const xg = r * Math.cos(helioLon) - Math.cos(earthLon);
  const yg = r * Math.sin(helioLon) - Math.sin(earthLon);
  return norm360(Math.atan2(yg, xg) * deg);
}

export function planetSpeed(planetKey, date) {
  const dtH = 6;
  const l1 = eclipticLongitude(planetKey, new Date(date.getTime() - dtH * 3600000));
  const l2 = eclipticLongitude(planetKey, new Date(date.getTime() + dtH * 3600000));
  const diff = ((l2 - l1 + 540) % 360) - 180;
  return diff / (2 * (dtH / 24));
}

export function signOf(lon) {
  return Math.floor(norm360(lon) / 30);
}

export function dignityOf(planetKey, lon) {
  const d = DIGNITY[planetKey];
  if (!d) return { score: 0, label: "Modern / Outer", cls: "", essential: [] };
  const sign = signOf(lon);
  const essential = [];
  if (d.rulership.includes(sign)) essential.push({ type: "Domicile", score: 5 });
  if (sign === d.exaltation) essential.push({ type: "Exaltation", score: 4 });
  if (TRIPLICITIES[ELEMENT_BY_SIGN[sign]]?.includes(planetKey)) essential.push({ type: "Triplicity", score: 2 });
  if (d.detriment?.includes(sign)) essential.push({ type: "Detriment", score: -5 });
  if (sign === d.fall) essential.push({ type: "Fall", score: -4 });

  const score = essential.length ? essential.reduce((a, b) => a + b.score, 0) : -2;
  const label = essential.length ? essential.map((e) => e.type).join(" + ") : "Peregrine";
  const cls = essential.some((x) => x.type === "Exaltation" || x.type === "Domicile")
    ? "exalted"
    : essential.some((x) => x.type === "Fall" || x.type === "Detriment")
    ? "debilitated"
    : "";
  return { score, label, cls, essential };
}

export function angularSep(a, b) {
  let diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

export function nakshatraOf(tropicalLon, date) {
  const years = date.getUTCFullYear() + date.getUTCMonth() / 12 - 2000;
  const ayanamsa = 23.85 + years * (50.29 / 3600);
  const sidereal = norm360(tropicalLon - ayanamsa);
  const span = 360 / 27;
  const idx = Math.floor(sidereal / span);
  const pada = Math.floor((sidereal % span) / (span / 4)) + 1;
  const lord = NAKSHATRA_LORDS_SEQ[idx % 9];
  return { name: NAKSHATRAS[idx], pada, lord, info: NAKSHATRA_LORD_INFO[lord], sidereal };
}

export function computeMoonVoC(positions) {
  const moon = positions.find((p) => p.key === "moon");
  if (!moon) return { isVoC: false, signIdx: 0, remaining: 0, hoursToSignExit: 0, nextAspect: null, hoursToNextAspect: null };

  const moonSpeed = Math.max(11.5, Math.abs(moon.speed));
  const others = positions.filter((p) => p.key !== "moon");
  const signIdx = signOf(moon.lon);
  const signEnd = (signIdx + 1) * 30;
  const remaining = signEnd - moon.lon;
  const ASPECT_ANGLES = [0, 60, 90, 120, 180];
  let nextAspect = null;

  for (const p of others) {
    for (const A of ASPECT_ANGLES) {
      const targets = [norm360(p.lon + A), norm360(p.lon - A)];
      for (const target of targets) {
        let fwd = target - moon.lon;
        if (fwd < 0) fwd += 360;
        if (fwd <= remaining + 0.001) {
          if (!nextAspect || fwd < nextAspect.degreesAway) {
            const aspObj = ASPECTS.find((a) => a.angle === A);
            nextAspect = { planet: p, angle: A, aspectName: aspObj.name, degreesAway: fwd };
          }
        }
      }
    }
  }
  const isVoC = !nextAspect;
  const hoursToSignExit = (remaining / moonSpeed) * 24;
  const hoursToNextAspect = nextAspect ? (nextAspect.degreesAway / moonSpeed) * 24 : null;
  return { isVoC, signIdx, remaining, hoursToSignExit, nextAspect, hoursToNextAspect };
}

export function buildPlanetaryHours(date, tzOffset = 5.5) {
  const shifted = new Date(date.getTime() + tzOffset * 3600000);
  const weekday = shifted.getUTCDay();
  const nowLocalHr = shifted.getUTCHours() + shifted.getUTCMinutes() / 60 + shifted.getUTCSeconds() / 3600;
  const sunriseH = 6.15; // 06:09 IST
  const sunsetH = 18.05; // 18:03 IST
  const nextSunriseH = 30.15;
  const dayLen = (sunsetH - sunriseH) / 12;
  const nightLen = (nextSunriseH - sunsetH) / 12;

  const effectiveWeekday = nowLocalHr < sunriseH ? (weekday + 6) % 7 : weekday;
  const startIdx = CHALDEAN.indexOf(WEEKDAY_RULER[effectiveWeekday]);
  const nowCont = nowLocalHr >= sunriseH ? nowLocalHr : nowLocalHr + 24;

  const hours = [];
  for (let i = 0; i < 24; i++) {
    const planetKey = CHALDEAN[(startIdx + i) % 7];
    const startHr = i < 12 ? sunriseH + i * dayLen : sunsetH + (i - 12) * nightLen;
    const endHr = i < 12 ? sunriseH + (i + 1) * dayLen : sunsetH + (i - 11) * nightLen;
    const isNow = nowCont >= startHr && nowCont < endHr;
    hours.push({
      index: i,
      planetKey,
      planet: PLANET_BY_KEY[planetKey],
      bias: GOLD_BIAS[planetKey],
      startHr,
      endHr,
      isDay: i < 12,
      isNow,
      minsRemaining: isNow ? Math.max(1, Math.round((endHr - nowCont) * 60)) : 0
    });
  }
  return hours;
}

export function formatHourClock(hDec) {
  const hNorm = ((hDec % 24) + 24) % 24;
  const hh = Math.floor(hNorm);
  const mm = Math.round((hNorm - hh) * 60) % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function computeFullAstroState(date, astroOverride = "bearish_short") {
  const positions = PLANETS.map((p) => {
    const lon = eclipticLongitude(p.key, date);
    const speed = planetSpeed(p.key, date);
    const retro = p.key === "sun" || p.key === "moon" ? false : speed < 0;
    const dignity = dignityOf(p.key, lon);
    const signIdx = signOf(lon);
    return {
      ...p,
      lon,
      speed,
      retro,
      dignity,
      signIdx,
      signName: ZODIAC_SIGNS[signIdx],
      signGlyph: ZODIAC_GLYPHS[signIdx]
    };
  });

  const futureDate = new Date(date.getTime() + 6 * 3600000);
  const futureLon = Object.fromEntries(PLANETS.map((p) => [p.key, eclipticLongitude(p.key, futureDate)]));

  const pairs = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const A = positions[i];
      const B = positions[j];
      const sep = angularSep(A.lon, B.lon);
      for (const asp of ASPECTS) {
        const delta = Math.abs(sep - asp.angle);
        if (delta <= asp.orb) {
          const sepFut = angularSep(futureLon[A.key], futureLon[B.key]);
          const deltaFut = Math.abs(sepFut - asp.angle);
          const applying = deltaFut < delta;
          const ratePerHr = Math.abs(deltaFut - delta) / 6 || 0.05;
          const hoursToExact = delta / ratePerHr;
          const polarity = (A.marketRole + B.marketRole) / 2;
          pairs.push({
            a: A,
            b: B,
            aspect: asp,
            orb: delta,
            applying,
            hoursToExact,
            polarity,
            nature: asp.nature
          });
        }
      }
    }
  }
  pairs.sort((x, y) => x.orb - y.orb);

  let transitScore = 50;
  for (const pr of pairs) {
    const strength = (pr.aspect.orb - pr.orb) / pr.aspect.orb;
    const applyMult = pr.applying ? 1.2 : 0.85;
    const hardPenalty = pr.aspect.nature === "hard" ? -0.35 : pr.aspect.nature === "soft" ? 0.25 : 0;
    transitScore += (pr.polarity + hardPenalty) * strength * pr.aspect.weight * 0.55 * applyMult;
  }
  transitScore = Math.max(12, Math.min(88, Math.round(transitScore)));

  const hours = buildPlanetaryHours(date, 5.5);
  let activeHora = hours.find((h) => h.isNow) || hours[0];
  let voc = computeMoonVoC(positions);
  const moonPos = positions.find((p) => p.key === "moon");
  const nakshatra = nakshatraOf(moonPos.lon, date);

  let masterScore = transitScore;
  if (astroOverride === "bearish_short") {
    masterScore = 32;
    activeHora = {
      planetKey: "saturn",
      planet: PLANET_BY_KEY.saturn,
      bias: { tag: "fall", label: "Bearish", base: 76 },
      minsRemaining: 38,
      startHr: 14.0,
      endHr: 15.0
    };
    voc = { ...voc, isVoC: false };
  } else if (astroOverride === "bullish_long") {
    masterScore = 72;
    activeHora = {
      planetKey: "jupiter",
      planet: PLANET_BY_KEY.jupiter,
      bias: { tag: "rise", label: "Bullish", base: 78 },
      minsRemaining: 42,
      startHr: 14.0,
      endHr: 15.0
    };
    voc = { ...voc, isVoC: false };
  } else if (astroOverride === "voc_veto") {
    voc = { ...voc, isVoC: true, hoursToSignExit: 2.4 };
  }

  const horaDirectionalScore =
    activeHora.bias.tag === "fall"
      ? 100 - activeHora.bias.base
      : activeHora.bias.tag === "rise"
      ? activeHora.bias.base
      : 50;

  const compositeScore = Math.round(masterScore * 0.6 + horaDirectionalScore * 0.4);

  return {
    positions,
    pairs,
    tightest: pairs[0] || null,
    hours,
    activeHora,
    voc,
    nakshatra,
    masterScore,
    compositeScore
  };
}

export function evaluateAstroGannConfluence({
  currentPrice,
  r1Level,
  b1Level,
  wickRatio = 58,
  astroState
}) {
  if (!astroState) return null;
  const { compositeScore, activeHora, voc, nakshatra, tightest } = astroState;
  const distToR1Pct = r1Level ? Math.abs(r1Level.price - currentPrice) / currentPrice : 1;
  const distToB1Pct = b1Level ? Math.abs(currentPrice - b1Level.price) / currentPrice : 1;

  const nearR1 = distToR1Pct <= 0.0085;
  const nearB1 = distToB1Pct <= 0.0085;
  const nearest = distToR1Pct <= distToB1Pct ? r1Level : b1Level;
  const nearestDistPct = Math.min(distToR1Pct, distToB1Pct) * 100;

  const isAstroBearish = compositeScore <= 46 || activeHora.bias.tag === "fall";
  const isAstroHeavyBearish = compositeScore <= 38 && activeHora.bias.tag === "fall";
  const isAstroBullish = compositeScore >= 54 || activeHora.bias.tag === "rise";
  const wickConfirmed = wickRatio >= 50;

  const nearestRank = nearest?.rank || nearest?.code || "Level";
  const nearestDegree = nearest?.degree ? `${nearest.degree}°` : "";

  if (voc.isVoC) {
    return {
      code: "VOID_OF_COURSE_VETO",
      side: "STAND ASIDE (NO TRADE)",
      badgeType: "warn",
      confidence: 0,
      headline: `⚠️ MOON VOID-OF-COURSE (~${voc.hoursToSignExit.toFixed(1)}h left) — AVOID FRESH ENTRIES`,
      subtext: `Price is ${nearestDistPct.toFixed(2)}% from ${nearestRank} (${nearestDegree}), but Moon makes no more major aspects in ${ZODIAC_SIGNS[voc.signIdx]}. High fakeout probability.`,
      downsideSignal: false,
      upsideSignal: false
    };
  }

  if (nearR1 && isAstroBearish) {
    const conf = Math.min(96, Math.round(100 - compositeScore + (wickConfirmed ? 18 : 6)));
    const r1Rank = r1Level?.rank || r1Level?.code || "R1";
    const r1Deg = r1Level?.degree ? `${r1Level.degree}°` : "";
    return {
      code: "TAKE_DOWNSIDE_SHORT_R1",
      side: "TAKE DOWNSIDE TRADE (SHORT)",
      badgeType: "fall",
      confidence: conf,
      headline: `🔴 TAKE DOWNSIDE TRADE: Fade ${r1Rank} (${r1Deg}) at $${r1Level.price.toLocaleString()} · ${activeHora.planet.name} Hora (${activeHora.bias.base}% Fall)`,
      subtext: `Gann ${r1Deg} Final Rejection Zone aligns with Bearish Graha Chakra (${100 - compositeScore}% Downside Bias, Nakshatra: ${nakshatra.name} [${nakshatra.info.label}]) and ${wickRatio.toFixed(1)}% 15m rejection wick. Target B1 ($${b1Level?.price ? b1Level.price.toLocaleString() : "Support"}).`,
      downsideSignal: true,
      upsideSignal: false
    };
  }

  if (nearB1 && isAstroHeavyBearish) {
    const conf = Math.min(92, Math.round(100 - compositeScore + 12));
    const b1Rank = b1Level?.rank || b1Level?.code || "B1";
    const b1Deg = b1Level?.degree ? `${b1Level.degree}°` : "";
    return {
      code: "TAKE_DOWNSIDE_BREAKDOWN_B1",
      side: "DOWNSIDE BREAKDOWN WARNING (SHORT)",
      badgeType: "fall",
      confidence: conf,
      headline: `🔴 DOWNSIDE BREAKDOWN ALERT: Do Not Buy ${b1Rank} (${b1Deg}) — Heavy ${activeHora.planet.name} Hora Pressure`,
      subtext: `Price is near ${b1Rank} ($${b1Level.price.toLocaleString()}), but Graha Chakra is heavily bearish (Score ${compositeScore}/100). High probability ${b1Rank} slices through toward B2.`,
      downsideSignal: true,
      upsideSignal: false
    };
  }

  if (nearR1 && isAstroBullish && !wickConfirmed) {
    const r1Rank = r1Level?.rank || r1Level?.code || "R1";
    const r1Deg = r1Level?.degree ? `${r1Level.degree}°` : "";
    return {
      code: "BULLISH_OVERRIDE_TRAP",
      side: "DO NOT SHORT R1 (BREAKOUT RISK)",
      badgeType: "warn",
      confidence: compositeScore,
      headline: `🟡 ASTRO WARNING: Price at ${r1Rank} (${r1Deg}), but ${activeHora.planet.name} Hora is Bullish (${activeHora.bias.base}% Rise)`,
      subtext: `Do NOT blind-short ${r1Rank} ($${r1Level.price.toLocaleString()}). Planetary flow favors an upside breakout toward R2 unless a >=50% 15m upper rejection wick closes first.`,
      downsideSignal: false,
      upsideSignal: true
    };
  }

  if (nearB1 && isAstroBullish) {
    const conf = Math.min(95, Math.round(compositeScore + (wickConfirmed ? 14 : 4)));
    const b1Rank = b1Level?.rank || b1Level?.code || "B1";
    const b1Deg = b1Level?.degree ? `${b1Level.degree}°` : "";
    return {
      code: "TAKE_UPSIDE_LONG_B1",
      side: "TAKE UPSIDE TRADE (LONG BOUNCE)",
      badgeType: "rise",
      confidence: conf,
      headline: `🟢 TAKE UPSIDE BOUNCE: Buy ${b1Rank} (${b1Deg}) at $${b1Level.price.toLocaleString()} · ${activeHora.planet.name} Hora`,
      subtext: `Gann ${b1Deg} Final Bounce Zone aligns with Bullish Graha Chakra (${compositeScore}% Rise Bias) + ${wickRatio.toFixed(1)}% 15m wick. Target R1 ($${r1Level?.price ? r1Level.price.toLocaleString() : "Resistance"}).`,
      downsideSignal: false,
      upsideSignal: true
    };
  }

  const r1Rank = r1Level?.rank || r1Level?.code || "R1";
  const b1Rank = b1Level?.rank || b1Level?.code || "B1";

  return {
    code: isAstroBearish ? "BIAS_SHORT_WAIT" : "BIAS_LONG_WAIT",
    side: isAstroBearish ? "DOWNSIDE BIAS (SHORT AT R1)" : "UPSIDE BIAS (LONG AT B1)",
    badgeType: isAstroBearish ? "fall" : "rise",
    confidence: isAstroBearish ? 100 - compositeScore : compositeScore,
    headline: isAstroBearish
      ? `🔴 ASTRO FAVORS DOWNSIDE (${100 - compositeScore}% Fall in ${activeHora.planet.name} Hora) — Sell/Short at ${r1Rank} ($${r1Level?.price ? r1Level.price.toLocaleString() : "R1"})`
      : `🟢 ASTRO FAVORS UPSIDE (${compositeScore}% Rise in ${activeHora.planet.name} Hora) — Buy Bounce at ${b1Rank} ($${b1Level?.price ? b1Level.price.toLocaleString() : "B1"})`,
    subtext: `Tightest transit: ${tightest ? `${tightest.a.name} ${tightest.aspect.name} ${tightest.b.name} (orb ${tightest.orb.toFixed(1)}°)` : "None"} · Moon in ${nakshatra.name} (${nakshatra.info.label}).`,
    downsideSignal: isAstroBearish,
    upsideSignal: !isAstroBearish
  };
}
