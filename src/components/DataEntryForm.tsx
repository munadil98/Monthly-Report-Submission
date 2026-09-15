import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Building2,
  Send,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ExternalLink,
  ChevronDown,
  Layers,
  Search,
  Users,
  Megaphone,
  BookOpen,
  Tv,
  HeartHandshake,
  Dumbbell,
  GraduationCap,
  Baby,
  Calculator,
  Info,
  Lock,
} from 'lucide-react';
import { SpreadsheetMetadata, SubmissionPayload, AuthUser } from '../types';
import {
  DEFAULT_MAJLIS_LIST,
  EXACT_FORM_FIELDS,
  FORM_FIELD_CATEGORIES,
  getMonthDisplayLabel,
} from '../data/majlisList';
import { submitToAppsScript, fetchMajlisNamesFromSheet } from '../services/googleSheets';
import { findMatchingFormField, normalizeFieldName } from '../utils/formMapping';
import { MajlisSearchableSelect } from './MajlisSearchableSelect';

interface DataEntryFormProps {
  spreadsheet: SpreadsheetMetadata;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  headers: string[];
  existingRows: (string | number)[][];
  onSubmitRequest: (payload: SubmissionPayload) => void;
  onHeadersUpdated?: () => void;
  onOpenSettings?: () => void;
  currentUser: AuthUser;
  lastSubmittedSuccess: {
    sheetTitle: string;
    majlisName: string;
    timestamp: string;
    liveSynced?: boolean;
  } | null;
}

