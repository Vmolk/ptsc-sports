import { ok, fail, handlePreflight, getSupabase, verifyToken } from './_shared.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const user = verifyToken(event);
  if (!user) return fail('Unauthorized', 401);

  const supabase = getSupabase();
  if (!supabase) {
    return ok({ id: user.sub, username: user.username, role: user.role }, 200, false);
  }

  if (user.sub === 'env-admin') {
    return ok({ id: user.sub, username: user.username, role: user.role }, 200, false);
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, username, email, role, created_at')
    .eq('id', user.sub)
    .single();

  if (error || !data) return fail('User not found', 404);
  return ok(data, 200, false);
}
