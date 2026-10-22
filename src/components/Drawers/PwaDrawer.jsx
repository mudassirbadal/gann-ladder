import { Smartphone, X } from 'lucide-react';

export default function PwaDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-end"
      style={{ backgroundColor: 'rgba(30, 29, 26, 0.45)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md h-full p-4 sm:p-5 overflow-y-auto shadow-2xl space-y-4 sm:space-y-5 bg-[#fcfaf5] border-l border-[#dfd7c6]"
      >
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#e5decb]">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-700" />
            <h3
              className="text-lg sm:text-xl font-bold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Install on Mobile (PWA)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-stone-900 rounded-lg"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-stone-700 leading-relaxed">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#f4efe2] border border-[#dfd6c3] space-y-2">
            <div className="font-bold text-sm text-stone-900">
              Add to Home Screen (Android & iPhone)
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-stone-700">
              <li>Open this web application in <strong>Chrome</strong> (Android) or <strong>Safari</strong> (iPhone).</li>
              <li>
                Tap the menu button (<span className="font-mono font-bold">⋮</span> on Chrome or the <strong>Share</strong> button on iOS).
              </li>
              <li>
                Select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.
              </li>
              <li>
                Launch directly from your phone's home screen for a full-screen, native trading experience.
              </li>
            </ol>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#e5decb] space-y-2">
            <div className="font-bold text-sm text-stone-900">
              How "USED" Degree Promotion Works
            </div>
            <p>
              Every degree level (<code className="font-mono">90°</code>, <code className="font-mono">180°</code>, <code className="font-mono">270°</code>, <code className="font-mono">360°</code>) starts active. Once price enters a level's tolerance zone and reacts away, that degree is flagged <code className="font-mono font-bold">USED</code> with a strikethrough, and the next untouched level automatically becomes <code className="font-mono font-bold text-red-700">R1</code> or <code className="font-mono font-bold text-emerald-700">B1</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
