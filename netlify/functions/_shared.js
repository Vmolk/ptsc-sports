/**
 * netlify/functions/_shared.js
 * ------------------------------------------------------------
 * Small helpers shared by every serverless function so each
 * function file stays tiny and easy to debug.
 * ------------------------------------------------------------
 */

const COMMON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  // Cache GET responses at the CDN edge for 60s to cut cold starts.
  'Cache-Control': 'public, max-age=0, s-maxage=60',
};

/** Build a JSON success response. */
export function ok(data, statusCode = 200) {
  return {
    statusCode,
    headers: COMMON_HEADERS,
    body: JSON.stringify({ success: true, data }),
  };
}

/** Build a JSON error response. */
export function fail(message, statusCode = 400) {
  return {
    statusCode,
    headers: COMMON_HEADERS,
    body: JSON.stringify({ success: false, error: message }),
  };
}

/** Handle CORS preflight; returns a response or null if not a preflight. */
export function handlePreflight(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: COMMON_HEADERS, body: '' };
  }
  return null;
}
