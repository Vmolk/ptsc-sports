import bcrypt from 'bcryptjs';
import { ok, fail, handlePreflight, getSupabase, requireAuth, parseBody } from './_shared.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'POST') return fail('Method not allowed', 405);

  const { error: authError } = requireAuth(event, ['admin']);
  if (authError) return authError;

  const supabase = getSupabase();
  if (!supabase) return fail('Database not configured', 503);

  const body = parseBody(event);
  if (!body) return fail('Invalid JSON body', 400);

  const { username, password, email, role = 'viewer' } = body;
  if (!username || !password) return fail('Username and password required', 422);
  if (password.length < 6) return fail('Password must be at least 6 characters', 422);
  if (!['admin', 'editor', 'viewer'].includes(role)) return fail('Invalid role', 422);

  const hash = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from('users')
    .insert({ username, email: email || null, password_hash: hash, role })
    .select('id, username, email, role, created_at')
    .single();

  if (error) {
    if (error.code === '23505') return fail('Username already exists', 409);
    return fail(error.message, 500);
  }
  return ok(data, 201, false);
}
