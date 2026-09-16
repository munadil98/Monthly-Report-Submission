import React, { useState } from 'react';
import {
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Copy,
  RefreshCw,
  Search,
  Filter,
  Users,
  ShieldCheck,
  ChevronRight,
  X,
  FileSpreadsheet,
  Download,
  ExternalLink,
  ArrowUpRight,
  LayoutGrid,
  Table2,
} from 'lucide-react';
import { MajlisHistoricalReport, AuthUser, SpreadsheetMetadata } from '../types';
import { FORM_FIELD_CATEGORIES, EXACT_FORM_FIELDS } from '../data/majlisList';

interface MajlisPreviousMonthsViewProps {
  currentUser: AuthUser;
  spreadsheet: SpreadsheetMetadata;
  reports: MajlisHistoricalReport[];
  isLoading: boolean;
  onRefresh: () => void;
  onLoadMonthIntoForm: (report: MajlisHistoricalReport) => void;
}

export const MajlisPreviousMonthsView: React.FC<MajlisPreviousMonthsViewProps> = ({
  currentUser,
  spreadsheet,
  reports,
  isLoading,
  onRefresh,
  onLoadMonthIntoForm,
}) => {
  const [selectedReportForModal, setSelectedReportForModal] = useState<MajlisHistoricalReport | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'submitted'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle between month-wise (cards) and tabular (table) format
  const [viewFormat, setViewFormat] = useState<'month-wise' | 'tabular'>(() => {
    try {
      return (localStorage.getItem('majlis_history_view_format') as 'month-wise' | 'tabular') || 'month-wise';
    } catch {
      return 'month-wise';
    }
  });

  // For tabular format: show summary columns or all 36 columns
  const [tabularColumnMode, setTabularColumnMode] = useState<'summary' | 'all-36'>('summary');

  const handleViewFormatChange = (mode: 'month-wise' | 'tabular') => {
    setViewFormat(mode);
    try {
      localStorage.setItem('majlis_history_view_format', mode);
    } catch {}
  };

  // Statistics
  const submittedMonths = reports.filter((r) => r.hasData);
  const latestSubmittedReport = [...submittedMonths].reverse().find((r) => r.hasData) || submittedMonths[0];

  const currentTajnid = latestSubmittedReport?.values['তাজনীদ ভুক্ত সদস্য'] ?? '—';
  const currentSafAwwal = latestSubmittedReport?.values['সফে আউয়াল'] ?? '—';
  const currentSafDoam = latestSubmittedReport?.values['সফে দওম'] ?? '—';
  const currentWasiyyat = latestSubmittedReport?.values['মোট ওসীয়্যতকারী'] ?? '—';
  const currentAmela = latestSubmittedReport?.values['মোট আমেলা সদস্য'] ?? '—';

  // Filtered reports
  const displayedReports = reports.filter((r) => {
    if (filterMode === 'submitted' && !r.hasData) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        r.monthTab.toLowerCase().includes(q) ||
        r.monthLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-emerald-100/80 overflow-hidden">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-300/30 text-[11px] font-bold text-emerald-100 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                আপনার নিজস্ব মজলিস রেকর্ড
              </span>
              <span className="text-[11px] text-emerald-200/80 hidden sm:inline">
                • গুগল শিটের সাথে সরাসরি সংযুক্ত
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              পূর্ববর্তী মাসসমূহের রিপোর্ট ও তথ্য
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl">
              মজলিস <strong>{currentUser.majlisFullName || currentUser.majlisEnglish}</strong> এর গুগল শিটে সংরক্ষিত বিগত সকল মাসের তথ্যাবলী। যেকোনো মাসের সম্পূর্ণ ৩৬টি ফিল্ড দেখতে পারেন অথবা নতুন ফরম পূরণের জন্য পূর্ববর্তী ডাটা লোড করতে পারেন।
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'শিট থেকে লোড হচ্ছে...' : 'রিফ্রেশ শিট ডাটা'}
            </button>

            {currentUser.role === 'admin' && spreadsheet.spreadsheetUrl && (
              <a
                href={spreadsheet.spreadsheetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-emerald-100 rounded-xl text-xs font-semibold transition"
                title="সরাসরি গুগল শিট ব্রাউজারে খুলুন"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden sm:inline">শিট ওপেন</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mt-5 pt-4 border-t border-emerald-700/60">
          <div className="bg-emerald-950/40 rounded-xl p-2.5 border border-emerald-600/30">
            <span className="text-[10px] text-emerald-200/80 font-medium block">রিপোর্ট সংরক্ষিত মাস</span>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              {submittedMonths.length} <span className="text-xs font-normal text-emerald-300">/ {reports.length} মাস</span>
            </span>
          </div>

          <div className="bg-emerald-950/40 rounded-xl p-2.5 border border-emerald-600/30">
            <span className="text-[10px] text-emerald-200/80 font-medium block">সর্বশেষ তাজনীদ</span>
            <span className="text-base sm:text-lg font-bold text-emerald-200 tracking-tight">
              {currentTajnid} <span className="text-xs font-normal text-emerald-300">জন</span>
            </span>
          </div>

          <div className="bg-emerald-950/40 rounded-xl p-2.5 border border-emerald-600/30">
            <span className="text-[10px] text-emerald-200/80 font-medium block">সফে আউয়াল / দওম</span>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              {currentSafAwwal} <span className="text-xs font-normal text-emerald-300">/ {currentSafDoam}</span>
            </span>
          </div>

          <div className="bg-emerald-950/40 rounded-xl p-2.5 border border-emerald-600/30">
            <span className="text-[10px] text-emerald-200/80 font-medium block">মোট আমেলা সদস্য</span>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              {currentAmela} <span className="text-xs font-normal text-emerald-300">জন</span>
            </span>
          </div>

          <div className="bg-emerald-950/40 rounded-xl p-2.5 border border-emerald-600/30 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-emerald-200/80 font-medium block">মোট ওসীয়্যতকারী</span>
            <span className="text-base sm:text-lg font-bold text-emerald-200 tracking-tight">
              {currentWasiyyat} <span className="text-xs font-normal text-emerald-300">জন</span>
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Format Toggle, Filter & Search */}
      <div className="p-4 bg-gray-50/90 border-b border-gray-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Format Toggle: Month Wise (Cards) vs Tabular Format */}
          <div className="inline-flex items-center p-1 bg-gray-200/90 rounded-xl">
            <button
              type="button"
              onClick={() => handleViewFormatChange('month-wise')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                viewFormat === 'month-wise'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="প্রতিটি মাসের কার্ড ভিউ"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>মাস ভিত্তিক</span>
            </button>
            <button
              type="button"
              onClick={() => handleViewFormatChange('tabular')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                viewFormat === 'tabular'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="সব মাসের তুলনামূলক টেবিল ভিউ"
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>টেবিল ফরম্যাট</span>
            </button>
          </div>

          <div className="h-5 w-px bg-gray-300 hidden sm:block"></div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-gray-200/80 rounded-xl">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              সকল মাস ({reports.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('submitted')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer ${
                filterMode === 'submitted'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              শুধু সংরক্ষিত ({submittedMonths.length})
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="মাসের নাম দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Reports Display: Month Wise Cards or Tabular Format */}
      <div className="p-4 sm:p-6">
        {isLoading && reports.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
            <p className="font-semibold text-gray-700">গুগল শিট থেকে আপনার মজলিসের বিগত সকল মাসের ডাটা লোড হচ্ছে...</p>
            <p className="text-[11px] text-gray-400 mt-1">অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন</p>
          </div>
        ) : displayedReports.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500">
            <AlertCircle className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="font-bold text-gray-700">কোনো তথ্য পাওয়া যায়নি</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {filterMode === 'submitted'
                ? 'এখনও কোনো মাসের রিপোর্ট শিটে সংরক্ষিত পাওয়া যায়নি।'
                : 'আপনার অনুসন্ধানের সাথে মিল পাওয়া যায়নি।'}
            </p>
          </div>
        ) : viewFormat === 'month-wise' ? (
          /* ========================================================================= */
          /* FORMAT 1: MONTH-WISE CARDS                                                */
          /* ========================================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedReports.map((rep) => {
              const tajnid = rep.values['তাজনীদ ভুক্ত সদস্য'];
              const saf1 = rep.values['সফে আউয়াল'];
              const saf2 = rep.values['সফে দওম'];
              const amela = rep.values['মোট আমেলা সদস্য'];
              const wasiyyat = rep.values['মোট ওসীয়্যতকারী'];
              const salat5 = rep.values['5 ওয়াক্ত নামাযীর সংখা'];
              const bajamat = rep.values['বাজামাত নামাযীর সংখ্যা'];
              const quran = rep.values['কতজন কুরআন পড়া জানেন'];

              return (
                <div
                  key={rep.monthTab}
                  className={`rounded-2xl border transition-all duration-150 flex flex-col justify-between overflow-hidden ${
                    rep.hasData
                      ? 'bg-white border-emerald-200/90 hover:border-emerald-400 hover:shadow-md'
                      : 'bg-gray-50/70 border-gray-200/80 opacity-75'
                  }`}
                >
                  {/* Card Header */}
                  <div className={`p-4 border-b ${rep.hasData ? 'bg-emerald-50/40 border-emerald-100' : 'bg-gray-100/50 border-gray-200'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          {rep.monthTab}
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 mt-1">
                          {rep.monthLabel}
                        </h3>
                      </div>

                      {rep.hasData ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          সংরক্ষিত ({rep.filledCount}টি ফিল্ড)
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-gray-500 bg-gray-200/70 px-2 py-0.5 rounded-full">
                          ডাটা নেই
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body Metrics */}
                  <div className="p-4 flex-1">
                    {rep.hasData ? (
                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <div>
                            <span className="text-[11px] text-gray-500 block">তাজনীদ সদস্য</span>
                            <span className="text-sm font-bold text-emerald-700">{tajnid ?? '—'}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-gray-500 block">ওসীয়্যতকারী</span>
                            <span className="text-sm font-bold text-gray-800">{wasiyyat ?? '—'}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 text-[11px] text-gray-600 pt-1">
                          <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                            <span className="text-[10px] text-gray-400 block">সফে আউয়াল</span>
                            <span className="font-bold text-gray-800">{saf1 ?? '—'}</span>
                          </div>
                          <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                            <span className="text-[10px] text-gray-400 block">সফে দওম</span>
                            <span className="font-bold text-gray-800">{saf2 ?? '—'}</span>
                          </div>
                          <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                            <span className="text-[10px] text-gray-400 block">আমেলা</span>
                            <span className="font-bold text-gray-800">{amela ?? '—'}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                          <span>৫ ওয়াক্ত নামাজী: <strong className="text-gray-700">{salat5 ?? '—'}</strong></span>
                          <span>বাজামাত: <strong className="text-gray-700">{bajamat ?? '—'}</strong></span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-gray-400 text-xs">
                        <p className="font-medium text-gray-500">এই মাসের রিপোর্ট এখনও জমা দেওয়া হয়নি</p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          উপরে মাসের নাম নির্বাচন করে রিপোর্টটি এন্ট্রি করতে পারেন
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="p-3 bg-gray-50/90 border-t border-gray-100 flex items-center gap-2">
                    {rep.hasData ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedReportForModal(rep)}
                          className="flex-1 py-1.5 px-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200/90 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          সম্পূর্ণ ডাটা ({rep.filledCount})
                        </button>

                        <button
                          type="button"
                          onClick={() => onLoadMonthIntoForm(rep)}
                          title="এই মাসের ডাটা দিয়ে ওপরের ফরম পূরণ করুন"
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-2xs"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          ফরমে লোড
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onLoadMonthIntoForm(rep)}
                        className="w-full py-1.5 px-3 bg-gray-200 hover:bg-emerald-600 hover:text-white text-gray-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        এই মাসের এন্ট্রি ফরম খুলুন
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ========================================================================= */
          /* FORMAT 2: TABULAR COMPARISON MATRIX                                       */
          /* ========================================================================= */
          <div className="space-y-3">
            {/* Table Control & Column Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div className="text-xs text-gray-600 font-medium flex items-center gap-1.5">
                <Table2 className="w-4 h-4 text-emerald-700" />
                <span>
                  প্রদর্শিত হচ্ছে: <strong className="text-gray-900">{displayedReports.length}</strong>টি মাসের তুলনামূলক রেকর্ড
                </span>
                <span className="text-[11px] text-gray-400 hidden md:inline">
                  (ডানে-বামে স্ক্রোল করে সব কলাম দেখুন)
                </span>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-[11px] text-gray-500 font-medium">কলাম ভিউ:</span>
                <div className="inline-flex p-0.5 bg-gray-200/80 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setTabularColumnMode('summary')}
                    className={`px-2.5 py-1 rounded-md font-bold text-xs transition cursor-pointer ${
                      tabularColumnMode === 'summary'
                        ? 'bg-white text-emerald-800 shadow-2xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    মূল সারসংক্ষেপ (১০টি কলাম)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTabularColumnMode('all-36')}
                    className={`px-2.5 py-1 rounded-md font-bold text-xs transition cursor-pointer ${
                      tabularColumnMode === 'all-36'
                        ? 'bg-white text-emerald-800 shadow-2xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    সম্পূর্ণ ৩৬টি কলাম
                  </button>
                </div>
              </div>
            </div>

            {/* The Comparative Data Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-2xl bg-white shadow-2xs">
              <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-bold divide-x divide-gray-200">
                    <th className="sticky left-0 bg-gray-100 z-10 px-3.5 py-3 whitespace-nowrap shadow-xs min-w-[160px]">
                      মাস (Month)
                    </th>
                    <th className="px-3 py-3 whitespace-nowrap text-center min-w-[120px]">
                      অবস্থা (Status)
                    </th>
                    {tabularColumnMode === 'summary' ? (
                      <>
                        <th className="px-3 py-3 whitespace-nowrap text-right bg-emerald-50/80 text-emerald-950 font-bold min-w-[90px]">
                          তাজনীদ
                        </th>
                        <th className="px-3 py-3 whitespace-nowrap text-right min-w-[90px]">সফে আউয়াল</th>
                        <th className="px-3 py-3 whitespace-nowrap text-right min-w-[85px]">সফে দওম</th>
                        <th className="px-3 py-3 whitespace-nowrap text-right min-w-[90px]">আমেলা সদস্য</th>
                        <th className="px-3 py-3 whitespace-nowrap text-right min-w-[90px]">ওসীয়্যতকারী</th>
                        <th className="px-3 py-3 whitespace-nowrap text-right min-w-[105px]">৫ ওয়াক্ত নামাযী</th>
                        <th className="px-3 py-3 whitespace-nowrap text-right min-w-[95px]">বাজামাত</th>
                        <th className="px-3 py-3 whitespace-nowrap text-right min-w-[95px]">কুরআন জানা</th>
                        <th className="px-3 py-3 whitespace-nowrap text-right min-w-[95px]">আমেলা বৈঠক</th>
                        <th className="px-3 py-3 whitespace-nowrap text-right min-w-[95px]">সাধারণ সভা</th>
                      </>
                    ) : (
                      EXACT_FORM_FIELDS.map((fieldName) => (
                        <th
                          key={fieldName}
                          className="px-3 py-3 whitespace-nowrap text-right min-w-[130px]"
                          title={fieldName}
                        >
                          {fieldName}
                        </th>
                      ))
                    )}
                    <th className="sticky right-0 bg-gray-100 z-10 px-3.5 py-3 whitespace-nowrap text-center shadow-xs min-w-[140px]">
                      অ্যাকশন (Actions)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {displayedReports.map((rep, idx) => {
                    const tajnid = rep.values['তাজনীদ ভুক্ত সদস্য'];
                    const saf1 = rep.values['সফে আউয়াল'];
                    const saf2 = rep.values['সফে দওম'];
                    const amela = rep.values['মোট আমেলা সদস্য'];
                    const wasiyyat = rep.values['মোট ওসীয়্যতকারী'];
                    const salat5 = rep.values['5 ওয়াক্ত নামাযীর সংখা'];
                    const bajamat = rep.values['বাজামাত নামাযীর সংখ্যা'];
                    const quran = rep.values['কতজন কুরআন পড়া জানেন'];
                    const amelaMtg = rep.values['আমেলা বৈঠক হয়েছে কিনা ও কয়টি'];
                    const sadharonMtg = rep.values['সাধারণ সভা হয়েছে কিনা ও কয়টি'];

                    return (
                      <tr
                        key={rep.monthTab}
                        className={`hover:bg-emerald-50/40 transition-colors divide-x divide-gray-100 ${
                          rep.hasData ? (idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40') : 'bg-gray-50/25 text-gray-400'
                        }`}
                      >
                        {/* Sticky Month Name */}
                        <td className="sticky left-0 bg-white hover:bg-emerald-50/40 z-10 px-3.5 py-2.5 whitespace-nowrap shadow-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                              {rep.monthTab}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {rep.monthLabel}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-3 py-2.5 whitespace-nowrap text-center">
                          {rep.hasData ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              সংরক্ষিত ({rep.filledCount})
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                              জমা পড়েনি
                            </span>
                          )}
                        </td>

                        {tabularColumnMode === 'summary' ? (
                          <>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right font-mono font-bold text-emerald-800 bg-emerald-50/30">
                              {tajnid ?? '—'}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right font-mono text-gray-700">
                              {saf1 ?? '—'}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right font-mono text-gray-700">
                              {saf2 ?? '—'}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right font-mono text-gray-700 font-semibold">
                              {amela ?? '—'}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right font-mono text-gray-700">
                              {wasiyyat ?? '—'}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right font-mono text-gray-700">
                              {salat5 ?? '—'}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right font-mono text-gray-700">
                              {bajamat ?? '—'}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right font-mono text-gray-700">
                              {quran ?? '—'}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right font-mono text-gray-700">
                              {amelaMtg ?? '—'}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right font-mono text-gray-700">
                              {sadharonMtg ?? '—'}
                            </td>
                          </>
                        ) : (
                          EXACT_FORM_FIELDS.map((fieldName) => {
                            const val = rep.values[fieldName];
                            return (
                              <td
                                key={fieldName}
                                className="px-3 py-2.5 whitespace-nowrap text-right font-mono text-gray-800"
                              >
                                {val !== undefined && val !== null && val !== '' ? String(val) : '—'}
                              </td>
                            );
                          })
                        )}

                        {/* Actions */}
                        <td className="sticky right-0 bg-white hover:bg-emerald-50/40 z-10 px-3 py-2.5 whitespace-nowrap text-center shadow-xs">
                          <div className="inline-flex items-center gap-1.5">
                            {rep.hasData ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setSelectedReportForModal(rep)}
                                  className="p-1 px-2 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg font-bold text-xs transition cursor-pointer inline-flex items-center gap-1"
                                  title="সম্পূর্ণ ৩৬টি ফিল্ডের রিপোর্ট দেখুন"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span className="hidden xl:inline">দেখুন</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onLoadMonthIntoForm(rep)}
                                  className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                                  title="এই মাসের ডাটা দিয়ে ওপরের ফরম পূরণ করুন"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>ফরমে লোড</span>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onLoadMonthIntoForm(rep)}
                                className="p-1 px-2.5 text-gray-600 hover:text-emerald-700 bg-gray-100 hover:bg-emerald-50 rounded-lg font-semibold text-xs transition cursor-pointer"
                                title="এই মাসের জন্য নতুন রিপোর্ট পূরণ করুন"
                              >
                                এন্ট্রি করুন
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Full 36-Fields View Modal */}
      {selectedReportForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white/20 rounded-md">
                    ট্যাব: {selectedReportForModal.monthTab}
                  </span>
                  <span className="text-xs text-emerald-200">
                    মজলিস: {currentUser.majlisFullName || currentUser.majlisEnglish}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold">
                  {selectedReportForModal.monthLabel} - সম্পূর্ণ ৩৬টি ফিল্ডের রিপোর্ট
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReportForModal(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 9 Categories with all 36 fields */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              {FORM_FIELD_CATEGORIES.map((cat) => {
                return (
                  <div key={cat.id} className="bg-gray-50/70 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3 border-b border-gray-200/80 pb-2">
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        {cat.name}
                      </h4>
                      {cat.englishTitle && (
                        <span className="text-[11px] text-gray-500 font-medium">
                          {cat.englishTitle}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {cat.fields.map((fieldName) => {
                        const val = selectedReportForModal.values[fieldName];
                        const isFilled = val !== undefined && val !== null && val !== '';

                        return (
                          <div
                            key={fieldName}
                            className={`p-2 rounded-lg border text-xs ${
                              isFilled
                                ? 'bg-white border-emerald-200/70'
                                : 'bg-gray-100/50 border-gray-200 text-gray-400'
                            }`}
                          >
                            <span className="text-[11px] text-gray-500 block leading-snug">
                              {fieldName}
                            </span>
                            <span className={`font-bold mt-0.5 block ${isFilled ? 'text-gray-900 font-mono text-sm' : 'text-gray-400 text-xs italic'}`}>
                              {isFilled ? String(val) : '— (ফাঁকা)'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-gray-500">
                মোট সংরক্ষিত তথ্য: <strong>{selectedReportForModal.filledCount}টি ফিল্ড</strong>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSelectedReportForModal(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  বন্ধ করুন
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onLoadMonthIntoForm(selectedReportForModal);
                    setSelectedReportForModal(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  এই ডাটা দিয়ে ফরম পূরণ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
