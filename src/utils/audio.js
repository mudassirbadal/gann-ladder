/**
 * Web Audio Synthesizer for Rejection / Bounce alerts
 * Uses procedural waveforms without external audio assets
 */
export function playAlertChime(type = 'bounce') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'bounce') {
      // Rising harmonic chime for Bullish Bounce (C5 -> E5 -> G5)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.12);
      osc.frequency.setValueAtTime(783.99, now + 0.24);
    } else {
      // Falling harmonic chime for Bearish Rejection (G5 -> D#5 -> B4)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(783.99, now);
      osc.frequency.setValueAtTime(622.25, now + 0.12);
      osc.frequency.setValueAtTime(493.88, now + 0.24);
    }

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.start(now);
    osc.stop(now + 0.46);
  } catch {
    // Gracefully handle browser auto-play policy restrictions
  }
}
