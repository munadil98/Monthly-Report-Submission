import { SheetTabInfo, SpreadsheetMetadata } from '../types';
import {
  DEFAULT_MONTH_NAMES_BN,
  DEFAULT_SPREADSHEET_ID,
  DEFAULT_SPREADSHEET_GID,
  EXACT_FORM_FIELDS,
} from '../data/majlisList';

/**
 * Extracts a spreadsheet ID from a raw ID or full Google Sheets URL.
 */
export function extractSpreadsheetId(input: string): string {
  const trimmed = input.trim();
  // Match standard Google Sheets URL pattern: /spreadsheets/d/([a-zA-Z0-9-_]+)
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  // Remove query params or hashes if accidentally pasted
  return trimmed.split(/[?#/]/)[0];
}

/**
 * Converts a 1-based column number to A1 letter notation (e.g. 1 -> A, 26 -> Z, 27 -> AA, 36 -> AJ).
 */
export function columnIndexToA1(columnNumber: number): string {
  let temp = columnNumber;
  let letter = '';
  while (temp > 0) {
    const mod = (temp - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    temp = Math.floor((temp - mod) / 26);
  }
  return letter;
}

/**
 * Submits row data to a connected Google Apps Script Web App without requiring any user authentication.
 */
export async function submitToAppsScript(
  webAppUrl: string,
  payload: {
    sheetTitle: string;
    majlisName: string;
    date: string;
    rowValues: (string | number)[];
    headers: string[];
    fieldValues?: Record<string, string | number>;
    customValues?: Record<string, string | number>;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanUrl = webAppUrl.trim();
    if (!cleanUrl) {
      return { success: false, error: 'Web App URL পাওয়া যায়নি' };
    }

    // Using text/plain;charset=utf-8 with mode: 'no-cors' allows browser fetch to POST stringified JSON
    // directly to Google Apps Script without triggering CORS preflight rejection or non-simple header errors.
    await fetch(cleanUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        ...payload,
        fieldValues: payload.fieldValues || payload.customValues || {},
      }),
    });

    return { success: true };
  } catch (err: any) {
    console.error('Apps Script submission error:', err);
    return { success: false, error: err.message || 'Submission failed' };
  }
}

/**
 * Fetches sheet metadata, months, and Majlis names from a deployed Google Apps Script Web App.
 */
