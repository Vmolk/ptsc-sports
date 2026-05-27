const CORS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export function ok(data, statusCode = 200, cache = true) {
  return {
    statusCode,
    headers: cache
      ? { ...CORS, 'Cache-Control': 'public, max-age=0, s-maxage=60' }
      : { ...CORS, 'Cache-Control': 'no-store' },
    body: JSON.stringify({ success: true, data }),
  };
}

export function fail(message, statusCode = 400) {
  return {
    statusCode,
    headers: { ...CORS, 'Cache-Control': 'no-store' },
    body: JSON.stringify({ success: false, error: message }),
  };
}

export function handlePreflight(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  return null;
}

export function parseBody(event) {
  try { return JSON.parse(event.body || '{}'); } catch { return null; }
}
