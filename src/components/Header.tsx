import React from 'react';
import {
  FileSpreadsheet,
  ExternalLink,
  Settings,
  Download,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { SpreadsheetMetadata } from '../types';

interface HeaderProps {
  spreadsheet: SpreadsheetMetadata | null;
  onOpenSpreadsheetSettings: () => void;
  onExportCSV: () => void;
  submissionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  spreadsheet,
  onOpenSpreadsheetSettings,
  onExportCSV,
  submissionsCount,
}) => {
  const isLiveConnected = Boolean(spreadsheet?.webAppUrl);

  return (
    <header className="bg-white border-b border-emerald-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand / Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              মজলিস ডাটা এন্ট্রি ফরম
            </h1>
            <p className="text-xs text-emerald-800 font-medium">
              Majlis Monthly Google Sheet Submission
            </p>
          </div>
        </div>

        {/* Status & Actions (No Login Required) */}
        <div className="flex items-center flex-wrap justify-end gap-2.5 w-full sm:w-auto">
          {/* Connection Pill */}
          <button
            type="button"
            onClick={onOpenSpreadsheetSettings}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              isLiveConnected
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
            }`}
            title={isLiveConnected ? 'গুগল শিট লাইভ সংযুক্ত' : 'গুগল শিটে সরাসরি লেখার জন্য Apps Script URL সেট করুন'}
          >
            {isLiveConnected ? (
              <>
                <Globe className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span className="font-bold">লাইভ গুগল শিট সিঙ্ক</span>
              </>
            ) : (
              <>
                <Settings className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-bold">Apps Script সংযোগ প্রয়োজন</span>
              </>
            )}
            <span className={isLiveConnected ? 'text-emerald-400' : 'text-amber-400'}>•</span>
            <span className={isLiveConnected ? 'text-emerald-800' : 'text-amber-800'}>
              {spreadsheet?.sheets?.length || 12}টি মাস
            </span>
          </button>

          {/* Open Google Sheet if URL exists */}
          {spreadsheet?.spreadsheetUrl && (
            <a
              href={spreadsheet.spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg transition"
              title="গুগল শিটে খুলুন"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>শিট দেখুন</span>
            </a>
          )}

          {/* Export CSV Button */}
          {submissionsCount > 0 && (
            <button
              type="button"
              onClick={onExportCSV}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-emerald-800 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
              title="সংগৃহীত সকল ডাটা CSV ফাইল হিসেবে ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>CSV ডাউনলোড ({submissionsCount})</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSpreadsheetSettings}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>শিট সেটিংস</span>
          </button>
        </div>
      </div>
    </header>
  );
};
