import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const CORS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function getJwtSecret() {
  return process.env.JWT_SECRET || process.env.AUTH_SECRET || 'dev-secret-change-me';
}

export function verifyToken(event) {
  const auth =
    event.headers?.authorization ||
    event.headers?.Authorization ||
    '';
  if (!auth.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.slice(7), getJwtSecret());
  } catch {
    return null;
  }
}

export function requireAuth(event, roles = []) {
  const user = verifyToken(event);
  if (!user) return { error: fail('Unauthorized', 401) };
  if (roles.length > 0 && !roles.includes(user.role)) {
    return { error: fail('Forbidden', 403) };
  }
  return { user };
}

export function parseBody(event) {
  try {
    return JSON.parse(event.body || '{}');
  } catch {
    return null;
  }
}
