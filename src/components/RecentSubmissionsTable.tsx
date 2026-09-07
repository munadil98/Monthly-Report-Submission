import React from 'react';
import { Table, RefreshCw, ExternalLink, FileSpreadsheet, Eye } from 'lucide-react';
import { SpreadsheetMetadata } from '../types';

interface RecentSubmissionsTableProps {
  spreadsheet: SpreadsheetMetadata;
  selectedMonth: string;
  headers: string[];
  rows: (string | number)[][];
  isLoading: boolean;
  onRefresh: () => void;
}

export const RecentSubmissionsTable: React.FC<RecentSubmissionsTableProps> = ({
  spreadsheet,
  selectedMonth,
  headers,
  rows,
  isLoading,
  onRefresh,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
      {/* Table Header Bar */}
      <div className="px-6 py-3.5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-gray-50/60">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-gray-900">
            &quot;{selectedMonth}&quot; এর বর্তমান ডাটা ({rows.length}টি এন্ট্রি)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-emerald-700 bg-white border border-gray-200 hover:border-emerald-300 px-2.5 py-1 rounded-lg transition"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'রিফ্রেশ হচ্ছে...' : 'রিফ্রেশ'}
          </button>

          {spreadsheet.spreadsheetUrl && (
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
        {isLoading ? (
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
              উপরের ফর্মটি পূরণ করে প্রথম এন্ট্রি জমা দিন
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
        )}
      </div>
    </div>
  );
};
