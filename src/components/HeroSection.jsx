export default function HeroSection() {
  return (
    <div className="text-center mt-3 sm:mt-6 mb-4 sm:mb-6 px-3">
      <p
        className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-amber-800/80 font-semibold mb-1 font-mono"
      >
        REJECTION & BOUNCE RADAR
      </p>
      <h1
        className="text-2xl sm:text-4xl md:text-5xl tracking-tight text-stone-900"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: 'italic',
          fontWeight: 700
        }}
      >
        Higher Probability <span style={{ color: '#b88c19' }}>Zones</span>
      </h1>
      <p className="text-xs sm:text-sm text-stone-600 mt-1.5 sm:mt-2 max-w-xl mx-auto leading-relaxed">
        Gann Square of 9 degree ladders, consumed (<span className="font-mono text-[10px] px-1 py-0.2 bg-[#e6dfd1] rounded">USED</span>) reaction zones, and real-time Final Rejection / Final Bounce levels.
      </p>
    </div>
  );
}
