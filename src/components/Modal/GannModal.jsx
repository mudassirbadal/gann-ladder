import ModalHeader from './ModalHeader';
import AnchorPopover from './AnchorPopover';
import LadderView from '../Ladder/LadderView';
import GannCandlestickChart from '../Chart/GannCandlestickChart';
import GannAnalyticsPanel from '../Analytics/GannAnalyticsPanel';
import GrahaChakraPanel from '../Astro/GrahaChakraPanel';

export default function GannModal({
  isOpen,
  activeItem,
  allAssets,
  onSelectSymbol,
  onClose,
  dataMode,
  wsConnected,
  priceTickFlash,
  modalTab,
  setModalTab,
  expandedRowId,
  setExpandedRowId,
  accountBalance,
  setAccountBalance,
  riskPerTradePct,
  setRiskPerTradePct,
  showAnchorPopover,
  setShowAnchorPopover,
  selectedSymbol,
  assets,
  setAssets,
  onResetPresets,
  onSimulateReaction,
  fetchKlinesByInterval,
  onExecutePaperTrade,
  astroState,
  astroOverride,
  setAstroOverride,
  confluenceSignal
}) {
  if (!isOpen || !activeItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden overscroll-contain"
      style={{ backgroundColor: 'rgba(38, 35, 29, 0.55)', backdropFilter: 'blur(3px)' }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full sm:max-w-[560px] rounded-t-[28px] sm:rounded-[26px] shadow-2xl border border-[#e2dac7] overflow-hidden transition-all flex flex-col bg-[#fcfaf5] h-[92vh] sm:h-auto sm:max-h-[92vh] my-0 sm:my-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull/Drag Indicator */}
        <div className="w-12 h-1.5 bg-[#dcd5c4] rounded-full mx-auto mt-2 sm:hidden shrink-0" />

        {/* Modal Header with 5-coin switcher */}
        <ModalHeader
          activeItem={activeItem}
          allAssets={allAssets}
          onSelectSymbol={onSelectSymbol}
          dataMode={dataMode}
          wsConnected={wsConnected}
          priceTickFlash={priceTickFlash}
          showAnchorPopover={showAnchorPopover}
          setShowAnchorPopover={setShowAnchorPopover}
          modalTab={modalTab}
          setModalTab={setModalTab}
          onClose={onClose}
        />

        {/* Inline Anchor Popover */}
        {showAnchorPopover && (
          <AnchorPopover
            selectedSymbol={selectedSymbol}
            assets={assets}
            setAssets={setAssets}
            onClose={() => setShowAnchorPopover(false)}
            onResetPresets={onResetPresets}
          />
        )}

        {/* Scrollable Modal Body */}
        <div
          className="px-3.5 sm:px-5 pb-5 pt-2.5 overflow-y-auto space-y-3 flex-1 scrollbar-thin overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* TAB 1: Gann Ladder View */}
          {modalTab === 'ladder' && (
            <LadderView
              activeItem={activeItem}
              expandedRowId={expandedRowId}
              setExpandedRowId={setExpandedRowId}
              accountBalance={accountBalance}
              setAccountBalance={setAccountBalance}
              riskPerTradePct={riskPerTradePct}
              setRiskPerTradePct={setRiskPerTradePct}
              onExecutePaperTrade={onExecutePaperTrade}
              astroState={astroState}
              astroOverride={astroOverride}
              setAstroOverride={setAstroOverride}
              confluenceSignal={confluenceSignal}
            />
          )}

          {/* TAB 2: Graha Astro Wheel & Ephemeris */}
          {modalTab === 'astro' && (
            <GrahaChakraPanel astroState={astroState} />
          )}

          {/* TAB 3: Candlestick + Gann Overlay Chart */}
          {modalTab === 'chart' && (
            <GannCandlestickChart
              activeItem={activeItem}
              dataMode={dataMode}
              fetchKlinesByInterval={fetchKlinesByInterval}
              confluenceSignal={confluenceSignal}
              onSelectLevel={(lvlId) => {
                setModalTab('ladder');
                setExpandedRowId(lvlId);
              }}
            />
          )}

          {/* TAB 4: Win Rate & Confluence Analytics */}
          {modalTab === 'analytics' && (
            <GannAnalyticsPanel
              activeItem={activeItem}
              onSimulateReaction={onSimulateReaction}
              onResetPresets={onResetPresets}
            />
          )}

          {/* Footer Explanation */}
          <p className="text-center text-[10px] sm:text-[11px] text-[#787266] pt-2 px-2 leading-relaxed">
            A degree is used up once the price rejects or bounces from it, and the next one takes its place. Educational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
