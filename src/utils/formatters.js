/**
 * Price formatting helper ensuring optimal decimal precision for crypto & commodities
 */
export function formatPrice(num, decimals = 2) {
  if (num === undefined || num === null || isNaN(num)) return '0.00';
  const d = num < 10 ? 4 : decimals;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d
  });
}

/**
 * Returns formatted current time in Indian Standard Time (IST)
 */
export function getISTTimeStr() {
  return (
    new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }) + ' IST'
  );
}
