import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FileSpreadsheet,
  AlertCircle,
  FolderOpen,
  Calendar,
  Building2,
  ExternalLink,
  CheckCircle2,
  Download,
  Settings,
} from 'lucide-react';
import { Header } from './components/Header';
import { SpreadsheetSelector } from './components/SpreadsheetSelector';
import { DataEntryForm } from './components/DataEntryForm';
import { ConfirmationModal } from './components/ConfirmationModal';
import { RecentSubmissionsTable } from './components/RecentSubmissionsTable';
import { LoginForm } from './components/LoginForm';
import {
  getDefaultSpreadsheetMetadata,
  submitToAppsScript,
  exportSubmissionsToCSV,
  fetchTabsFromAppsScript,
  fetchMajlisUsersFromSheet,
} from './services/googleSheets';
import { EXACT_FORM_FIELDS, DEFAULT_MONTH_NAMES_BN, DEFAULT_SPREADSHEET_ID } from './data/majlisList';
import { INITIAL_MAJLIS_USERS } from './data/majlisUsers';
import {
  SpreadsheetMetadata,
  SubmissionPayload,
  StoredSubmission,
  AuthUser,
  MajlisUserRecord,
} from './types';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('majlis_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('majlis_auth_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('majlis_auth_user');
    } catch (e) {
      console.error(e);
    }
  };

  // Spreadsheet connection configuration state
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetMetadata>(() => {
    try {
      const saved = localStorage.getItem('majlis_sheet_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return getDefaultSpreadsheetMetadata();
  });

  const [isSpreadsheetModalOpen, setIsSpreadsheetModalOpen] = useState(false);

  // Dynamic Majlis Users list (cached and synced from Google Sheets 'Majlis-Names')
  const [majlisUsersList, setMajlisUsersList] = useState<MajlisUserRecord[]>(() => {
    try {
      const saved = localStorage.getItem('majlis_synced_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MAJLIS_USERS;
  });

  // Background sync of all majlis users and mobile numbers from Google Sheets
  useEffect(() => {
    let isMounted = true;
    const targetSheetId = spreadsheet?.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    fetchMajlisUsersFromSheet(targetSheetId)
      .then((users) => {
        if (isMounted && users && users.length > 0) {
          setMajlisUsersList(users);
          try {
            localStorage.setItem('majlis_synced_users', JSON.stringify(users));
          } catch (e) {
            console.error('Failed to cache synced users:', e);
          }
        }
      })
      .catch((err) => {
        console.warn('Background majlis users sync error:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [spreadsheet?.spreadsheetId]);

  // Active Month (Sheet Tab) state
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    return spreadsheet.sheets?.[0]?.title || DEFAULT_MONTH_NAMES_BN[0];
  });

  // Local submissions repository (persisted in browser storage)
  const [submissions, setSubmissions] = useState<StoredSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('majlis_submissions_records');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Confirmation Modal state
  const [pendingPayload, setPendingPayload] = useState<SubmissionPayload | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success feedback state
  const [lastSubmittedSuccess, setLastSubmittedSuccess] = useState<{
    sheetTitle: string;
    majlisName: string;
    timestamp: string;
    liveSynced?: boolean;
  } | null>(null);

  // Save spreadsheet config to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('majlis_sheet_config', JSON.stringify(spreadsheet));
    } catch (e) {
      console.error(e);
    }
  }, [spreadsheet]);

  // Save submissions to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('majlis_submissions_records', JSON.stringify(submissions));
    } catch (e) {
      console.error(e);
    }
  }, [submissions]);

  // Fetch sheet tabs if webAppUrl is configured
  useEffect(() => {
    if (spreadsheet.webAppUrl) {
      fetchTabsFromAppsScript(spreadsheet.webAppUrl).then((data) => {
        if (data?.sheets && data.sheets.length > 0) {
          setSpreadsheet((prev) => ({
            ...prev,
            title: data.title || prev.title,
            sheets: data.sheets.map((s, i) => ({
              sheetId: i + 1,
              title: s,
              index: i,
            })),
          }));
        }
      });
    }
  }, [spreadsheet.webAppUrl]);

  // Headers for current sheet
  const headers = useMemo(() => {
    return [...EXACT_FORM_FIELDS];
  }, []);

  // Filter rows for the currently selected month, taking role into account
  const currentMonthRows = useMemo(() => {
    return submissions
      .filter((s) => {
        if (s.sheetTitle !== selectedMonth) return false;
        // If logged in as a specific majlis, only show submissions for that majlis
        if (currentUser?.role === 'majlis' && currentUser.majlisFullName) {
          return (
            s.majlisName === currentUser.majlisFullName ||
            (currentUser.majlisEnglish &&
              s.majlisName.toLowerCase().includes(currentUser.majlisEnglish.toLowerCase()))
          );
        }
        return true;
      })
      .map((s) => {
        return EXACT_FORM_FIELDS.map((f) => {
          if (f === 'মজলিস নাম') return s.majlisName;
          return s.values[f] ?? '';
        });
      });
  }, [submissions, selectedMonth, currentUser]);

  // Handle Form Submission Request -> Open Confirmation Modal
  const handleFormSubmitRequest = (payload: SubmissionPayload) => {
    setPendingPayload(payload);
  };

  // Handle Final Submission Confirmation
  const handleConfirmSubmit = async () => {
    if (!pendingPayload) return;

    setIsSubmitting(true);
    try {
      let liveSynced = false;

      // 1. If Google Apps Script Web App URL is configured, push directly to live Google Sheet
      if (spreadsheet.webAppUrl) {
        const result = await submitToAppsScript(spreadsheet.webAppUrl, {
          sheetTitle: pendingPayload.sheetTitle,
          majlisName: pendingPayload.majlisName,
          date: pendingPayload.date,
          headers: [...EXACT_FORM_FIELDS],
          rowValues: pendingPayload.orderedRowValues,
          fieldValues: pendingPayload.customValues,
        });
        liveSynced = result.success;
      }

      // 2. Record submission in local history
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString();

      const newRecord: StoredSubmission = {
        id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        timestamp: `${dateStr} ${timeStr}`,
        sheetTitle: pendingPayload.sheetTitle,
        majlisName: pendingPayload.majlisName,
        date: pendingPayload.date,
        values: pendingPayload.customValues,
        syncedToGoogleSheet: liveSynced,
      };

      setSubmissions((prev) => [newRecord, ...prev]);

      // 3. Set success banner
      setLastSubmittedSuccess({
        sheetTitle: pendingPayload.sheetTitle,
        majlisName: pendingPayload.majlisName,
        timestamp: timeStr,
        liveSynced,
      });

      // Close modal
      setPendingPayload(null);
    } catch (err: any) {
      console.error('Submission failed:', err);
      alert('তথ্য সংরক্ষণে সমস্যা হয়েছে: ' + (err.message || 'Error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle saving new spreadsheet settings from Modal
  const handleSaveSettings = (settings: {
    spreadsheetId: string;
    title: string;
    webAppUrl: string;
    sheetTabs: string[];
  }) => {
    const newSheets = settings.sheetTabs.map((title, i) => ({
      sheetId: i + 1,
      title,
      index: i,
    }));

    setSpreadsheet({
      spreadsheetId: settings.spreadsheetId,
      title: settings.title,
      webAppUrl: settings.webAppUrl,
      sheets: newSheets,
      spreadsheetUrl: settings.spreadsheetId && !settings.spreadsheetId.startsWith('local')
        ? `https://docs.google.com/spreadsheets/d/${settings.spreadsheetId}/edit`
        : undefined,
    });

    if (newSheets.length > 0 && !newSheets.some((s) => s.title === selectedMonth)) {
      setSelectedMonth(newSheets[0].title);
    }
  };

  // CSV Export for submissions
  const handleExportCSV = () => {
    if (submissions.length === 0) {
      alert('ডাউনলোড করার জন্য কোনো তথ্য নেই।');
      return;
    }

    const csvContent = exportSubmissionsToCSV(submissions);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `majlis_monthly_report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If user is not logged in, render the login portal
  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} usersList={majlisUsersList} />;
  }

  return (
    <div className="min-h-screen bg-gray-50/70 text-gray-900 flex flex-col">
      {/* Top Header with active user indicator and logout */}
      <Header
        spreadsheet={spreadsheet}
        onOpenSpreadsheetSettings={() => setIsSpreadsheetModalOpen(true)}
        onExportCSV={handleExportCSV}
        submissionsCount={submissions.length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* The 36-Field Data Entry Form */}
        <DataEntryForm
          spreadsheet={spreadsheet}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          headers={headers}
          existingRows={currentMonthRows}
          onSubmitRequest={handleFormSubmitRequest}
          onOpenSettings={() => setIsSpreadsheetModalOpen(true)}
          currentUser={currentUser}
          lastSubmittedSuccess={lastSubmittedSuccess}
        />

        {/* Submissions Table for the selected month */}
        <RecentSubmissionsTable
          spreadsheet={spreadsheet}
          selectedMonth={selectedMonth}
          headers={headers}
          rows={currentMonthRows}
          isLoading={false}
          onRefresh={() => {}}
        />
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(pendingPayload)}
        isSubmitting={isSubmitting}
        payload={pendingPayload}
        spreadsheetTitle={spreadsheet.title}
        webAppUrl={spreadsheet.webAppUrl}
        onOpenSettings={() => setIsSpreadsheetModalOpen(true)}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setPendingPayload(null)}
      />

      {/* Sheet Settings Modal (Web App URL, Google Sheet URL, Month Tabs) */}
      <SpreadsheetSelector
        isOpen={isSpreadsheetModalOpen}
        onClose={() => setIsSpreadsheetModalOpen(false)}
        currentSpreadsheet={spreadsheet}
        onSaveSettings={handleSaveSettings}
      />

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 mt-12 text-center text-xs text-gray-500">
        মজলিস আনসারুল্লাহ্ মাসিক প্রতিবেদন এন্ট্রি পোর্টাল • Google Sheets Compatible
      </footer>
    </div>
  );
}
