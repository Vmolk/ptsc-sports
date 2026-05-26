import jwt from 'jsonwebtoken';
import { ok, fail, handlePreflight, getJwtSecret, parseBody } from './_shared.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'POST') return fail('Method not allowed', 405);

  const body = parseBody(event);
  if (!body) return fail('Invalid JSON body', 400);

  const { username, password } = body;
  if (!username || !password) return fail('Vui lòng nhập tên đăng nhập và mật khẩu', 422);

  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'qaqc2026';

  if (username !== validUser || password !== validPass) {
    return fail('Tên đăng nhập hoặc mật khẩu không đúng', 401);
  }

  const token = jwt.sign(
    { sub: 'admin', username, role: 'admin' },
    getJwtSecret(),
    { expiresIn: '8h' }
  );
  return ok({ token, user: { username, role: 'admin' } }, 200, false);
}
