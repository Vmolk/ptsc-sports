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

  const hasId = !!process.env.GOOGLE_SHEET_ID;
  const rows  = await fetchSheet(sheetName);

  return {
    statusCode: 200,
    headers: CORS,
    body: JSON.stringify({
      sheet:       sheetName,
      hasSheetId:  hasId,
      rowCount:    rows?.length ?? null,
      headers:     rows?.[0] ? Object.keys(rows[0]) : null,
      first3rows:  rows?.slice(0, 3) ?? null,
      isNull:      rows === null,
    }, null, 2),
  };
}
