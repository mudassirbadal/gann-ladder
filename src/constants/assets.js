// Exact Screenshot Preset Data & Default Asset Configurations
// Formula: Price = (sqrt(BaseAnchor) + (TotalDegrees / 180) * scaleFactor)^2
// Every 360° completes 1 full Gann Cycle.

export const INITIAL_ASSETS = {
  BTCUSDT: {
    id: 'BTCUSDT',
    name: 'Bitcoin',
    ticker: 'BTC/USDT',
    symbolBadge: '₿',
    badgeColor: '#f7931a',
    isPerp: false,
    stepDegrees: 90,        // Bitcoin ladder steps by 90° (1/4 cycle) across multi-cycles
    showCycleInRows: true,
    baseAnchor: 59536.02,   // Cycle 1, 0° anchor producing exact $81,548 Cycle 12 ladder
    scaleFactor: 1.0,
    liveAnchorMode: 'auto', // 'auto' uses historical 4H swing low or manual baseAnchor
    tolerancePct: 0.15,
    minReactionPct: 0.40,
    snapshotPrice: 81548.00,
    snapshotChange24h: -3.45,
    snapshotCycle: 'Cycle 12',
    presetRsi15m: 31.4,
    presetWickRatio: 64.2,
    presetWinRate: 84.6,
    sparkline: [84200, 83900, 83100, 82800, 82100, 81462, 81900, 81548],
    presetLevels: [
      { id: 'btc-r4', degree: 90, cycle: 13, totalDeg: 4410, price: 83762.03, desc: 'Intermediate pivot', used: false, mtfConfluence: false },
      { id: 'btc-r3', degree: 360, cycle: 12, totalDeg: 4320, price: 83184.19, desc: 'Full cycle · heavy rejection', used: false, mtfConfluence: true },
      { id: 'btc-r2', degree: 270, cycle: 12, totalDeg: 4230, price: 82608.36, desc: 'Strong demand & bounce zone', used: false, mtfConfluence: false },
      { id: 'btc-r1', degree: 180, cycle: 12, totalDeg: 4140, price: 82034.53, desc: 'Major reversal zone', used: false, mtfConfluence: true },
      {
        id: 'btc-u1', degree: 90, cycle: 12, totalDeg: 4050, price: 81462.69, desc: 'Intermediate pivot',
        used: true, reactionType: 'bounce', reactionDate: 'today', moveDollar: 85.307, movePct: 0.10
      },
      {
        id: 'btc-u2', degree: 360, cycle: 11, totalDeg: 3960, price: 80892.86, desc: 'Full cycle · heavy rejection',
        used: true, reactionType: 'bounce', reactionDate: 'Oct 18', moveDollar: 4005.14, movePct: 4.95
      },
      {
        id: 'btc-u3', degree: 270, cycle: 11, totalDeg: 3870, price: 80325.03, desc: 'Strong demand & bounce zone',
        used: true, reactionType: 'bounce', reactionDate: 'Oct 15', moveDollar: 4572.97, movePct: 5.69
      },
      { id: 'btc-b1', degree: 180, cycle: 11, totalDeg: 3780, price: 79759.19, desc: 'Major reversal zone', used: false, mtfConfluence: true },
      { id: 'btc-b2', degree: 90, cycle: 11, totalDeg: 3690, price: 79195.36, desc: 'Intermediate pivot', used: false, mtfConfluence: false },
      { id: 'btc-b3', degree: 360, cycle: 10, totalDeg: 3600, price: 78633.53, desc: 'Full cycle · heavy rejection', used: false, mtfConfluence: true },
      { id: 'btc-b4', degree: 270, cycle: 10, totalDeg: 3510, price: 78073.69, desc: 'Strong demand & bounce zone', used: false, mtfConfluence: false },
    ]
  },
  PAXGUSDT: {
    id: 'PAXGUSDT',
    name: 'Gold',
    ticker: 'XAU/USDT',
    symbolBadge: 'Au',
    badgeColor: '#d4a72c',
    isPerp: true,
    stepDegrees: 45,        // Gold ladder uses fine 45° (1/8 square) steps around Cycle 1
    showCycleInRows: false,
    baseAnchor: 3948.18,    // Exact 0° Base pivot · major swing low from Gold screenshot
    scaleFactor: 1.0,
    liveAnchorMode: 'auto',
    tolerancePct: 0.15,
    minReactionPct: 0.35,
    snapshotPrice: 4061.06,
    snapshotChange24h: -1.89,
    snapshotCycle: 'Cycle 1',
    presetRsi15m: 68.8,
    presetWickRatio: 58.5,
    presetWinRate: 88.2,
    sparkline: [4165, 4140, 4115, 4098, 4080, 4043, 4070, 4061.06],
    presetLevels: [
      { id: 'xau-r4', degree: 450, cycle: 1, totalDeg: 450, price: 4268.60, desc: 'Extended pivot level', used: false, mtfConfluence: false },
      {
        id: 'xau-u1', degree: 360, cycle: 1, totalDeg: 360, price: 4203.52, desc: 'Full cycle · heavy rejection',
        used: true, reactionType: 'rejection', reactionDate: 'Oct 16', moveDollar: -149.79, movePct: 3.56
      },
      { id: 'xau-r3', degree: 315, cycle: 1, totalDeg: 315, price: 4171.16, desc: 'Pre-target extension', used: false, mtfConfluence: false },
      {
        id: 'xau-u2', degree: 270, cycle: 1, totalDeg: 270, price: 4138.93, desc: 'Strong demand & bounce zone',
        used: true, reactionType: 'rejection', reactionDate: 'Oct 21', moveDollar: -85.284, movePct: 2.06
      },
      { id: 'xau-r2', degree: 225, cycle: 1, totalDeg: 225, price: 4106.83, desc: 'Intermediate continuation', used: false, mtfConfluence: false },
      { id: 'xau-r1', degree: 180, cycle: 1, totalDeg: 180, price: 4074.85, desc: 'Major reversal zone', used: false, mtfConfluence: true },
      {
        id: 'xau-u3', degree: 135, cycle: 1, totalDeg: 135, price: 4042.99, desc: 'Minor reaction zone',
        used: true, reactionType: 'bounce', reactionDate: 'Aug 3', moveDollar: 657.64, movePct: 16.27
      },
      {
        id: 'xau-u4', degree: 90, cycle: 1, totalDeg: 90, price: 4011.26, desc: 'Intermediate pivot (1/4 square)',
        used: true, reactionType: 'bounce', reactionDate: 'Jul 29', moveDollar: 689.37, movePct: 17.19
      },
      {
        id: 'xau-u5', degree: 45, cycle: 1, totalDeg: 45, price: 3979.66, desc: 'Minor level (1/8 square)',
        used: true, reactionType: 'bounce', reactionDate: 'Jul 17', moveDollar: 720.97, movePct: 18.12
      },
      { id: 'xau-b1', degree: 0, cycle: 1, totalDeg: 0, price: 3948.18, desc: 'Base pivot · major swing low', used: false, mtfConfluence: true },
      { id: 'xau-b2', degree: -45, cycle: 1, totalDeg: -45, price: 3916.83, desc: 'Minor level (1/8 square)', used: false, mtfConfluence: false },
      { id: 'xau-b3', degree: -90, cycle: 1, totalDeg: -90, price: 3885.60, desc: 'Intermediate pivot (1/4 square)', used: false, mtfConfluence: true },
      { id: 'xau-b4', degree: -135, cycle: 1, totalDeg: -135, price: 3854.49, desc: 'Minor reaction zone', used: false, mtfConfluence: false },
    ]
  },
  ETHUSDT: {
    id: 'ETHUSDT',
    name: 'Ethereum',
    ticker: 'ETH/USDT',
    symbolBadge: 'Ξ',
    badgeColor: '#627eea',
    isPerp: false,
    stepDegrees: 90,
    showCycleInRows: true,
    baseAnchor: 1850.00,
    scaleFactor: 1.0,
    liveAnchorMode: 'auto',
    tolerancePct: 0.18,
    minReactionPct: 0.50,
    snapshotPrice: 2595.20,
    snapshotChange24h: -4.08,
    snapshotCycle: 'Cycle 7',
    presetRsi15m: 29.2,
    presetWickRatio: 54.0,
    presetWinRate: 81.0,
    sparkline: [2720, 2690, 2675, 2640, 2610, 2580, 2605, 2595.20],
    presetLevels: null
  },
  BNBUSDT: {
    id: 'BNBUSDT',
    name: 'BNB',
    ticker: 'BNB/USDT',
    symbolBadge: '❖',
    badgeColor: '#f3ba2f',
    isPerp: false,
    stepDegrees: 45,
    showCycleInRows: true,
    baseAnchor: 510.00,
    scaleFactor: 1.0,
    liveAnchorMode: 'auto',
    tolerancePct: 0.15,
    minReactionPct: 0.45,
    snapshotPrice: 726.30,
    snapshotChange24h: -2.14,
    snapshotCycle: 'Cycle 3',
    presetRsi15m: 44.5,
    presetWickRatio: 48.0,
    presetWinRate: 79.5,
    sparkline: [748, 742, 739, 735, 729, 722, 728, 726.30],
    presetLevels: null
  },
  XRPUSDT: {
    id: 'XRPUSDT',
    name: 'XRP',
    ticker: 'XRP/USDT',
    symbolBadge: '✕',
    badgeColor: '#23292f',
    isPerp: false,
    stepDegrees: 45,
    showCycleInRows: false,
    baseAnchor: 1.85,
    scaleFactor: 0.05,
    liveAnchorMode: 'auto',
    tolerancePct: 0.20,
    minReactionPct: 0.60,
    snapshotPrice: 2.3410,
    snapshotChange24h: -3.12,
    snapshotCycle: 'Cycle 2',
    presetRsi15m: 36.8,
    presetWickRatio: 61.3,
    presetWinRate: 82.4,
    sparkline: [2.45, 2.42, 2.39, 2.36, 2.33, 2.31, 2.35, 2.341],
    presetLevels: null
  }
};
