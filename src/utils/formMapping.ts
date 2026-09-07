import { EXACT_FORM_FIELDS } from '../data/majlisList';

/**
 * Normalizes field names by trimming whitespace and normalizing Bengali/English spaces
 */
export function normalizeFieldName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[্\u200C\u200D]/g, '') // remove zero-width chars for tolerant matching if any
    .toLowerCase();
}

/**
 * Finds matching standard field from an arbitrary sheet header
 */
export function findMatchingFormField(header: string): string | null {
  const normalizedHeader = normalizeFieldName(header);
  
  for (const field of EXACT_FORM_FIELDS) {
    if (normalizeFieldName(field) === normalizedHeader) {
      return field;
    }
  }

  // Tolerant matches for common punctuation or parentheses
  for (const field of EXACT_FORM_FIELDS) {
    const normField = normalizeFieldName(field);
    if (normalizedHeader.includes(normField) || normField.includes(normalizedHeader)) {
      return field;
    }
  }

  return null;
}
