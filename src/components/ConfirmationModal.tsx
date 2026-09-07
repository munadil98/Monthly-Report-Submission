import React from 'react';
import {
  AlertCircle,
  FileSpreadsheet,
  Check,
  X,
  Loader2,
  AlertTriangle,
  Globe,
  Settings,
} from 'lucide-react';
import { SubmissionPayload } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  payload: SubmissionPayload | null;
  spreadsheetTitle: string;
  webAppUrl?: string;
  onOpenSettings?: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  isSubmitting,
  payload,
  spreadsheetTitle,
  webAppUrl,
  onOpenSettings,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !payload) return null;

  const isLiveConnected = Boolean(webAppUrl?.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-4">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                ডাটা জমা দেওয়ার নিশ্চিতকরণ
              </h3>
              <p className="text-[11px] text-emerald-800">
                Confirm Monthly Report Submission
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Live Sync Status Notice */}
          {isLiveConnected ? (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
              <Globe className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">লাইভ গুগল শিট সংযোগ সক্রিয়:</p>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  তথ্য সরাসরি গুগল শিটের <span className="font-bold text-emerald-950">&quot;{payload.sheetTitle}&quot;</span> ট্যাবে <span className="font-bold text-emerald-950">&quot;{payload.majlisName}&quot;</span> এর নির্ধারিত সারিতে আপডেট করা হবে।
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex flex-col gap-2 text-xs text-amber-950">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Google Apps Script Web App সংযোগ নেই</p>
                  <p className="text-[11px] text-amber-900 mt-0.5">
                    বর্তমানে সাবমিট করলে তথ্য কেবল এই ডিভাইসের লোকাল স্টোরেজে সংরক্ষিত হবে। আপনার গুগল শিটে (<span className="font-bold">{payload.sheetTitle}</span>) সরাসরি ডাটা লিখতে Apps Script URL প্রয়োজন।
                  </p>
                </div>
              </div>

              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => {
                    onCancel();
                    onOpenSettings();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-2xs mt-1"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Apps Script Web App URL সংযোগ করুন
                </button>
              )}
            </div>
          )}

          {/* Destination Breakdown */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">স্প্রেডশিট:</span>
              <span className="font-semibold text-gray-900 truncate max-w-[240px]">
                {spreadsheetTitle}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">টার্গেট শিট ট্যাব:</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                {payload.sheetTitle}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-2">
              <span className="text-gray-500">মজলিস নাম:</span>
              <span className="font-bold text-gray-900">{payload.majlisName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">তারিখ:</span>
              <span className="font-semibold text-gray-800">{payload.date}</span>
            </div>
          </div>

          {/* Submitted Values Table */}
          <div>
            <span className="block text-xs font-bold text-gray-700 mb-2">
              জমা হওয়া ফিল্ডের বিবরণ ({Object.keys(payload.customValues).length + 2}টি তথ্য):
            </span>
            <div className="max-h-44 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white">
              {Object.entries(payload.customValues).map(([key, val]) => (
                <div key={key} className="px-3 py-2 flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium truncate max-w-[180px]">{key}</span>
                  <span className="font-semibold text-gray-900 text-right truncate max-w-[200px]">
                    {String(val) || '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 bg-gray-100 rounded-xl transition"
          >
            বাতিল (Cancel)
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> শিটে জমা হচ্ছে...
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" /> হ্যাঁ, নিশ্চিত করে জমা দিন
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
