/**
 * POST /api/login  { username, password }
 * Demo authentication endpoint. Validates against env credentials and
 * returns a lightweight signed-ish token. For a real deployment, swap
 * this for proper auth (JWT + a user store).
 *
 * Env vars: ADMIN_USERNAME, ADMIN_PASSWORD, AUTH_SECRET
 */
import { ok, fail, handlePreflight } from './_shared.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'POST') return fail('Method not allowed', 405);

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return fail('Invalid JSON body', 400);
  }

  const { username, password } = body;
  if (!username || !password) {
    return fail('Vui lòng nhập tên đăng nhập và mật khẩu', 422);
  }

  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'ptsc2026';

  if (username !== validUser || password !== validPass) {
    return fail('Tên đăng nhập hoặc mật khẩu không đúng', 401);
  }

  // Minimal opaque token. Do NOT use this scheme for sensitive systems.
  const secret = process.env.AUTH_SECRET || 'dev-secret';
  const token = Buffer.from(`${username}:${Date.now()}:${secret}`).toString('base64');

  return ok({ token, user: { username, role: 'admin' } });
}
