export interface SheetTabInfo {
  sheetId: number;
  title: string;
  index: number;
}

export interface SpreadsheetSummary {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface SpreadsheetMetadata {
  spreadsheetId: string;
  title: string;
  sheets: SheetTabInfo[];
  spreadsheetUrl?: string;
  webAppUrl?: string;
}

export interface SheetColumnHeader {
  index: number;
  name: string;
  key: string;
  isMajlisField?: boolean;
  isDateField?: boolean;
  isMonthField?: boolean;
  isNumberField?: boolean;
}

export interface SubmissionPayload {
  spreadsheetId: string;
  sheetTitle: string;
  majlisName: string;
  date: string;
  customValues: Record<string, string | number>;
  orderedRowValues: (string | number)[];
}

export interface StoredSubmission {
  id: string;
  timestamp: string;
  sheetTitle: string;
  majlisName: string;
  date: string;
  values: Record<string, string | number>;
  syncedToGoogleSheet?: boolean;
}

export interface MajlisUserRecord {
  sl: number;
  english: string;
  bangla: string;
  mobile: string;
  district?: string;
  region?: string;
  fullName: string;
}

export interface AuthUser {
  username: string;
  role: 'admin' | 'majlis';
  majlisEnglish?: string;
  majlisBangla?: string;
  majlisFullName?: string; // e.g. "আহমদনগর (Ahmadnagar)"
  district?: string;
  region?: string;
}

export interface MajlisHistoricalReport {
  monthTab: string;
  monthLabel: string;
  hasData: boolean;
  filledCount: number;
  rowNumber?: number;
  values: Record<string, string | number>;
  source: 'google_sheet' | 'local_submission';
  timestamp?: string;
}

