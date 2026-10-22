import { Bell, X } from 'lucide-react';

export default function AlertsDrawer({
  isOpen,
  onClose,
  alertsLog,
  setAlertsLog,
  browserPushEnabled,
  onRequestBrowserNotifications
}) {
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
        className="w-full max-w-md h-full p-4 sm:p-5 overflow-y-auto flex flex-col justify-between shadow-2xl bg-[#fcfaf5] border-l border-[#dfd7c6]"
      >
        <div>
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#e5decb]">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-700" />
              <h3
                className="text-lg sm:text-xl font-bold"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Rejection & Bounce Alerts
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-500 hover:text-stone-900 rounded-lg"
              aria-label="Close alerts drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Enable Push Banner */}
          <div className="mt-3 sm:mt-4 p-3 sm:p-3.5 rounded-xl bg-[#f4efe2] border border-[#dfd6c3] flex items-center justify-between gap-2.5">
            <div>
              <div className="text-xs font-bold text-stone-800">
                Browser / Mobile Push Alerts
              </div>
              <div className="text-[10px] sm:text-[11px] text-stone-600 mt-0.5">
                Instant popup alerts when R1 or B1 triggers.
              </div>
            </div>
            <button
              onClick={onRequestBrowserNotifications}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 active:scale-95 transition ${
                browserPushEnabled
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#262420] text-white hover:bg-stone-800'
              }`}
            >
              {browserPushEnabled ? 'Enabled ✓' : 'Enable Push'}
            </button>
          </div>

          {/* Alert History List */}
          <div className="mt-4 space-y-2.5">
            {alertsLog.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500">
                No alerts recorded yet. Trigger a test from the toolbar.
              </div>
            ) : (
              alertsLog.map((item) => (
                <div
                  key={item.id}
                  className="p-3 sm:p-3.5 rounded-xl border bg-white shadow-xs"
                  style={{
                    borderColor: item.type === 'rejection' ? '#ebd0ce' : '#cbe3d4'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded font-mono"
                      style={{
                        backgroundColor: item.type === 'rejection' ? '#faeceb' : '#e6f4ec',
                        color: item.type === 'rejection' ? '#b93834' : '#216e43'
                      }}
                    >
                      {item.symbol} · {item.degree}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {item.time}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-stone-900 mt-1.5">{item.title}</div>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{item.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {alertsLog.length > 0 && (
          <button
            onClick={() => setAlertsLog([])}
            className="mt-6 w-full py-2 rounded-xl border border-[#dcd4c4] text-xs font-semibold text-stone-600 hover:bg-[#f2ece0] active:scale-98 transition"
          >
            Clear Alert History
          </button>
        )}
      </div>
    </div>
  );
}
