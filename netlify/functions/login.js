import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ok, fail, handlePreflight, getSupabase, getJwtSecret, parseBody } from './_shared.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'POST') return fail('Method not allowed', 405);

  const body = parseBody(event);
  if (!body) return fail('Invalid JSON body', 400);

  const { username, password } = body;
  if (!username || !password) return fail('Vui lòng nhập tên đăng nhập và mật khẩu', 422);

  const supabase = getSupabase();

  if (supabase) {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, role, password_hash')
      .eq('username', username)
      .single();

    if (error || !user) return fail('Tên đăng nhập hoặc mật khẩu không đúng', 401);

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return fail('Tên đăng nhập hoặc mật khẩu không đúng', 401);

    const token = jwt.sign(
      { sub: user.id, username: user.username, role: user.role },
      getJwtSecret(),
      { expiresIn: '8h' }
    );
    return ok({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } }, 200, false);
  }

  // Fallback: env-var credentials (no DB configured)
  const envUser = process.env.ADMIN_USERNAME || 'admin';
  const envPass = process.env.ADMIN_PASSWORD || 'qaqc2026';
  if (username !== envUser || password !== envPass) {
    return fail('Tên đăng nhập hoặc mật khẩu không đúng', 401);
  }

  const token = jwt.sign(
    { sub: 'env-admin', username, role: 'admin' },
    getJwtSecret(),
    { expiresIn: '8h' }
  );
  return ok({ token, user: { username, role: 'admin' } }, 200, false);
}
