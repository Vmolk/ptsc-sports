/**
 * netlify/functions/_sheets.js
 * Fetch data from a public Google Sheet published as CSV.
 * No API key needed — sheet must be published via:
 *   File → Share → Publish to web → CSV
 *
 * Env var: GOOGLE_SHEET_ID  (the long ID in the sheet URL)
 */

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

/** Parse a CSV row, handling quoted fields that may contain commas. */
function parseRow(row) {
  const result = [];
  let cur = '', inQ = false;
  for (const c of row) {
    if (c === '"') { inQ = !inQ; }
    else if (c === ',' && !inQ) { result.push(cur); cur = ''; }
    else { cur += c; }
  }
  result.push(cur);
  return result.map((v) => v.trim());
}

/** Convert CSV text → array of objects keyed by header row. */
function parseCSV(text) {
  /* Strip BOM (﻿) that Google Sheets sometimes prepends to CSV exports.
     Without this, the first column header becomes "﻿sport_id" instead of
     "sport_id", so r.sport_id is always undefined → sportId = '' → 0 results. */
  const cleaned = text.replace(/^﻿/, '');
  const lines = cleaned.trim().split('\n').filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = parseRow(lines[0]).map(h => h.replace(/^﻿/, '').trim());
  return lines.slice(1).map((line) => {
    const vals = parseRow(line);
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
  });
}

/**
 * Fetch one sheet tab by name.
 * Returns parsed rows or null if GOOGLE_SHEET_ID is not set / fetch fails.
 */
export async function fetchSheet(sheetName) {
  if (!SHEET_ID) {
    console.error(`[fetchSheet] GOOGLE_SHEET_ID not set — returning null for "${sheetName}"`);
    return null;
  }
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    console.log(`[fetchSheet] "${sheetName}" → HTTP ${res.status}`);
    if (!res.ok) {
      console.error(`[fetchSheet] "${sheetName}" fetch failed: HTTP ${res.status}`);
      return null;
    }
    const text = await res.text();
    /* Log first 300 chars raw so we can see BOM / encoding issues */
    console.log(`[fetchSheet] "${sheetName}" raw (first 300):`, JSON.stringify(text.slice(0, 300)));
    const rows = parseCSV(text);
    console.log(`[fetchSheet] "${sheetName}" parsed ${rows.length} rows, headers:`, rows[0] ? Object.keys(rows[0]).join(' | ') : 'NONE');
    return rows;
  } catch (err) {
    console.error(`[fetchSheet] "${sheetName}" exception:`, err.message);
    return null;
  }
}

/** Helper: convert 'true'/'false'/'1'/'0' strings to booleans. */
export function toBool(v) { return v === 'true' || v === '1'; }

/** Helper: parse int, return fallback on NaN. */
export function toInt(v, fallback = 0) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}
