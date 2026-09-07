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

