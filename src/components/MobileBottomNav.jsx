import { Layers, BarChart2, Briefcase, Compass, Menu } from 'lucide-react';

export default function MobileBottomNav({
  modalTab,
  setModalTab,
  isModalOpen,
  setIsModalOpen,
  alertsCount,
  openTradesCount = 0,
  autoTradingEnabled = false,
  onOpenAlerts,
  onOpenRules,
  onOpenJournal,
  onOpenMenu
}) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-[#fcfaf5]/95 backdrop-blur-md border-t border-[#dfd7c5] px-1 py-1.5 shadow-lg">
      <div className="grid grid-cols-5 gap-1">
        {/* Ladder Tab */}
        <button
          onClick={() => {
            setIsModalOpen(true);
            setModalTab('ladder');
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition active:scale-95 ${
            isModalOpen && modalTab === 'ladder'
              ? 'text-amber-800 font-bold bg-[#efe7d3]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 font-medium">Ladder</span>
        </button>

        {/* Chart Tab */}
        <button
          onClick={() => {
            setIsModalOpen(true);
            setModalTab('chart');
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition active:scale-95 ${
            isModalOpen && modalTab === 'chart'
              ? 'text-emerald-800 font-bold bg-[#e3efe7]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 font-medium">Chart</span>
        </button>

        {/* Astro Tab */}
        <button
          onClick={() => {
            setIsModalOpen(true);
            setModalTab('astro');
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition active:scale-95 ${
            isModalOpen && modalTab === 'astro'
              ? 'text-purple-800 font-bold bg-[#f1e9f7]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 font-medium">Astro</span>
        </button>

        {/* Journal Tab */}
        <button
          onClick={onOpenJournal}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-stone-500 hover:text-stone-800 relative transition active:scale-95"
        >
          <Briefcase className="w-4 h-4 text-stone-700" />
          <span className="text-[10px] mt-0.5 font-medium">Journal</span>
          {openTradesCount > 0 && (
            <span
              className="absolute top-0.5 right-2 px-1 rounded-full text-[8px] font-bold bg-emerald-600 text-white font-mono"
            >
              {openTradesCount}
            </span>
          )}
        </button>

        {/* Hamburger Menu Tab */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-stone-600 hover:text-stone-900 relative transition active:scale-95"
        >
          <Menu className="w-4 h-4 text-amber-700" />
          <span className="text-[10px] mt-0.5 font-semibold text-stone-800">Menu</span>
          {alertsCount > 0 && (
            <span
              className="absolute top-0.5 right-2 px-1 rounded-full text-[8px] font-bold bg-amber-600 text-white font-mono"
            >
              {alertsCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