export const DataEntryForm: React.FC<DataEntryFormProps> = ({
  spreadsheet,
  selectedMonth,
  onMonthChange,
  headers,
  existingRows,
  onSubmitRequest,
  onHeadersUpdated,
  onOpenSettings,
  currentUser,
  lastSubmittedSuccess,
}) => {
  // Majlis list state from sheet 'Majlis-Names'
  const [sheetMajlisList, setSheetMajlisList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('majlis_sheet_names_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSyncingMajlis, setIsSyncingMajlis] = useState(false);
  const [isSheetSynced, setIsSheetSynced] = useState(false);

  // Custom user-added Majlis
  const [customMajlisList, setCustomMajlisList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('custom_majlis_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Selected values
  const [selectedMajlis, setSelectedMajlis] = useState<string>('');
  const [submissionDate, setSubmissionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Form field values for all 35 numeric fields + any extra sheet columns
  const [fieldValues, setFieldValues] = useState<Record<string, string | number>>({});
  const [isInitializingHeaders, setIsInitializingHeaders] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Majlis names from sheet 'Majlis-Names'
  const handleSyncMajlisFromSheet = async () => {
    setIsSyncingMajlis(true);
    try {
      const names = await fetchMajlisNamesFromSheet(
        spreadsheet.spreadsheetUrl || spreadsheet.spreadsheetId,
        spreadsheet.webAppUrl
      );
      if (names && names.length > 0) {
        setSheetMajlisList(names);
        setIsSheetSynced(true);
        try {
          localStorage.setItem('majlis_sheet_names_list', JSON.stringify(names));
        } catch (e) {
          console.error(e);
        }
      } else {
        alert("গুগল শিটের 'Majlis-Names' থেকে সরাসরি ডাটা পাওয়া যায়নি। অনুগ্রহ করে শিটের নাম ও পারমিশন নিশ্চিত করুন।");
      }
    } catch (err: any) {
      console.error('Error syncing Majlis list:', err);
    } finally {
      setIsSyncingMajlis(false);
    }
  };

  // Attempt automatic sync on load if not already loaded from sheet
  useEffect(() => {
    if (spreadsheet.spreadsheetUrl || spreadsheet.webAppUrl) {
      fetchMajlisNamesFromSheet(
        spreadsheet.spreadsheetUrl || spreadsheet.spreadsheetId,
        spreadsheet.webAppUrl
      ).then((names) => {
        if (names && names.length > 0) {
          setSheetMajlisList(names);
          setIsSheetSynced(true);
          try {
            localStorage.setItem('majlis_sheet_names_list', JSON.stringify(names));
          } catch (e) {
            console.error(e);
          }
        }
      });
    }
  }, [spreadsheet.spreadsheetUrl, spreadsheet.webAppUrl, spreadsheet.spreadsheetId]);

  // Combine sheet Majlis + default bilingual Majlis + custom + any found in existing rows
  const allMajlisOptions = useMemo(() => {
    const set = new Set<string>();
    // Prioritize sheet Majlis names if fetched
    sheetMajlisList.forEach((m) => set.add(m));
    // Include default standard list
    DEFAULT_MAJLIS_LIST.forEach((m) => set.add(m));
    // Include user custom items
    customMajlisList.forEach((m) => set.add(m));

    // Also inspect existing rows if there is a Majlis column
    const majlisColIndex = headers.findIndex((h) => /মজলিস|majlis/i.test(h));
    if (majlisColIndex !== -1) {
      existingRows.forEach((row) => {
        const val = row[majlisColIndex];
        if (val && typeof val === 'string' && val.trim().length > 0) {
          set.add(val.trim());
        }
      });
    }

    return Array.from(set);
  }, [sheetMajlisList, customMajlisList, headers, existingRows]);

  // Determine majlis options based on user role:
  // Admin -> has all majlis names as it is now
  // Majlis user -> has ONLY the logged-in majlis, no other majlis!
  const majlisOptions = useMemo(() => {
    if (currentUser.role === 'majlis' && currentUser.majlisFullName) {
      return [currentUser.majlisFullName];
    }
    return allMajlisOptions;
  }, [currentUser, allMajlisOptions]);

  // Set initial selected Majlis
  useEffect(() => {
    if (currentUser.role === 'majlis' && currentUser.majlisFullName) {
      setSelectedMajlis(currentUser.majlisFullName);
    } else if (!selectedMajlis && allMajlisOptions.length > 0) {
      setSelectedMajlis(allMajlisOptions[0]);
    }
  }, [currentUser, allMajlisOptions, selectedMajlis]);

  // Keep fieldValues['মজলিস নাম'] continuously synced with selectedMajlis
  useEffect(() => {
    if (selectedMajlis) {
      setFieldValues((prev) => {
        if (prev['মজলিস নাম'] === selectedMajlis) return prev;
        return {
          ...prev,
          'মজলিস নাম': selectedMajlis,
        };
      });
    }
  }, [selectedMajlis]);

  // Check which standard fields already match headers in this sheet tab
  const headerMatchInfo = useMemo(() => {
    if (headers.length === 0) {
      return { matchedCount: 0, hasHeaders: false, extraHeaders: [] };
    }
    const matched = new Set<string>();
    const extras: string[] = [];

    headers.forEach((h) => {
      const standard = findMatchingFormField(h);
      if (standard) {
        matched.add(standard);
      } else {
        const norm = normalizeFieldName(h);
        if (!norm.includes('তারিখ') && !norm.includes('date') && !norm.includes('মাস') && !norm.includes('month')) {
          extras.push(h);
        }
      }
    });

    return {
      matchedCount: matched.size,
      hasHeaders: true,
      extraHeaders: extras,
    };
  }, [headers]);

  const handleFieldChange = (key: string, value: string | number) => {
    setFieldValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 1-Click setup of all 36 headers on the active sheet tab
  const handleSetup36Headers = async () => {
    if (!selectedMonth) return;
    setIsInitializingHeaders(true);
    try {
      if (spreadsheet.webAppUrl) {
        await submitToAppsScript(spreadsheet.webAppUrl, {
          sheetTitle: selectedMonth,
          majlisName: '',
          date: '',
          headers: [...EXACT_FORM_FIELDS],
          rowValues: [],
        });
        alert(`"${selectedMonth}" এ ৩৬টি কলাম হেডার সফলভাবে প্রস্তুত হয়েছে!`);
      } else {
        alert(`৩৬টি ফিল্ডের কলাম হেডার সেট করা হয়েছে। আপনার গুগল শিটের অ্যাপস স্ক্রিপ্ট কানেক্ট করা থাকলে প্রথম সাবমিশনের সাথে হেডার স্বয়ংক্রিয়ভাবে তৈরি হয়ে যাবে।`);
      }
      if (onHeadersUpdated) {
        onHeadersUpdated();
      }
    } catch (err: any) {
      alert('হেডার তৈরি করতে ব্যর্থ হয়েছে: ' + (err.message || 'Error'));
    } finally {
      setIsInitializingHeaders(false);
    }
  };

  // Sample data filler for fast testing/demonstration
  const handleFillSampleData = () => {
    const sample: Record<string, string | number> = {
      'মজলিস নাম': selectedMajlis || allMajlisOptions[0] || 'মিরপুর (Mirpur)',
      'তাজনীদ ভুক্ত সদস্য': 48,
      'সফে আউয়াল': 28,
      'সফে দওম': 20,
      'মোট আমেলা সদস্য': 12,
      'মোট ওসীয়্যতকারী': 16,
      'আমেলা সভা': 1,
      'সাধারণ সভা': 1,
      'সাধারণ সভায় উপস্থিত': 38,
      'দায়ী ইলাল্লাহ্ সদস্য': 14,
      'তবলীগ সেমিনার': 1,
      'কতজন তবলীগ করেছে': 18,
      'কতজনকে তবলীগ করেছে': 45,
      'কতটি বই /প্রচার পত্র বিতরণ হয়েছে': 60,
      'বয়াতের সংখা': 2,
      'কতজন কুরআন পড়া জানেন': 46,
      'কোরআন ক্লাসে সদস্য': 22,
      '5 ওয়াক্ত নামাযীর সংখা': 35,
      'বাজামাত নামাযীর সংখ্যা': 26,
      'এমটিএ সংযোগ': 32,
      'অচল এমটিএ সংযোগ': 2,
      'নিয়মিত এমটিএ দর্শক': 30,
      'নিয়মিত খুদবা শ্রবণকারী': 34,
      'পুস্তকের ওপর পরীক্ষা': 15,
      'পুস্তকের ওপর সেমিনার': 1,
      'স্টাডি ফোরামে উপস্থিত': 24,
      'নওমোবাইন সংখ্যা': 3,
      'বাজেট ভুক্ত নও-মোবাঈন': 3,
      'নও-মোবাইন সেমিনারে উঃ': 3,
      'অসুস্থ আনসার সদস্য': 4,
      'বয়ঃবৃদ্ধ আনসার সদস্য': 6,
      'খাদ্য বিতরণ': 15,
      'আলনাসের এর সদস্য সংখ্যা': 48,
      'তাহরীকে জাদীদ সদস্য': 42,
      'ওয়াকফে জাদীদ সদস্য': 45,
      'নিয়মিত ব্যায়াম করেন': 25,
    };
    setFieldValues(sample);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMonth) {
      alert('দয়া করে মাসের নাম নির্বাচন করুন');
      return;
    }

    if (!selectedMajlis) {
      alert('দয়া করে মজলিস নাম নির্বাচন করুন');
      return;
    }

    // Build the ordered row array according to sheet headers or fallback to 36 exact fields
    let orderedRowValues: (string | number)[] = [];

    if (headers.length > 0) {
      orderedRowValues = headers.map((colName) => {
        const normCol = normalizeFieldName(colName);
        if (normCol.includes('মজলিস') || normCol.includes('majlis')) {
          return selectedMajlis;
        }
        if (normCol.includes('তারিখ') || normCol.includes('date')) {
          return submissionDate;
        }
        if (normCol.includes('মাস') || normCol.includes('month')) {
          return selectedMonth;
        }

        // Try exact/tolerant match with standard form fields
        const matchedField = findMatchingFormField(colName);
        if (matchedField && fieldValues[matchedField] !== undefined) {
          return fieldValues[matchedField];
        }

        // Check direct key in fieldValues
        if (fieldValues[colName] !== undefined) {
          return fieldValues[colName];
        }

        return '';
      });
    } else {
      // Direct 36 column structure: EXACT_FORM_FIELDS
      orderedRowValues = EXACT_FORM_FIELDS.map((fieldName) => {
        if (fieldName === 'মজলিস নাম') {
          return selectedMajlis;
        }
        return fieldValues[fieldName] ?? '';
      });
    }

    // Prepare clean customValues representation for modal
    const customValuesRecord: Record<string, string | number> = {};
    EXACT_FORM_FIELDS.forEach((f) => {
      if (f !== 'মজলিস নাম') {
        const val = fieldValues[f];
        if (val !== undefined && val !== '') {
          customValuesRecord[f] = val;
        }
      }
    });
    // Include extra headers if any
    headerMatchInfo.extraHeaders.forEach((extra) => {
      if (fieldValues[extra] !== undefined) {
        customValuesRecord[extra] = fieldValues[extra];
      }
    });

    const payload: SubmissionPayload = {
      spreadsheetId: spreadsheet.spreadsheetId,
      sheetTitle: selectedMonth,
      majlisName: selectedMajlis,
      date: submissionDate,
      customValues: customValuesRecord,
      orderedRowValues,
    };

    onSubmitRequest(payload);
  };

  const handleResetForm = () => {
    setFieldValues(selectedMajlis ? { 'মজলিস নাম': selectedMajlis } : {});
    setSubmissionDate(new Date().toISOString().split('T')[0]);
  };

  // Category Icon Resolver
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'tajnid':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'meetings':
        return <Building2 className="w-4 h-4 text-emerald-600" />;
      case 'tabligh':
        return <Megaphone className="w-4 h-4 text-amber-600" />;
      case 'quran_salat':
        return <BookOpen className="w-4 h-4 text-teal-600" />;
      case 'mta_khutba':
        return <Tv className="w-4 h-4 text-indigo-600" />;
      case 'talim':
        return <GraduationCap className="w-4 h-4 text-purple-600" />;
      case 'nau_mubai':
        return <Baby className="w-4 h-4 text-rose-600" />;
      case 'khidmat':
        return <HeartHandshake className="w-4 h-4 text-cyan-600" />;
      case 'tahrik_health':
        return <Dumbbell className="w-4 h-4 text-orange-600" />;
      default:
        return <Layers className="w-4 h-4 text-gray-600" />;
    }
  };

  // Filter categories and fields
  const filteredCategories = useMemo(() => {
    return FORM_FIELD_CATEGORIES.map((cat) => {
      const matchingFields = cat.fields.filter((field) => {
        if (!searchQuery.trim()) return true;
        return field.toLowerCase().includes(searchQuery.toLowerCase());
      });

      return {
        ...cat,
        fields: matchingFields,
      };
    }).filter((cat) => {
      if (selectedCategory !== 'all' && cat.id !== selectedCategory) {
        return false;
      }
      return cat.fields.length > 0;
    });
  }, [selectedCategory, searchQuery]);

  // Count filled fields
  const filledFieldsCount = useMemo(() => {
    let count = 0;
    EXACT_FORM_FIELDS.forEach((f) => {
      if (f === 'মজলিস নাম') {
        if (selectedMajlis) count++;
      } else if (fieldValues[f] !== undefined && fieldValues[f] !== '') {
        count++;
      }
    });
    return count;
  }, [fieldValues, selectedMajlis]);

  // Math check: Saf-e-Awwal + Saf-e-Daum
  const safTotal = useMemo(() => {
    const s1 = Number(fieldValues['সফে আউয়াল'] || 0);
    const s2 = Number(fieldValues['সফে দওম'] || 0);
    return s1 + s2;
  }, [fieldValues]);

  const tajnidCount = Number(fieldValues['তাজনীদ ভুক্ত সদস্য'] || 0);

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white px-6 py-4.5 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold flex items-center gap-2 tracking-tight">
              <Building2 className="w-5 h-5 text-emerald-200" />
              মজলিস আনসারুল্লাহ্ মাসিক প্রতিবেদন এন্ট্রি
            </h2>
            <span className="bg-emerald-500/30 text-emerald-100 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
              ৩৬টি ফিল্ড
            </span>
          </div>
          <p className="text-xs text-emerald-100 mt-1">
            মাসের নাম ও মজলিস নির্বাচন করে সকল প্রতিবেদনের তথ্য নির্ভুলভাবে গুগল শিটে জমা দিন
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="bg-white/15 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2">
            <span className="text-emerald-200">পূরণ:</span>
            <span className="font-bold text-white font-mono">
              {filledFieldsCount} / {EXACT_FORM_FIELDS.length}
            </span>
          </div>
          <button
            type="button"
            onClick={handleFillSampleData}
            title="পরীক্ষা করার জন্য নমুনা ডাটা বসান"
            className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            নমুনা ডাটা
          </button>
        </div>
      </div>

      {/* Success Notification Banner if previously submitted */}
      {lastSubmittedSuccess && (
        <div
          className={`mx-6 mt-5 p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            lastSubmittedSuccess.liveSynced
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2
              className={`w-4 h-4 flex-shrink-0 ${
                lastSubmittedSuccess.liveSynced ? 'text-emerald-600' : 'text-amber-600'
              }`}
            />
            <div>
              <span className="font-bold">
                {lastSubmittedSuccess.liveSynced
                  ? 'গুগল শিটে লাইভ আপডেট সম্পন্ন হয়েছে!'
                  : 'সফলভাবে সংরক্ষিত হয়েছে (লোকাল স্টোরেজ)'}
              </span>{' '}
              <span className={lastSubmittedSuccess.liveSynced ? 'text-emerald-800' : 'text-amber-900'}>
                &quot;{lastSubmittedSuccess.majlisName}&quot; এর তথ্য &quot;{lastSubmittedSuccess.sheetTitle}&quot; এর জন্য নিবন্ধিত হয়েছে ({lastSubmittedSuccess.timestamp})।
                {!lastSubmittedSuccess.liveSynced &&
                  ' (শিটে লাইভ পাঠাতে শিট সেটিংস থেকে Apps Script URL দিন)'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!lastSubmittedSuccess.liveSynced && onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold transition whitespace-nowrap"
              >
                URL সংযোগ করুন
              </button>
            )}
            {spreadsheet.spreadsheetUrl && (
              <a
                href={spreadsheet.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 underline whitespace-nowrap"
              >
                শিটে দেখুন <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Header status check banner */}
      {headers.length === 0 ? (
        <div className="mx-6 mt-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">&quot;{selectedMonth}&quot; এ এখনও কোনো কলাম হেডার নেই</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                একটি ক্লিকে এই মাসে নির্ধারিত ৩৬টি কলাম হেডার স্বয়ংক্রিয়ভাবে সেট করে নিন।
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSetup36Headers}
            disabled={isInitializingHeaders}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg text-xs font-bold transition shadow-2xs whitespace-nowrap self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isInitializingHeaders ? 'হেডার যুক্ত হচ্ছে...' : '৩৬টি হেডার তৈরি করুন'}
          </button>
        </div>
      ) : headerMatchInfo.matchedCount < 30 ? (
        <div className="mx-6 mt-4 p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              বর্তমানে {headers.length}টি কলাম রয়েছে (যার মধ্যে {headerMatchInfo.matchedCount}টি ফিল্ডের সাথে মিলেছে)।
            </span>
          </div>
          <button
            type="button"
            onClick={handleSetup36Headers}
            disabled={isInitializingHeaders}
            className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline whitespace-nowrap"
          >
            স্ট্যান্ডার্ড ৩৬টি হেডার সেট করুন
          </button>
        </div>
      ) : null}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Core Dropdowns: Month (Sheet Names) and Majlis Name */}
        <div className="p-5 bg-gray-50/90 rounded-2xl border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Month Name Dropdown (Options same as sheet names) */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  মাসের নাম
                  <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  মাস নির্বাচন
                </span>
              </label>

              <div className="relative">
                <select
                  id="month-dropdown"
                  value={selectedMonth}
                  onChange={(e) => onMonthChange(e.target.value)}
                  required
                  className="w-full appearance-none px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs pr-9 cursor-pointer"
                >
                  {spreadsheet.sheets.length === 0 && (
                    <option value="">কোনো মাস পাওয়া যায়নি</option>
                  )}
                  {spreadsheet.sheets.map((sheet) => (
                    <option key={sheet.sheetId} value={sheet.title}>
                      {getMonthDisplayLabel(sheet.title)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
              </div>

              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span className="text-gray-500">
                  নির্বাচিত মাসের তথ্য গুগল শিটে আপডেট হবে।
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-mono">
                  ট্যাব: {selectedMonth}
                </span>
              </div>
            </div>

            {/* 2. Majlis Name Dropdown (মজলিস নাম - Field #1) */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  {currentUser.role === 'majlis' ? (
                    <Lock className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <Building2 className="w-4 h-4 text-emerald-600" />
                  )}
                  ১. মজলিস নাম (Majlis Name)
                  <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {currentUser.role === 'majlis'
                    ? 'শুধুমাত্র আপনার মজলিস'
                    : `${majlisOptions.length}টি মজলিস`}
                </span>
              </label>

              <MajlisSearchableSelect
                options={majlisOptions}
                value={selectedMajlis}
                onChange={(val) => {
                  if (currentUser.role !== 'majlis') {
                    setSelectedMajlis(val);
                  }
                }}
                onSyncFromSheet={currentUser.role === 'admin' ? handleSyncMajlisFromSheet : undefined}
                isSyncing={isSyncingMajlis}
                isSheetSynced={isSheetSynced}
                isLocked={currentUser.role === 'majlis'}
                lockedNotice="লগইনকৃত মজলিস (নির্ধারিত)"
              />

              <p className="text-[11px] text-gray-500 mt-1">
                {currentUser.role === 'majlis'
                  ? 'আপনার অ্যাকাউন্টের জন্য এই মজলিসটি নির্ধারিত ও অপরিবর্তনীয়।'
                  : 'বাংলা বা ইংরেজি যেকোনো নামে সার্চ করে নির্বাচন করুন (যেমন: মিরপুর বা Mirpur)।'}
              </p>
            </div>
          </div>

          {/* Date row (helper) */}
          <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">তথ্য জমাদানের তারিখ:</span>
              <input
                type="date"
                value={submissionDate}
                onChange={(e) => setSubmissionDate(e.target.value)}
                className="px-2.5 py-1 text-xs border border-gray-300 rounded-lg bg-white text-gray-800 font-mono"
              />
            </div>

            {tajnidCount > 0 && safTotal > 0 && (
              <div className="text-[11px] flex items-center gap-2">
                <span className="text-gray-500">তাজনীদ চেক:</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-md ${
                    tajnidCount === safTotal
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  সফে আউয়াল + সফে দওম = {safTotal} / মোট তাজনীদ: {tajnidCount}
                  {tajnidCount === safTotal ? ' (মিল রয়েছে)' : ' (পার্থক্য আছে)'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Categories Bar & Search Filter */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                সকল ফিল্ড (All 36)
              </button>
              {FORM_FIELD_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search within 36 fields */}
            <div className="relative w-full sm:w-56 flex-shrink-0">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="ফিল্ডের নাম খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Categorized Fields Rendering */}
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden"
            >
              {/* Category Header */}
              <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category.id)}
                  <h4 className="text-xs font-bold text-gray-900">{category.name}</h4>
                  {category.englishTitle && (
                    <span className="text-[11px] text-gray-400 font-normal">
                      ({category.englishTitle})
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-gray-500">
                  {category.fields.length}টি ফিল্ড
                </span>
              </div>

              {/* Category Fields Grid */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {category.fields.map((fieldName) => {
                  // Special handling for 'মজলিস নাম': populated directly from 1. Majlis dropdown
                  if (fieldName === 'মজলিস নাম') {
                    const currentMajlis =
                      selectedMajlis ||
                      (typeof fieldValues['মজলিস নাম'] === 'string'
                        ? fieldValues['মজলিস নাম']
                        : '');

                    return (
                      <div
                        key={fieldName}
                        className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/30 transition flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-gray-900 leading-snug flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                            {fieldName}
                          </label>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                            ১. মজলিস নাম থেকে যুক্ত
                          </span>
                        </div>

                        <div className="mt-auto pt-1">
                          <div
                            className="w-full px-3 py-2 text-xs font-bold bg-white border border-emerald-300 rounded-lg text-emerald-950 flex items-center justify-between gap-1.5 shadow-2xs"
                            title="১. মজলিস নাম (Majlis Name)* ড্রপডাউন থেকে স্বয়ংক্রিয়ভাবে সংগৃহীত"
                          >
                            <span className="truncate">
                              {currentMajlis || 'মজলিস নির্বাচন করুন'}
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1">
                            ১. মজলিস নাম ড্রপডাউনে নির্বাচিত তথ্য এখানে স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে।
                          </p>
                        </div>
                      </div>
                    );
                  }

                  const val = fieldValues[fieldName] ?? '';
                  const hasValue = val !== '' && val !== undefined;

                  return (
                    <div
                      key={fieldName}
                      className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                        hasValue
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <label className="block text-xs font-semibold text-gray-800 mb-2 leading-snug">
                        {fieldName}
                      </label>

                      <div className="flex items-center gap-1.5 mt-auto">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="০"
                          value={val}
                          onChange={(e) => {
                            const v = e.target.value;
                            handleFieldChange(fieldName, v === '' ? '' : Number(v));
                          }}
                          className="w-full px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-hidden bg-white text-right font-mono"
                        />
                        {/* Quick stepper buttons */}
                        <button
                          type="button"
                          onClick={() => {
                            const current = Number(fieldValues[fieldName] || 0);
                            handleFieldChange(fieldName, current + 1);
                          }}
                          className="px-2 py-1 bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-800 font-bold text-xs rounded-lg transition"
                          title="+১ যোগ করুন"
                        >
                          +১
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Any extra columns existing in current Google Sheet */}
          {headerMatchInfo.extraHeaders.length > 0 && (
            <div className="bg-amber-50/40 rounded-xl border border-amber-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-amber-100/50 border-b border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-700" />
                  <h4 className="text-xs font-bold text-amber-900">
                    শিটের অতিরিক্ত কলামসমূহ ({headerMatchInfo.extraHeaders.length}টি)
                  </h4>
                </div>
                <span className="text-[11px] text-amber-700">
                  আপনার বর্তমান শিটের বাড়তি কলাম
                </span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {headerMatchInfo.extraHeaders.map((extraCol) => (
                  <div key={extraCol} className="p-3 bg-white rounded-xl border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                      {extraCol}
                    </label>
                    <input
                      type="text"
                      placeholder={`${extraCol} লিখুন...`}
                      value={fieldValues[extraCol] ?? ''}
                      onChange={(e) => handleFieldChange(extraCol, e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              ফরম রিসেট (Clear)
            </button>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            গুগল শিটে জমা দিন ({filledFieldsCount}টি তথ্য)
          </button>
        </div>
      </form>
    </div>
  );
};
