import { useMemo } from 'react';
import { Compass, Layers, RotateCw } from 'lucide-react';
import CustomDropdown from '../Common/CustomDropdown';

export default function AnchorPopover({
  selectedSymbol,
  assets,
  setAssets,
  onClose,
  onResetPresets
}) {
  const stepOptions = useMemo(
    () => [
      {
        value: 45,
        label: '45° · Fine',
        sublabel: '1/8 Square of 9 · Scalp / 15m pivots',
        badge: 'Scalp',
        badgeColor: 'bg-blue-100 text-blue-800',
        icon: <Compass className="w-3.5 h-3.5 text-blue-600" />
      },
      {
        value: 90,
        label: '90° · Standard',
        sublabel: '1/4 Gann Cycle · Cardinal cross levels',
        badge: 'Default',
        badgeColor: 'bg-amber-100 text-amber-800',
        icon: <Layers className="w-3.5 h-3.5 text-amber-600" />
      },
      {
        value: 180,
        label: '180° · Major',
        sublabel: 'Half Cycle · Major swing reversals',
        badge: 'Macro',
        badgeColor: 'bg-purple-100 text-purple-800',
        icon: <RotateCw className="w-3.5 h-3.5 text-purple-600" />
      }
    ],
    []
  );

  return (
    <div className="mx-3 sm:mx-5 mb-2 p-3 rounded-2xl bg-[#f4efe2] border border-[#dad0bc] text-xs space-y-2.5 shrink-0 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <span
          className="font-bold text-stone-800 uppercase tracking-wider text-[11px] font-mono"
        >
          Gann Square of 9 Anchor & Step Picker
        </span>
        <button
          onClick={onClose}
          className="text-[11px] text-stone-500 hover:text-stone-900 font-mono"
        >
          Done ✕
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
        <div>
          <label className="block text-[10px] font-semibold text-stone-600 mb-0.5 font-mono">
            0° Base Pivot ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={assets[selectedSymbol]?.baseAnchor || 0}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 1;
              setAssets((prev) => ({
                ...prev,
                [selectedSymbol]: {
                  ...prev[selectedSymbol],
                  baseAnchor: val,
                  liveAnchorMode: 'manual',
                  presetLevels: null
                }
              }));
            }}
            className="w-full px-2.5 py-1.5 rounded-lg border border-[#cfc5b0] bg-[#fcfaf5] text-xs font-mono font-bold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-stone-600 mb-0.5 font-mono">
            Degree Step
          </label>
          <CustomDropdown
            value={assets[selectedSymbol]?.stepDegrees || 90}
            onChange={(val) => {
              setAssets((prev) => ({
                ...prev,
                [selectedSymbol]: {
                  ...prev[selectedSymbol],
                  stepDegrees: Number(val),
                  presetLevels: null
                }
              }));
            }}
            options={stepOptions}
            size="sm"
            className="w-full"
            buttonClassName="w-full bg-[#fcfaf5]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-stone-600 mb-0.5 font-mono">
            Origin Mode
          </label>
          <button
            onClick={onResetPresets}
            className="w-full py-2 px-2 rounded-lg bg-[#262420] text-[#fcfaf5] text-[11px] font-mono font-semibold hover:bg-stone-800 active:scale-95 transition"
          >
            Reset Default
          </button>
        </div>
      </div>
    </div>
  );
}