export async function fetchTabsFromAppsScript(
  webAppUrl: string
): Promise<{ title?: string; sheets: string[]; majlisList?: string[] } | null> {
  try {
    const cleanUrl = webAppUrl.trim();
    const target = cleanUrl.includes('?') ? `${cleanUrl}&action=getSheets` : `${cleanUrl}?action=getSheets`;
    const res = await fetch(target, {
      method: 'GET',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (e) {
    console.warn('Could not fetch data from Apps Script endpoint:', e);
    return null;
  }
}

/**
 * Fetches Majlis names directly from the sheet named "Majlis-Names"
 * Looks for columns: "Majlis in Bangla" and "Majlis in English"
 * Formats each as: "Majlis in Bangla (Majlis in English)"
 */
export async function fetchMajlisNamesFromSheet(
  sheetUrlOrId: string,
  webAppUrl?: string
): Promise<string[] | null> {
  // 1. Try Apps Script if webAppUrl is provided
  if (webAppUrl && webAppUrl.trim()) {
    try {
      const data = await fetchTabsFromAppsScript(webAppUrl);
      if (data?.majlisList && data.majlisList.length > 0) {
        return data.majlisList;
      }
    } catch (e) {
      console.warn('Apps Script majlis fetch failed, trying direct gviz:', e);
    }
  }

  // 2. Try direct Google Visualization query on sheet 'Majlis-Names'
  const sheetId = extractSpreadsheetId(sheetUrlOrId);
  if (!sheetId || sheetId.startsWith('local')) {
    return null;
  }

  const possibleSheetNames = ['Majlis-Names', 'Majlis Names', 'Majlis_Names', 'Majlis-Name', 'Majlis'];

  for (const sheetName of possibleSheetNames) {
    try {
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
        sheetName
      )}`;

      const res = await fetch(gvizUrl);
      if (!res.ok) continue;

      const text = await res.text();
      // Parse Google's /*O_o*/ google.visualization.Query.setResponse({...});
      const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);/);
      if (!match || !match[1]) continue;

      const json = JSON.parse(match[1]);
      if (!json || json.status === 'error' || !json.table) continue;

      const cols = json.table.cols || [];
      const rows = json.table.rows || [];
      if (rows.length === 0) continue;

      // Identify column indices for "Majlis in Bangla" and "Majlis in English"
      let banglaColIdx = -1;
      let englishColIdx = -1;

      // Check header labels in cols
      cols.forEach((col: any, idx: number) => {
        const label = String(col.label || '').toLowerCase();
        if (label.includes('bangla') || label.includes('বাংলা')) banglaColIdx = idx;
        if (label.includes('english') || label.includes('ইংরেজি')) englishColIdx = idx;
      });

      // If not found in cols label, check first row (often headers sit in row 0)
      let startRowIdx = 0;
      if (banglaColIdx === -1 && rows.length > 0) {
        const firstRow = rows[0].c || [];
        firstRow.forEach((cell: any, idx: number) => {
          const val = String(cell?.v || '').toLowerCase();
          if (val.includes('bangla') || val.includes('বাংলা') || val.includes('মজলিস')) {
            banglaColIdx = idx;
          }
          if (val.includes('english') || val.includes('ইংরেজি')) {
            englishColIdx = idx;
          }
        });
        if (banglaColIdx !== -1) {
          startRowIdx = 1; // skip header row
        }
      }

      // If still not identified, default to column 0 for Bangla and column 1 for English if available
      if (banglaColIdx === -1) {
        banglaColIdx = 0;
        if (cols.length > 1) {
          englishColIdx = 1;
        }
      }

      const results: string[] = [];

      for (let r = startRowIdx; r < rows.length; r++) {
        const cells = rows[r].c || [];
        const rawBn = cells[banglaColIdx]?.v ?? cells[banglaColIdx]?.f ?? '';
        const rawEn = englishColIdx !== -1 ? cells[englishColIdx]?.v ?? cells[englishColIdx]?.f ?? '' : '';

        const bangla = String(rawBn).trim();
        const english = String(rawEn).trim();

        if (!bangla) continue;

        // If it's the header row repeated, skip
        if (/^(majlis in bangla|মজলিস নাম|bangla|বাংলা)$/i.test(bangla)) {
          continue;
        }

        // Format as "Majlis in Bangla (Majlis in English)"
        if (english && !bangla.includes('(')) {
          results.push(`${bangla} (${english})`);
        } else {
          results.push(bangla);
        }
      }

      if (results.length > 0) {
        return results;
      }
    } catch (err) {
      console.warn(`Could not read sheet ${sheetName}:`, err);
    }
  }

  return null;
}

/**
 * Default fallback metadata configured for the user's Majlis spreadsheet
 */
export function getDefaultSpreadsheetMetadata(
  title = 'মজলিস মাসিক প্রতিবেদন (Majlis Monthly Reports)',
  spreadsheetId = DEFAULT_SPREADSHEET_ID,
  webAppUrl?: string
): SpreadsheetMetadata {
  const cleanId = spreadsheetId ? extractSpreadsheetId(spreadsheetId) : DEFAULT_SPREADSHEET_ID;
  const sheets: SheetTabInfo[] = DEFAULT_MONTH_NAMES_BN.map((name, i) => ({
    sheetId: i + 1,
    title: name,
    index: i,
  }));

  return {
    spreadsheetId: cleanId,
    title,
    sheets,
    spreadsheetUrl: cleanId && !cleanId.startsWith('local') 
      ? `https://docs.google.com/spreadsheets/d/${cleanId}/edit#gid=${DEFAULT_SPREADSHEET_GID}`
      : undefined,
    webAppUrl,
  };
}

/**
 * Generates CSV string from submissions
 */
export function exportSubmissionsToCSV(
  rows: Array<{
    sheetTitle: string;
    majlisName: string;
    date: string;
    values: Record<string, string | number>;
  }>
): string {
  const headers = ['মাসের নাম', 'তারিখ', ...EXACT_FORM_FIELDS];
  const escapeCsv = (val: any) => {
    const s = String(val ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const csvRows = [headers.map(escapeCsv).join(',')];

  rows.forEach((r) => {
    const rowData = [
      r.sheetTitle,
      r.date,
      ...EXACT_FORM_FIELDS.map((f) => {
        if (f === 'মজলিস নাম') return r.majlisName;
        return r.values[f] ?? '';
      }),
    ];
    csvRows.push(rowData.map(escapeCsv).join(','));
  });

  return csvRows.join('\n');
}

/**
 * Smart Google Apps Script code template.
 * - Automatically finds the target sheet tab (e.g. Oct26, Nov26, even if submitted as "October" or "অক্টোবর").
 * - Locates the exact row for the submitted Majlis (e.g. Row 78 for "Mirpur" in "Oct26").
 * - Updates the existing row's cells matching header column names.
 * - If not found, appends a new row.
 */
export const GOOGLE_APPS_SCRIPT_CODE_TEMPLATE = `/**
 * মজলিস গুগল শিট ডাটা এন্ট্রি কানেক্টর (Google Apps Script)
 * স্প্রেডশিট: 1z-7FiFuqhJeA2ClrdOyNW-CoW7m5DYe8freXYO9RSes
 * 
 * কিভাবে Deploy করবেন:
 * ১. আপনার গুগল শিট খুলে মেনু থেকে Extensions > Apps Script-এ যান।
 * ২. বিদ্যমান কোড মুছে এই সম্পূর্ণ কোডটি পেস্ট করুন এবং Save দিন (Ctrl+S বা সেভ আইকন)।
 * ৩. উপরে ডানে Deploy > New deployment বাটনে ক্লিক করুন।
 * ৪. Select type (গিয়ার আইকন) থেকে 'Web app' নির্বাচন করুন।
 * ৫. Description: Majlis Monthly Reports
 * ৬. Execute as: 'Me' (আপনার ইমেইল)
 * ৭. Who has access: 'Anyone' (যে কেউ ডাটা পাঠাতে পারবে, গুগল লগইন ছাড়া)
 * ৮. 'Deploy' বাটনে ক্লিক করে Google Authorization সম্পন্ন করুন।
 * ৯. প্রাপ্ত Web App URL টি কপি করে অ্যাপে পেস্ট করুন।
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets().map(function(s) {
    return s.getName();
  });
  
  // Majlis-Names শিট থেকে বাংলা ও ইংরেজি নাম সংগ্রহ
  var majlisSheet = ss.getSheetByName("Majlis-Names") || 
                    ss.getSheetByName("Majlis Names") || 
                    ss.getSheetByName("Majlis_Names") || 
                    ss.getSheetByName("Majlis");
  var majlisList = [];
  
  if (majlisSheet) {
    var data = majlisSheet.getDataRange().getValues();
    if (data.length > 1) {
      var headerRow = data[0];
      var banglaCol = -1;
      var englishCol = -1;
      
      for (var i = 0; i < headerRow.length; i++) {
        var h = String(headerRow[i]).trim();
        if (/bangla|বাংলা/i.test(h)) banglaCol = i;
        if (/english|ইংরেজি/i.test(h)) englishCol = i;
      }
      if (banglaCol === -1) banglaCol = 0;
      
      for (var r = 1; r < data.length; r++) {
        var bn = String(data[r][banglaCol] || '').trim();
        var en = englishCol !== -1 ? String(data[r][englishCol] || '').trim() : '';
        if (bn) {
          if (en && !bn.includes('(')) {
            majlisList.push(bn + " (" + en + ")");
          } else {
            majlisList.push(bn);
          }
        }
      }
    }
  }
  
  var result = {
    title: ss.getName(),
    sheets: sheets,
    majlisList: majlisList
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rawSheetTitle = data.sheetTitle || "Oct26";
    
    // ১. সঠিক শিট ট্যাব নির্বাচন (যেমন: Oct26, Nov26 ইত্যাদি)
    var targetSheet = findSheetByFuzzyName(ss, rawSheetTitle);
    if (!targetSheet) {
      targetSheet = ss.getSheetByName(rawSheetTitle) || ss.insertSheet(rawSheetTitle);
    }
    
    // ২. শিটের হেডার লাইন রিড করা
    var sheetData = targetSheet.getDataRange().getValues();
    var headers = [];
    if (sheetData.length > 0) {
      headers = sheetData[0].map(function(h) { return String(h).trim(); });
    } else if (data.headers && data.headers.length > 0) {
      targetSheet.appendRow(data.headers);
      headers = data.headers;
      sheetData = [headers];
    }
    
    // ৩. 'মজলিস' কলামের ইন্ডেক্স খোঁজা (সাধারণত কলাম B / Col 1)
    var majlisColIdx = -1;
    for (var c = 0; c < headers.length; c++) {
      if (/মজলিস|majlis/i.test(headers[c])) {
        majlisColIdx = c;
        break;
      }
    }
    if (majlisColIdx === -1 && headers.length > 1) {
      majlisColIdx = 1;
    }
    
    // ৪. সাবমিট করা মজলিস নামের ভ্যারিয়েন্ট (ইংরেজি ও বাংলা)
    var inputMajlis = String(data.majlisName || '').trim();
    var majlisVariants = extractMajlisVariants(inputMajlis);
    
    // ৫. বিদ্যমান সারিতে এই মজলিস আছে কিনা অনুসন্ধান (যেমন Oct26 শিটে Mirpur এর সারি 78)
    var targetRowIdx = -1;
    for (var r = 1; r < sheetData.length; r++) {
      var rowMajlis = String(sheetData[r][majlisColIdx] || '').trim();
      if (matchesMajlis(rowMajlis, majlisVariants)) {
        targetRowIdx = r + 1; // Google Sheets Range 1-indexed
        break;
      }
    }
    
    var fieldValues = data.fieldValues || data.customValues || {};
    
    // ৬. ডাটা সংরক্ষণ
    if (targetRowIdx !== -1) {
      // মজলিস বিদ্যমান: নির্দিষ্ট সারির সেলগুলোতে কলাম হেডার মিলিয়ে মান বসানো
      for (var colIdx = 0; colIdx < headers.length; colIdx++) {
        var hName = headers[colIdx];
        if (colIdx === majlisColIdx) continue;
        if (/sl|ক্রমিক|^id$/i.test(hName)) continue;
        
        var val = findFieldValue(fieldValues, hName);
        if (val !== undefined && val !== null && val !== '') {
          targetSheet.getRange(targetRowIdx, colIdx + 1).setValue(val);
        }
      }
    } else {
      // মজলিস না পাওয়া গেলে নতুন সারি হিসেবে শিটে যোগ করা
      if (data.rowValues && data.rowValues.length > 0) {
        targetSheet.appendRow(data.rowValues);
        targetRowIdx = targetSheet.getLastRow();
      } else {
        var newRow = [];
        for (var i = 0; i < headers.length; i++) {
          var header = headers[i];
          if (i === majlisColIdx) {
            newRow.push(inputMajlis);
          } else {
            var val2 = findFieldValue(fieldValues, header);
            newRow.push(val2 !== undefined && val2 !== null ? val2 : '');
          }
        }
        targetSheet.appendRow(newRow);
        targetRowIdx = targetSheet.getLastRow();
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      updatedSheet: targetSheet.getName(),
      updatedRow: targetRowIdx,
      majlis: inputMajlis
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: err.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// মাসের নামের সাথে শিটের নাম মেলানোর ফাংশন (যেমন: October -> Oct26, অক্টোবর -> Oct26)
function findSheetByFuzzyName(ss, name) {
  var s = ss.getSheetByName(name);
  if (s) return s;
  
  var clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  var monthMap = {
    "jan": "Jan26", "জানু": "Jan26", "january": "Jan26",
    "feb": "Feb26", "ফেব্রু": "Feb26", "february": "Feb26",
    "mar": "Mar26", "মার্চ": "Mar26", "march": "Mar26",
    "apr": "Apr26", "এপ্রিল": "Apr26", "april": "Apr26",
    "may": "May26", "মে": "May26",
    "jun": "jun26", "জুন": "jun26", "june": "jun26",
    "jul": "July26", "জুলাই": "July26", "july": "July26",
    "aug": "Aug26", "আগস্ট": "Aug26", "august": "Aug26",
    "sep": "Sep26", "সেপ্টে": "Sep26", "september": "Sep26",
    "oct": "Oct26", "অক্টো": "Oct26", "october": "Oct26",
    "nov": "Nov26", "নভে": "Nov26", "november": "Nov26",
    "dec": "Dec26", "ডিসে": "Dec26", "december": "Dec26"
  };
  
  for (var key in monthMap) {
    if (clean.indexOf(key) !== -1 || name.indexOf(key) !== -1) {
      var mapped = ss.getSheetByName(monthMap[key]);
      if (mapped) return mapped;
    }
  }
  
  // আংশিক মিল অনুসন্ধান
  var all = ss.getSheets();
  for (var i = 0; i < all.length; i++) {
    var curName = all[i].getName();
    if (curName.toLowerCase().indexOf(clean) !== -1 || clean.indexOf(curName.toLowerCase()) !== -1) {
      return all[i];
    }
  }
  return null;
}

// মজলিস নাম ভ্যারিয়েন্ট তৈরি (বাংলা ও ইংরেজি আলাদা করা)
function extractMajlisVariants(raw) {
  var list = [raw.toLowerCase().trim()];
  var match = raw.match(/^(.*?)\\s*\\((.*?)\\)$/);
  if (match) {
    list.push(match[1].trim().toLowerCase());
    list.push(match[2].trim().toLowerCase());
  }
  return list;
}

// মজলিস নামের মিল যাচাই
function matchesMajlis(sheetMajlis, variants) {
  if (!sheetMajlis) return false;
  var sm = sheetMajlis.toLowerCase().trim();
  for (var i = 0; i < variants.length; i++) {
    var v = variants[i];
    if (sm === v) return true;
    if (sm.indexOf(v) !== -1 || v.indexOf(sm) !== -1) return true;
  }
  return false;
}

// ফিল্ড ভ্যালু খুঁজে বের করা
function findFieldValue(dict, headerName) {
  if (!dict || !headerName) return '';
  var cleanH = headerName.trim().replace(/\\s+/g, ' ');
  
  if (dict[cleanH] !== undefined) return dict[cleanH];
  
  for (var k in dict) {
    var cleanK = k.trim().replace(/\\s+/g, ' ');
    if (cleanK === cleanH) return dict[k];
    if (cleanH.indexOf(cleanK) !== -1 || cleanK.indexOf(cleanH) !== -1) return dict[k];
  }
  return '';
}
`;
