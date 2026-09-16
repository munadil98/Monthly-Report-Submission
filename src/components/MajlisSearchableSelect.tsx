import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  Check,
  Building2,
  RefreshCw,
  Plus,
  X,
  Sparkles,
  Lock,
} from 'lucide-react';

interface MajlisSearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onSyncFromSheet?: () => void;
  isSyncing?: boolean;
  isSheetSynced?: boolean;
  isLocked?: boolean;
  lockedNotice?: string;
  disabled?: boolean;
}

export const MajlisSearchableSelect: React.FC<MajlisSearchableSelectProps> = ({
  options,
  value,
  onChange,
  onSyncFromSheet,
  isSyncing = false,
  isSheetSynced = false,
  isLocked = false,
  lockedNotice,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter options based on search query (matches either Bangla or English)
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return options;
    }
    const q = searchQuery.toLowerCase().trim();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, searchQuery]);

  // Keep highlighted index in bounds
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
      setShowAddCustom(false);
    }
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        onChange(filteredOptions[highlightedIndex]);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleSelectOption = (opt: string) => {
    onChange(opt);
    setIsOpen(false);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    onChange(customInput.trim());
    setCustomInput('');
    setShowAddCustom(false);
    setIsOpen(false);
  };

  // Helper to highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="bg-emerald-200/90 text-emerald-950 font-bold rounded-xs px-0.5">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full" onKeyDown={disabled ? undefined : handleKeyDown}>
      {/* Trigger Button */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl flex items-center justify-between gap-2 text-xs transition shadow-2xs ${
          disabled
            ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed opacity-75'
            : isLocked
            ? 'bg-emerald-50/50 border border-emerald-300 hover:bg-emerald-50 cursor-pointer'
            : isOpen
            ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 cursor-pointer'
            : 'bg-white border-emerald-300 hover:border-emerald-400 cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {disabled ? (
            <Lock className="w-4 h-4 text-gray-400 shrink-0" />
          ) : isLocked ? (
            <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
          ) : (
            <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          {value ? (
            <div className="flex items-center gap-1.5 truncate">
              <span className={`font-bold truncate ${disabled ? 'text-gray-500' : 'text-gray-900'}`}>
                {value}
              </span>
            </div>
          ) : (
            <span className={disabled ? 'text-gray-400 italic' : 'text-gray-400 font-medium'}>
              {disabled ? 'প্রথমে মাসের নাম নির্বাচন করুন...' : 'মজলিস নাম নির্বাচন বা সার্চ করুন...'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {disabled ? (
            <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-600 text-[10px] font-semibold">
              নিষ্ক্রিয়
            </span>
          ) : isLocked ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-100/90 text-emerald-800 text-[10px] font-bold">
              {lockedNotice || 'নির্ধারিত মজলিস'}
            </span>
          ) : null}

          {!disabled && !isLocked && value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition"
              title="মুছে ফেলুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-emerald-600' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown Panel */}
      {!disabled && isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white border border-emerald-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-2.5 border-b border-gray-100 bg-gray-50/80 space-y-2">
            {!isLocked && (
              <div className="relative">
                <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="বাংলা বা ইংরেজিতে সার্চ করুন (যেমন: মিরপুর or Mirpur)..."
                  className="w-full pl-9 pr-8 py-2 text-xs font-medium bg-white border border-emerald-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Quick Actions / Sync status */}
            <div className="flex items-center justify-between text-[11px] px-1">
              <span className="text-gray-500 font-medium">
                {isLocked
                  ? '১টি মজলিস (লগইনকৃত ব্যবহারকারীর মজলিস)'
                  : `${filteredOptions.length}টি মজলিস পাওয়া গেছে`}
              </span>

              {!isLocked && onSyncFromSheet && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSyncFromSheet();
                  }}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-md transition cursor-pointer"
                  title="Google Sheet এর Majlis-Names শিট থেকে তালিকা রিফ্রেশ করুন"
                >
                  <RefreshCw
                    className={`w-3 h-3 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`}
                  />
                  <span>
                    {isSyncing
                      ? 'লোড হচ্ছে...'
                      : isSheetSynced
                      ? 'শিট থেকে সিঙ্ক করা'
                      : 'Majlis-Names থেকে সিঙ্ক'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* List of Options */}
          <ul
            ref={listRef}
            className="max-h-56 overflow-y-auto py-1 divide-y divide-gray-50 focus:outline-hidden"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-6 text-center text-xs text-gray-500 space-y-2">
                <p>কোনো মজলিস নাম পাওয়া যায়নি (&quot;{searchQuery}&quot;)</p>
                {!isLocked && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomInput(searchQuery);
                      setShowAddCustom(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    &quot;{searchQuery}&quot; নতুন মজলিস হিসেবে যোগ করুন
                  </button>
                )}
              </li>
            ) : (
              filteredOptions.map((option, idx) => {
                const isSelected = value === option;
                const isHighlighted = highlightedIndex === idx;

                return (
                  <li
                    key={option}
                    onClick={() => handleSelectOption(option)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-3.5 py-2 text-xs flex items-center justify-between gap-2 cursor-pointer transition ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 font-bold'
                        : isHighlighted
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">
                        {highlightMatch(option, searchQuery)}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </li>
                );
              })
            )}
          </ul>

          {/* Add custom option footer (only for admin / unlocked) */}
          {!isLocked && (
            <div className="p-2 border-t border-gray-100 bg-gray-50/60">
              {showAddCustom ? (
                <form onSubmit={handleAddCustom} className="flex gap-1.5">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="মজলিস নাম (Majlis in English)"
                    className="flex-1 px-2.5 py-1 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500 bg-white"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition"
                  >
                    যোগ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCustom(false)}
                    className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-200 rounded-lg"
                  >
                    বাতিল
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddCustom(true)}
                  className="w-full py-1 text-center text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center justify-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  নতুন কোনো মজলিস নাম যুক্ত করতে চান?
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
