import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Link as LinkIcon,
  Copy,
  Check,
  X,
  ExternalLink,
  Code2,
  Info,
  Calendar,
  Sparkles,
  Send,
  Loader2,
} from 'lucide-react';
import { SpreadsheetMetadata } from '../types';
import {
  DEFAULT_MONTH_NAMES_BN,
  DEFAULT_MONTH_NAMES_EN,
  DEFAULT_SPREADSHEET_ID,
  DEFAULT_SPREADSHEET_GID,
  EXACT_SHEET_MONTH_TABS,
} from '../data/majlisList';
import {
  extractSpreadsheetId,
  GOOGLE_APPS_SCRIPT_CODE_TEMPLATE,
  fetchTabsFromAppsScript,
  submitToAppsScript,
} from '../services/googleSheets';

interface SpreadsheetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpreadsheet: SpreadsheetMetadata | null;
  onSaveSettings: (settings: {
    spreadsheetId: string;
    title: string;
    webAppUrl: string;
    sheetTabs: string[];
  }) => void;
}

export const SpreadsheetSelector: React.FC<SpreadsheetSelectorProps> = ({
  isOpen,
  onClose,
  currentSpreadsheet,
  onSaveSettings,
}) => {
  const [webAppUrl, setWebAppUrl] = useState(currentSpreadsheet?.webAppUrl || '');
  const [sheetUrlOrId, setSheetUrlOrId] = useState(
    currentSpreadsheet?.spreadsheetUrl || currentSpreadsheet?.spreadsheetId || DEFAULT_SPREADSHEET_ID
  );
  const [sheetTitle, setSheetTitle] = useState(
    currentSpreadsheet?.title || 'মজলিস মাসিক প্রতিবেদন (1z-7FiFuqhJeA2ClrdOyNW-CoW7m5DYe8freXYO9RSes)'
  );
  const [activeMonthFormat, setActiveMonthFormat] = useState<'oct26' | 'bn' | 'en'>('oct26');
  const [customTabsInput, setCustomTabsInput] = useState(() => {
    if (currentSpreadsheet?.sheets && currentSpreadsheet.sheets.length > 0) {
      return currentSpreadsheet.sheets.map((s) => s.title).join(', ');
    }
    return EXACT_SHEET_MONTH_TABS.map((m) => m.tabName).join(', ');
  });

  const [copiedCode, setCopiedCode] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(true);
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [isSendingTestRow, setIsSendingTestRow] = useState(false);
  const [testMessage, setTestMessage] = useState<{ text: string; isSuccess: boolean } | null>(null);

  if (!isOpen) return null;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE_TEMPLATE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSelectMonthPreset = (format: 'oct26' | 'bn' | 'en') => {
    setActiveMonthFormat(format);
    if (format === 'oct26') {
      setCustomTabsInput(EXACT_SHEET_MONTH_TABS.map((m) => m.tabName).join(', '));
    } else if (format === 'bn') {
      setCustomTabsInput(DEFAULT_MONTH_NAMES_BN.join(', '));
    } else {
      setCustomTabsInput(DEFAULT_MONTH_NAMES_EN.join(', '));
    }
  };

  const handleTestWebAppUrl = async () => {
    if (!webAppUrl.trim()) {
      setTestMessage({ text: 'অনুগ্রহ করে একটি Web App URL দিন', isSuccess: false });
      return;
    }
    setIsTestingUrl(true);
    setTestMessage(null);
    try {
      const data = await fetchTabsFromAppsScript(webAppUrl);
      if (data && data.sheets && data.sheets.length > 0) {
        setCustomTabsInput(data.sheets.join(', '));
        if (data.title) setSheetTitle(data.title);
        setTestMessage({
          text: `সফলভাবে সংযোগ হয়েছে! (${data.sheets.length}টি শিট ট্যাব পাওয়া গেছে: ${data.sheets.slice(0, 5).join(', ')}...)`,
          isSuccess: true,
        });
      } else {
        setTestMessage({
          text: 'URL সক্রিয় রয়েছে এবং ডাটা পোস্ট করার জন্য প্রস্তুত!',
          isSuccess: true,
        });
      }
    } catch {
      setTestMessage({
        text: 'URL সরাসরি যাচাই করা সম্ভব হয়নি, তবে টেস্ট সাবমিশন বাটন দিয়ে পরীক্ষা করতে পারেন।',
        isSuccess: false,
      });
    } finally {
      setIsTestingUrl(false);
    }
  };

  const handleTestSubmissionToOct26 = async () => {
    if (!webAppUrl.trim()) {
      setTestMessage({ text: 'অনুগ্রহ করে প্রথমে Web App URL দিন', isSuccess: false });
      return;
    }
    setIsSendingTestRow(true);
    setTestMessage(null);
    try {
      const res = await submitToAppsScript(webAppUrl, {
        sheetTitle: 'Oct26',
        majlisName: 'মিরপুর (Mirpur)',
        date: new Date().toISOString().split('T')[0],
        headers: ['মজলিস নাম', 'তাজনীদ ভুক্ত সদস্য'],
        rowValues: ['মিরপুর (Mirpur)', 50],
        fieldValues: {
          'মজলিস নাম': 'মিরপুর (Mirpur)',
          'তাজনীদ ভুক্ত সদস্য': 50,
        },
      });

      if (res.success) {
        setTestMessage({
          text: 'অভিনন্দন! Apps Script এ সফলভাবে রিকোয়েস্ট পাঠানো হয়েছে। আপনার শিটের "Oct26" ট্যাবে Mirpur (Row 78) চেক করুন।',
          isSuccess: true,
        });
      } else {
        setTestMessage({
          text: 'পাঠাতে সমস্যা হয়েছে: ' + (res.error || 'অজানা ত্রুটি'),
          isSuccess: false,
        });
      }
    } catch (e: any) {
      setTestMessage({
        text: 'ত্রুটি: ' + (e.message || 'সাবমিট ব্যর্থ হয়েছে'),
        isSuccess: false,
      });
    } finally {
      setIsSendingTestRow(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedTabs = customTabsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const finalTabs = parsedTabs.length > 0 ? parsedTabs : EXACT_SHEET_MONTH_TABS.map((m) => m.tabName);

    const cleanId = sheetUrlOrId.trim()
      ? extractSpreadsheetId(sheetUrlOrId)
      : DEFAULT_SPREADSHEET_ID;

    onSaveSettings({
      spreadsheetId: cleanId,
      title: sheetTitle.trim() || 'মজলিস মাসিক প্রতিবেদন (1z-7FiFuqhJeA2ClrdOyNW-CoW7m5DYe8freXYO9RSes)',
      webAppUrl: webAppUrl.trim(),
      sheetTabs: finalTabs,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">গুগল শিট কানেকশন ও সেটিংস</h3>
              <p className="text-[11px] text-emerald-100">
                লগইন ছাড়াই সরাসরি গুগল শিটে ডাটা এন্ট্রি পাঠানোর কনফিগারেশন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Option 1: Live Apps Script Web App Integration */}
          <div className="p-4.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  পদ্ধতি ১: গুগল অ্যাপস স্ক্রিপ্ট (সরাসরি শিটে জমা)
                </span>
                <h4 className="text-xs font-bold text-gray-900 mt-1">
                  গুগল অ্যাপস স্ক্রিপ্ট Web App URL
                </h4>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  এর মাধ্যমে ফর্ম জমা দিলে সরাসরি আপনার গুগল শিটে নির্দিষ্ট মাসের জন্য নতুন সারি (Row) হিসেবে ডাটা জমা হবে।
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCodeModal(!showCodeModal)}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-100/60 border border-emerald-300 px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                {showCodeModal ? 'কোড লুকান' : 'স্ক্রিপ্ট কোড দেখুন'}
              </button>
            </div>

            {/* Apps Script Guide & Code */}
            {showCodeModal && (
              <div className="p-3.5 bg-white rounded-xl border border-emerald-200 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">
                    সহজ ৩ ধাপে শিট কানেক্ট করুন (১ মিনিট সময়):
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3" /> কপি হয়েছে!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> কোড কপি করুন
                      </>
                    )}
                  </button>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-600 leading-relaxed">
                  <li>আপনার গুগল শিট খুলে মেনু থেকে <strong>Extensions &gt; Apps Script</strong>-এ যান।</li>
                  <li>সেখানকার কোড মুছে নিচের স্ক্রিপ্ট কোডটি পেস্ট করুন।</li>
                  <li>উপরে <strong>Deploy &gt; New deployment &gt; Web app</strong> নির্বাচন করুন, 'Who has access' এ <strong>Anyone</strong> সিলেক্ট করে Deploy দিন এবং পাওয়া Web App URL-টি নিচে পেস্ট করুন।</li>
                </ol>
                <pre className="p-2.5 bg-gray-900 text-emerald-400 rounded-lg text-[10px] font-mono overflow-x-auto max-h-36">
                  {GOOGLE_APPS_SCRIPT_CODE_TEMPLATE}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={webAppUrl}
                onChange={(e) => setWebAppUrl(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs border border-emerald-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleTestWebAppUrl}
                  disabled={isTestingUrl || isSendingTestRow || !webAppUrl.trim()}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 text-white text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap"
                >
                  {isTestingUrl ? 'চেক হচ্ছে...' : 'কানেকশন টেস্ট'}
                </button>
                <button
                  type="button"
                  onClick={handleTestSubmissionToOct26}
                  disabled={isTestingUrl || isSendingTestRow || !webAppUrl.trim()}
                  className="px-3 py-2 bg-teal-700 hover:bg-teal-800 disabled:bg-gray-200 text-white text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1"
                  title="Oct26 শিটে টেস্ট ডাটা পাঠিয়ে যাচাই করুন"
                >
                  {isSendingTestRow ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" /> পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3" /> টেস্ট সাবমিট (Oct26)
                    </>
                  )}
                </button>
              </div>
            </div>

            {testMessage && (
              <p
                className={`text-xs font-medium p-2 rounded-lg ${
                  testMessage.isSuccess ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                }`}
              >
                {testMessage.text}
              </p>
            )}
          </div>

          {/* Option 2: Direct Google Sheet URL (for viewing & reference) */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5">
            <label className="block text-xs font-bold text-gray-800">
              গুগল শিট লিংক (Google Sheet URL / ID)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://docs.google.com/spreadsheets/d/1z-7FiFuqhJeA2ClrdOyNW-CoW7m5DYe8freXYO9RSes/edit"
                value={sheetUrlOrId}
                onChange={(e) => setSheetUrlOrId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-gray-500">
              আপনার শিট ID: <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-800 font-mono font-bold">1z-7FiFuqhJeA2ClrdOyNW-CoW7m5DYe8freXYO9RSes</code> (gid: 917173807)
            </p>
          </div>

          {/* Month Tabs Config */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                মাসের নাম ড্রপডাউন (Months)
              </label>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectMonthPreset('oct26')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                    activeMonthFormat === 'oct26'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Oct26, Nov26, Dec26... আসল শিট ফরম্যাট"
                >
                  Oct26-Sep26 (আসল শিট)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMonthPreset('bn')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                    activeMonthFormat === 'bn'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  বাংলা (১২ মাস)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMonthPreset('en')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                    activeMonthFormat === 'en'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <textarea
              rows={2}
              value={customTabsInput}
              onChange={(e) => setCustomTabsInput(e.target.value)}
              placeholder="কমা দিয়ে পৃথক করে মাসের নাম লিখুন (যেমন: জানুয়ারি, ফেব্রুয়ারি...)"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
            />
            <p className="text-[11px] text-gray-500">
              এগুলো ড্রপডাউনে প্রদর্শিত হবে। কমা দিয়ে লিখে আপনি শিটের নামের সাথে হুবহু মিলিয়ে নিতে পারেন।
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              সেটিংস সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
