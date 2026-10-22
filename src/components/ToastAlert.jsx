import { X, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export default function ToastAlert({ alert, onClose }) {
  if (!alert) return null;

  const isRejection = alert.type === 'rejection';
  const isBounce = alert.type === 'bounce';

  return (
    <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[90] max-w-sm sm:max-w-md w-[calc(100%-1.5rem)] animate-bounce-short">
      <div
        className="rounded-2xl p-3.5 sm:p-4 shadow-2xl border-2 flex items-start gap-3 transition-all"
        style={{
          backgroundColor: '#fcfaf5',
          borderColor: isRejection ? '#d9534f' : isBounce ? '#2e8b57' : '#d4a72c'
        }}
      >
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 font-bold text-white shadow-sm"
          style={{
            backgroundColor: isRejection ? '#d9534f' : isBounce ? '#2e8b57' : '#d4a72c'
          }}
        >
          {isRejection ? (
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : isBounce ? (
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1">
            <span
              className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded tracking-wider uppercase font-mono"
              style={{
                backgroundColor: isRejection ? '#faeceb' : '#e6f4ec',
                color: isRejection ? '#b93834' : '#216e43'
              }}
            >
              {alert.symbol} · {alert.degree}
            </span>
            <span className="text-[10px] text-stone-500 font-mono">
              {alert.time}
            </span>
          </div>

          <div className="font-bold text-xs sm:text-sm text-stone-900 mt-1 leading-snug">
            {alert.title}
          </div>

          <div className="text-[11px] sm:text-xs text-stone-600 mt-0.5 leading-relaxed">
            {alert.message}
          </div>

          {alert.currentPrice > 0 && (
            <div className="mt-1 text-[11px] font-mono font-bold text-stone-800">
              Price: ${formatPrice(alert.currentPrice)}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-700 p-1 -mr-1 -mt-1 rounded-lg transition"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
