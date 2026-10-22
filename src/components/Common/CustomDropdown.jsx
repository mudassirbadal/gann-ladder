import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export default function CustomDropdown({
  value,
  onChange,
  options = [],
  label,
  size = 'md', // 'sm' | 'md' | 'lg'
  align = 'left', // 'left' | 'right'
  className = '',
  buttonClassName = '',
  menuClassName = '',
  placeholder = 'Select option...',
  icon: TriggerIcon = null,
  searchable = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchable]);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        handleClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || null;

  // Filter options if search is active
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const term = searchTerm.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label?.toLowerCase().includes(term) ||
        opt.sublabel?.toLowerCase().includes(term) ||
        opt.description?.toLowerCase().includes(term) ||
        opt.badge?.toLowerCase().includes(term)
    );
  }, [options, searchTerm]);

  // Size styling maps
  const sizeClasses = {
    sm: 'text-xs py-1 px-2.5 min-h-[30px] rounded-lg gap-1.5',
    md: 'text-xs sm:text-sm py-2 px-3 min-h-[38px] rounded-xl gap-2',
    lg: 'text-sm sm:text-base py-2.5 px-3.5 min-h-[44px] rounded-xl gap-2.5'
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`}
    >
      {label && (
        <label className="block text-[10px] sm:text-xs font-semibold text-stone-600 mb-1 font-mono tracking-wide">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between font-mono font-medium transition-all duration-150 border bg-[#fcfaf5] text-stone-800 shadow-2xs hover:bg-white hover:border-[#b8860b] focus:outline-hidden focus:ring-2 focus:ring-[#b8860b]/30 active:scale-[0.98] ${
          isOpen
            ? 'border-[#b8860b] ring-2 ring-[#b8860b]/25 bg-white'
            : 'border-[#cfc5b0]'
        } ${sizeClasses[size] || sizeClasses.md} ${buttonClassName}`}
      >
        <div className="flex items-center gap-1.5 min-w-0 truncate">
          {TriggerIcon && (
            <TriggerIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          )}
          {selectedOption?.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate font-semibold">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase shrink-0 ${
                selectedOption.badgeColor || 'bg-amber-100 text-amber-800'
              }`}
            >
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 shrink-0 ml-1.5 ${
            isOpen ? 'rotate-180 text-amber-700' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Flyout */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className={`absolute z-50 mt-1.5 min-w-[210px] sm:min-w-[250px] max-w-[340px] max-h-72 overflow-y-auto rounded-xl bg-[#fcfaf5] border border-[#d6ccb8] shadow-xl p-1 font-mono text-xs focus:outline-hidden animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${menuClassName}`}
          style={{
            boxShadow: '0 14px 35px -4px rgba(38, 35, 29, 0.25), 0 4px 12px -2px rgba(38, 35, 29, 0.12)'
          }}
        >
          {/* Optional Search Input */}
          {searchable && (
            <div className="p-1.5 border-b border-[#e5decb] mb-1">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-[#cfc5b0] text-[11px]">
                <Search className="w-3 h-3 text-stone-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent focus:outline-hidden font-mono text-stone-800"
                />
              </div>
            </div>
          )}

          {filteredOptions.length === 0 ? (
            <div className="p-3 text-center text-[11px] text-stone-400">
              No matching options
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={String(option.value)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    handleClose();
                  }}
                  className={`group flex items-start justify-between gap-2.5 p-2 rounded-lg cursor-pointer transition-all active:scale-[0.99] ${
                    isSelected
                      ? 'bg-[#ece3cf] text-stone-900 font-bold shadow-2xs border-l-2 border-[#b8860b]'
                      : 'text-stone-700 hover:bg-[#f4efe2] hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    {option.icon ? (
                      <div className="mt-0.5 shrink-0 text-amber-700 group-hover:scale-110 transition-transform">
                        {option.icon}
                      </div>
                    ) : null}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-[11px] sm:text-xs">
                          {option.label}
                        </span>
                        {option.badge && (
                          <span
                            className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              option.badgeColor || 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {option.badge}
                          </span>
                        )}
                      </div>

                      {(option.sublabel || option.description) && (
                        <p className="text-[10px] text-stone-500 font-normal leading-tight mt-0.5 group-hover:text-stone-600">
                          {option.sublabel || option.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5 pl-1">
                    {isSelected ? (
                      <div className="w-4 h-4 rounded-full bg-amber-700 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-stone-300 opacity-0 group-hover:opacity-40 transition-opacity" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
