import { ok, fail, handlePreflight, getSupabase, requireAuth, parseBody } from './_shared.js';
import { gallery as staticGallery } from '../../data/eventData.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;

  const { day, id, tournament_id } = event.queryStringParameters || {};
  const supabase = getSupabase();

  if (event.httpMethod === 'GET') {
    if (!supabase) {
      const items = day ? staticGallery.filter((g) => String(g.day) === String(day)) : staticGallery;
      return ok(items);
    }
    let q = supabase.from('images').select('*').order('created_at', { ascending: false });
    if (day) q = q.eq('day', day);
    if (tournament_id) q = q.eq('tournament_id', tournament_id);
    const { data, error } = await q;
    if (error) return fail(error.message, 500);
    return ok(data.length > 0 ? data : staticGallery);
  }

  if (event.httpMethod === 'POST') {
    const { error: authError, user } = requireAuth(event, ['admin', 'editor']);
    if (authError) return authError;
    if (!supabase) return fail('Database not configured', 503);

    const body = parseBody(event);
    if (!body) return fail('Invalid JSON', 400);
    const { title, url, sport_id, tournament_id: tid, day: d } = body;
    if (!url) return fail('URL is required', 422);

    const { data, error } = await supabase
      .from('images')
      .insert({ title, url, sport_id, tournament_id: tid, day: d, uploaded_by: user.sub })
      .select().single();
    if (error) return fail(error.message, 500);
    return ok(data, 201, false);
  }

  if (event.httpMethod === 'DELETE') {
    const { error: authError } = requireAuth(event, ['admin']);
    if (authError) return authError;
    if (!supabase) return fail('Database not configured', 503);
    if (!id) return fail('ID required', 422);

    const { error } = await supabase.from('images').delete().eq('id', id);
    if (error) return fail(error.message, 500);
    return ok({ deleted: true }, 200, false);
  }

  return fail('Method not allowed', 405);
}
