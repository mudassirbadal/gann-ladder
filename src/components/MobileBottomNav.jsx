import { Layers, BarChart2, Briefcase, Compass, Menu } from 'lucide-react';

export default function MobileBottomNav({
  modalTab,
  setModalTab,
  isModalOpen,
  setIsModalOpen,
  alertsCount = 0,
  openTradesCount = 0,
  onOpenJournal,
  onOpenMenu
}) {
  const isLadderActive = isModalOpen && modalTab === 'ladder';
  const isChartActive = isModalOpen && modalTab === 'chart';
  const isAstroActive = isModalOpen && modalTab === 'astro';

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 sm:hidden pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 px-2.5 bg-[#fcfaf5]/95 backdrop-blur-xl border-t border-[#ded5c2] shadow-[0_-8px_30px_rgba(30,28,24,0.09)] transition-all"
    >
      <div className="grid grid-cols-5 gap-1.5 max-w-md mx-auto items-center">
        {/* 1. LADDER TAB */}
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setModalTab('ladder');
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-90 ${
            isLadderActive
              ? 'bg-[#efe6d3] text-amber-950 font-bold shadow-2xs ring-1 ring-[#c59416]/50'
              : 'text-stone-500 hover:text-stone-800 hover:bg-[#f4efe2]'
          }`}
          aria-label="Open Ladder view"
        >
          <div className="relative inline-flex items-center justify-center">
            <Layers
              className={`w-4 h-4 transition-transform ${
                isLadderActive ? 'text-amber-800 scale-110' : 'text-stone-600'
              }`}
            />
          </div>
          <span
            className={`text-[10px] tracking-tight mt-0.5 leading-none transition-colors ${
              isLadderActive ? 'font-bold text-amber-950' : 'font-medium text-stone-600'
            }`}
          >
            Ladder
          </span>
          {isLadderActive && (
            <span className="w-1.5 h-1 rounded-full bg-[#c59416] mt-0.5" />
          )}
        </button>

        {/* 2. CHART TAB */}
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setModalTab('chart');
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-90 ${
            isChartActive
              ? 'bg-[#e2efe6] text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-500/50'
              : 'text-stone-500 hover:text-stone-800 hover:bg-[#f4efe2]'
          }`}
          aria-label="Open Candlestick Chart"
        >
          <div className="relative inline-flex items-center justify-center">
            <BarChart2
              className={`w-4 h-4 transition-transform ${
                isChartActive ? 'text-emerald-800 scale-110' : 'text-stone-600'
              }`}
            />
          </div>
          <span
            className={`text-[10px] tracking-tight mt-0.5 leading-none transition-colors ${
              isChartActive ? 'font-bold text-emerald-950' : 'font-medium text-stone-600'
            }`}
          >
            Chart
          </span>
          {isChartActive && (
            <span className="w-1.5 h-1 rounded-full bg-emerald-600 mt-0.5" />
          )}
        </button>

        {/* 3. ASTRO TAB */}
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setModalTab('astro');
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-90 ${
            isAstroActive
              ? 'bg-[#f1e9f7] text-purple-950 font-bold shadow-2xs ring-1 ring-purple-500/50'
              : 'text-stone-500 hover:text-stone-800 hover:bg-[#f4efe2]'
          }`}
          aria-label="Open Astro Graha Chakra"
        >
          <div className="relative inline-flex items-center justify-center">
            <Compass
              className={`w-4 h-4 transition-transform ${
                isAstroActive ? 'text-purple-800 scale-110' : 'text-stone-600'
              }`}
            />
          </div>
          <span
            className={`text-[10px] tracking-tight mt-0.5 leading-none transition-colors ${
              isAstroActive ? 'font-bold text-purple-950' : 'font-medium text-stone-600'
            }`}
          >
            Astro
          </span>
          {isAstroActive && (
            <span className="w-1.5 h-1 rounded-full bg-purple-600 mt-0.5" />
          )}
        </button>

        {/* 4. JOURNAL TAB */}
        <button
          type="button"
          onClick={onOpenJournal}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-stone-600 hover:text-stone-900 hover:bg-[#f4efe2] transition-all duration-200 active:scale-90"
          aria-label="Open Trading Journal"
        >
          <div className="relative inline-flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-stone-700" />
            {openTradesCount > 0 && (
              <span
                className="absolute -top-1.5 -right-2.5 min-w-[15px] h-[15px] px-1 rounded-full text-[8.5px] font-black font-mono flex items-center justify-center leading-none text-white bg-emerald-600 shadow-xs border border-white"
              >
                {openTradesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-stone-600 tracking-tight mt-0.5 leading-none">
            Journal
          </span>
        </button>

        {/* 5. HAMBURGER MENU TAB */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-stone-700 hover:text-stone-950 hover:bg-[#f4efe2] transition-all duration-200 active:scale-90"
          aria-label="Open Navigation Menu"
        >
          <div className="relative inline-flex items-center justify-center">
            <Menu className="w-4 h-4 text-amber-700" />
            {alertsCount > 0 && (
              <span
                className="absolute -top-1.5 -right-2.5 min-w-[15px] h-[15px] px-1 rounded-full text-[8.5px] font-black font-mono flex items-center justify-center leading-none text-white bg-amber-600 shadow-xs border border-white"
              >
                {alertsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold text-stone-800 tracking-tight mt-0.5 leading-none">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
}
