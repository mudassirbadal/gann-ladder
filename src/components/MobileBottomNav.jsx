import { Layers, BarChart2, Award, Bell, BookOpen } from 'lucide-react';

export default function MobileBottomNav({
  modalTab,
  setModalTab,
  isModalOpen,
  setIsModalOpen,
  alertsCount,
  onOpenAlerts,
  onOpenRules
}) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-[#fcfaf5]/95 backdrop-blur-md border-t border-[#dfd7c5] px-1 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Ladder Tab */}
        <button
          onClick={() => {
            setIsModalOpen(true);
            setModalTab('ladder');
          }}
          className={`flex flex-col items-center justify-center p-1 rounded-xl min-w-[50px] transition active:scale-95 ${
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
          className={`flex flex-col items-center justify-center p-1 rounded-xl min-w-[50px] transition active:scale-95 ${
            isModalOpen && modalTab === 'chart'
              ? 'text-emerald-800 font-bold bg-[#e3efe7]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 font-medium">Chart</span>
        </button>

        {/* Win Rate Tab */}
        <button
          onClick={() => {
            setIsModalOpen(true);
            setModalTab('analytics');
          }}
          className={`flex flex-col items-center justify-center p-1 rounded-xl min-w-[50px] transition active:scale-95 ${
            isModalOpen && modalTab === 'analytics'
              ? 'text-amber-800 font-bold bg-[#efe7d3]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 font-medium">Win-Rate</span>
        </button>

        {/* Rules Button */}
        <button
          onClick={onOpenRules}
          className="flex flex-col items-center justify-center p-1 rounded-xl min-w-[50px] text-stone-500 hover:text-stone-800 transition active:scale-95"
        >
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span className="text-[10px] mt-0.5 font-medium">Rules</span>
        </button>

        {/* Alerts Button */}
        <button
          onClick={onOpenAlerts}
          className="flex flex-col items-center justify-center p-1 rounded-xl min-w-[50px] text-stone-500 hover:text-stone-800 relative transition active:scale-95"
        >
          <Bell className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 font-medium">Alerts</span>
          {alertsCount > 0 && (
            <span
              className="absolute top-0.5 right-1 px-1 rounded-full text-[8px] font-bold bg-amber-600 text-white font-mono"
            >
              {alertsCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
