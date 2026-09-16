import React, { useState } from 'react';
import { Table, RefreshCw, ExternalLink, FileSpreadsheet, History, Calendar, CheckCircle2 } from 'lucide-react';
import { SpreadsheetMetadata, AuthUser, MajlisHistoricalReport } from '../types';
import { EXACT_FORM_FIELDS } from '../data/majlisList';

interface RecentSubmissionsTableProps {
  spreadsheet: SpreadsheetMetadata;
  selectedMonth: string;
  headers: string[];
  rows: (string | number)[][];
  isLoading: boolean;
  onRefresh: () => void;
  currentUser?: AuthUser | null;
  historicalReports?: MajlisHistoricalReport[];
  onSelectMonth?: (month: string) => void;
}

export const RecentSubmissionsTable: React.FC<RecentSubmissionsTableProps> = ({
  spreadsheet,
  selectedMonth,
  headers,
  rows,
  isLoading,
  onRefresh,
  currentUser,
  historicalReports = [],
  onSelectMonth,
}) => {
  const isMajlisUser = currentUser?.role === 'majlis';
  const submittedHistory = historicalReports.filter((r) => r.hasData);

  // For majlis user, default to 'all-history' if no month is selected yet, or 'selected'
  const [viewMode, setViewMode] = useState<'selected' | 'all-history'>('selected');

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
      {/* Table Header Bar */}
      <div className="px-6 py-3.5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/60">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-gray-900">
              {viewMode === 'all-history' && isMajlisUser
                ? `পূর্ববর্তী সকল মাসের ডাটা রেকর্ড (${submittedHistory.length}টি মাস সংরক্ষিত)`
                : selectedMonth
                ? `"${selectedMonth}" এর বর্তমান ডাটা (${rows.length}টি এন্ট্রি)`
                : 'মাস নির্বাচন করুন (কোনো মাস নির্বাচিত নেই)'}
            </h3>
          </div>

          {/* Mode toggle for Majlis users */}
          {isMajlisUser && historicalReports.length > 0 && (
            <div className="inline-flex items-center p-0.5 bg-gray-200/80 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setViewMode('selected')}
                className={`px-2.5 py-1 rounded-md font-bold transition ${
                  viewMode === 'selected'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                নির্বাচিত মাস ({selectedMonth || '—'})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all-history')}
                className={`px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1 ${
                  viewMode === 'all-history'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <History className="w-3 h-3 text-emerald-600" />
                পূর্ববর্তী সকল মাস ({submittedHistory.length})
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading || (!selectedMonth && viewMode === 'selected')}
            className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-emerald-700 bg-white border border-gray-200 hover:border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed px-2.5 py-1 rounded-lg transition"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'রিফ্রেশ হচ্ছে...' : 'রিফ্রেশ'}
          </button>

          {currentUser?.role === 'admin' && spreadsheet.spreadsheetUrl && (
            <a
              href={spreadsheet.spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition"
            >
              গুগল শিটে খুলুন <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {viewMode === 'all-history' && isMajlisUser ? (
          /* All Previous Months Historical Table for this Majlis */
          submittedHistory.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <FileSpreadsheet className="w-8 h-8 mx-auto text-gray-300 mb-2" />
              <p className="text-xs font-semibold text-gray-600">
                গুগল শিটে আপনার মজলিসের কোনো পূর্ববর্তী ডাটা পাওয়া যায়নি
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                উপরে মাসের নাম নির্বাচন করে রিপোর্ট জমা দিলে তা এখানে প্রদর্শিত হবে
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50/60 border-b border-gray-200">
                  <th className="py-2.5 px-3.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider whitespace-nowrap sticky left-0 bg-emerald-50/90 z-10">
                    মাস (Month)
                  </th>
                  <th className="py-2.5 px-3.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider whitespace-nowrap">
                    স্ট্যাটাস
                  </th>
                  <th className="py-2.5 px-3.5 font-bold text-emerald-800 text-[11px] uppercase tracking-wider whitespace-nowrap">
                    তাজনীদ ভুক্ত সদস্য
                  </th>
                  <th className="py-2.5 px-3.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider whitespace-nowrap">
                    সফে আউয়াল
                  </th>
                  <th className="py-2.5 px-3.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider whitespace-nowrap">
                    সফে দওম
                  </th>
                  <th className="py-2.5 px-3.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider whitespace-nowrap">
                    মোট আমেলা
                  </th>
                  <th className="py-2.5 px-3.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider whitespace-nowrap">
                    মোট ওসীয়্যতকারী
                  </th>
                  <th className="py-2.5 px-3.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider whitespace-nowrap">
                    আমেলা সভা
                  </th>
                  <th className="py-2.5 px-3.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider whitespace-nowrap">
                    সাধারণ সভা
                  </th>
                  <th className="py-2.5 px-3.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider whitespace-nowrap">
                    ৫ ওয়াক্ত নামাযী
                  </th>
                  <th className="py-2.5 px-3.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider whitespace-nowrap">
                    বাজামাত নামাযী
                  </th>
                  <th className="py-2.5 px-3.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider whitespace-nowrap">
                    কুরআন পড়া জানেন
                  </th>
                  <th className="py-2.5 px-3.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider whitespace-nowrap text-right">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submittedHistory.map((rep) => (
                  <tr key={rep.monthTab} className="hover:bg-emerald-50/40 transition">
                    <td className="py-2.5 px-3.5 whitespace-nowrap font-bold text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-100">
                      <span className="font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded mr-1.5 text-[11px]">
                        {rep.monthTab}
                      </span>
                      {rep.monthLabel}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        সংরক্ষিত ({rep.filledCount})
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap font-bold text-emerald-700">
                      {rep.values['তাজনীদ ভুক্ত সদস্য'] ?? '—'}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-gray-800">
                      {rep.values['সফে আউয়াল'] ?? '—'}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-gray-800">
                      {rep.values['সফে দওম'] ?? '—'}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-gray-800">
                      {rep.values['মোট আমেলা সদস্য'] ?? '—'}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-gray-800">
                      {rep.values['মোট ওসীয়্যতকারী'] ?? '—'}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-gray-800">
                      {rep.values['আমেলা সভা'] ?? '—'}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-gray-800">
                      {rep.values['সাধারণ সভা'] ?? '—'}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-gray-800">
                      {rep.values['5 ওয়াক্ত নামাযীর সংখা'] ?? '—'}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-gray-800">
                      {rep.values['বাজামাত নামাযীর সংখ্যা'] ?? '—'}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-gray-800">
                      {rep.values['কতজন কুরআন পড়া জানেন'] ?? '—'}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-right">
                      {onSelectMonth && (
                        <button
                          type="button"
                          onClick={() => onSelectMonth(rep.monthTab)}
                          className="px-2.5 py-1 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold transition"
                        >
                          ফরমে সিলেক্ট করুন
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          /* Single Month Selected View */
          !selectedMonth ? (
            <div className="py-10 text-center text-gray-400">
              <FileSpreadsheet className="w-8 h-8 mx-auto text-gray-300 mb-2" />
              <p className="text-xs font-semibold text-gray-600">
                কোনো মাস নির্বাচন করা হয়নি
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {isMajlisUser && submittedHistory.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setViewMode('all-history')}
                    className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    পূর্ববর্তী সংরক্ষিত মাসসমূহের ডাটা দেখতে এখানে ক্লিক করুন ({submittedHistory.length}টি মাস)
                  </button>
                ) : (
                  'উপরের ড্রপডাউন থেকে মাসের নাম নির্বাচন করলে সেই মাসের ডাটা তালিকা এখানে দেখতে পারবেন'
                )}
              </p>
            </div>
          ) : isLoading ? (
            <div className="py-12 text-center text-xs text-gray-400">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-600 mb-2" />
              গুগল শিট থেকে তথ্য লোড হচ্ছে...
            </div>
          ) : rows.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <FileSpreadsheet className="w-8 h-8 mx-auto text-gray-300 mb-2" />
              <p className="text-xs font-semibold text-gray-600">
                এই মাসে (&quot;{selectedMonth}&quot;) এখনও কোনো ডাটা নেই
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {isMajlisUser && submittedHistory.length > 0 ? (
                  <span>
                    পূর্ববর্তী মাসের রেকর্ড দেখতে{' '}
                    <button
                      type="button"
                      onClick={() => setViewMode('all-history')}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      &quot;পূর্ববর্তী সকল মাস&quot;
                    </button>{' '}
                    ট্যাবে ক্লিক করুন।
                  </span>
                ) : (
                  'উপরের ফর্মটি পূরণ করে প্রথম এন্ট্রি জমা দিন'
                )}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-2.5 px-3.5 font-bold text-gray-500 text-[11px] uppercase tracking-wider w-12 text-center">
                    #
                  </th>
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="py-2.5 px-3.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-emerald-50/40 transition">
                    <td className="py-2.5 px-3.5 text-center text-gray-400 font-mono text-[11px]">
                      {rowIdx + 1}
                    </td>
                    {headers.map((_, colIdx) => (
                      <td
                        key={colIdx}
                        className="py-2.5 px-3.5 text-gray-800 whitespace-nowrap font-medium"
                      >
                        {row[colIdx] !== undefined && row[colIdx] !== null && String(row[colIdx]) !== ''
                          ? String(row[colIdx])
                          : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
};
