import bcrypt from 'bcryptjs';
import { ok, fail, handlePreflight, getSupabase, requireAuth, parseBody } from './_shared.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;

  const { error: authError } = requireAuth(event, ['admin']);
  if (authError) return authError;

  const supabase = getSupabase();
  if (!supabase) return fail('Database not configured', 503);

  const { id } = event.queryStringParameters || {};

  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase
      .from('users').select('id, username, email, role, created_at').order('created_at');
    if (error) return fail(error.message, 500);
    return ok(data, 200, false);
  }

  if (event.httpMethod === 'PUT') {
    if (!id) return fail('ID required', 422);
    const body = parseBody(event);
    if (!body) return fail('Invalid JSON', 400);

    const updates = {};
    if (body.email !== undefined) updates.email = body.email;
    if (body.role) {
      if (!['admin', 'editor', 'viewer'].includes(body.role)) return fail('Invalid role', 422);
      updates.role = body.role;
    }
    if (body.password) {
      if (body.password.length < 6) return fail('Password must be at least 6 characters', 422);
      updates.password_hash = await bcrypt.hash(body.password, 12);
    }

    const { data, error } = await supabase
      .from('users').update(updates).eq('id', id).select('id, username, email, role, created_at').single();
    if (error) return fail(error.message, 500);
    return ok(data, 200, false);
  }

  if (event.httpMethod === 'DELETE') {
    if (!id) return fail('ID required', 422);
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) return fail(error.message, 500);
    return ok({ deleted: true }, 200, false);
  }

  return fail('Method not allowed', 405);
}
