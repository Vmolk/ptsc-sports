/**
 * /api/debug  — temporary debug endpoint
 * Visit https://ptsc-sports-2026.onrender.com/api/debug in browser to see raw sheet data
 */
import { fetchSheet } from './_sheets.js';

export async function handler(event) {
  const CORS = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  };

  const sheetName = event.queryStringParameters?.sheet || 'participants';

  const hasId  = !!process.env.GOOGLE_SHEET_ID;
  const SHEET_ID = process.env.GOOGLE_SHEET_ID;

  /* Fetch raw CSV directly so we can see exact bytes */
  let rawText = null, rawFirst500 = null, httpStatus = null;
  if (SHEET_ID) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      httpStatus = res.status;
      rawText = await res.text();
      /* Show first 500 chars as JSON string so we can see \n \t \r etc */
      rawFirst500 = JSON.stringify(rawText.slice(0, 500));
    } catch (e) {
      rawFirst500 = `ERROR: ${e.message}`;
    }
  }

  const rows = rawText ? (() => {
    const { parseCSV } = { parseCSV: (t) => {
      const cleaned = t.replace(/^﻿/, '');
      const lines = cleaned.trim().split('\n').filter(l => l.trim());
      if (lines.length < 2) return [];
      const parseRow = row => {
        const result = []; let cur = '', inQ = false;
        for (const c of row) {
          if (c === '"') { inQ = !inQ; }
          else if (c === ',' && !inQ) { result.push(cur); cur = ''; }
          else { cur += c; }
        }
        result.push(cur);
        return result.map(v => v.trim());
      };
      const headers = parseRow(lines[0]).map(h => h.replace(/^﻿/, '').trim());
      return lines.slice(1).map(line => {
        const vals = parseRow(line);
        return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
      });
    }};
    return parseCSV(rawText);
  })() : null;

  return {
    statusCode: 200,
    headers: CORS,
    body: JSON.stringify({
      sheet:        sheetName,
      hasSheetId:   hasId,
      httpStatus,
      rawFirst500,                          /* ← KEY: see exact raw CSV bytes */
      rowCount:     rows?.length ?? null,
      headers:      rows?.[0] ? Object.keys(rows[0]) : null,
      first2rows:   rows?.slice(0, 2) ?? null,
    }, null, 2),
  };
}
