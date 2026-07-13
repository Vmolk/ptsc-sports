/**
 * /api/debug — diagnostic endpoint
 * Uses the SAME fetchSheet as all other endpoints (including the fix)
 */
import { fetchSheet } from './_sheets.js';

export async function handler(event) {
  const CORS = { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' };
  const sheetName = event.queryStringParameters?.sheet || 'participants';

  const rows = await fetchSheet(sheetName);

  /* For participants: show unique sport_ids and sample per sport */
  let bySport = null;
  if (sheetName === 'participants' && rows?.length) {
    bySport = {};
    rows.forEach(r => {
      const sid = r.sport_id || '(empty)';
      if (!bySport[sid]) bySport[sid] = { count: 0, sample: r };
      bySport[sid].count++;
    });
  }

  return {
    statusCode: 200,
    headers: CORS,
    body: JSON.stringify({
      sheet:       sheetName,
      hasSheetId:  !!process.env.GOOGLE_SHEET_ID,
      rowCount:    rows?.length ?? null,
      isNull:      rows === null,
      /* Headers as parsed by the FIXED _sheets.js */
      headers:     rows?.[0] ? Object.keys(rows[0]) : null,
      first2rows:  rows?.slice(0, 2) ?? null,
      /* participants-specific: how many rows per sport_id */
      bySport,
    }, null, 2),
  };
}
