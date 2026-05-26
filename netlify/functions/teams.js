import { ok, fail, handlePreflight, getSupabase, requireAuth, parseBody } from './_shared.js';
import { teams as staticTeams } from '../../data/eventData.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;

  const { id, tournament_id } = event.queryStringParameters || {};
  const supabase = getSupabase();

  if (event.httpMethod === 'GET') {
    if (!supabase) return ok(staticTeams);
    let q = supabase.from('teams').select('*').order('name');
    if (tournament_id) q = q.eq('tournament_id', tournament_id);
    const { data, error } = await q;
    if (error) return fail(error.message, 500);
    return ok(data.length > 0 ? data : staticTeams);
  }

  if (event.httpMethod === 'POST') {
    const { error: authError } = requireAuth(event, ['admin', 'editor']);
    if (authError) return authError;
    if (!supabase) return fail('Database not configured', 503);

    const body = parseBody(event);
    if (!body) return fail('Invalid JSON', 400);
    const { name, short, color, members, image_url, tournament_id: tid } = body;
    if (!name) return fail('Name is required', 422);
    const tid2 = body.id || 't-' + Date.now();

    const { data, error } = await supabase
      .from('teams')
      .insert({ id: tid2, name, short, color: color || '#1d3557', members: members || 0, image_url, tournament_id: tid })
      .select().single();
    if (error) return fail(error.message, 500);
    return ok(data, 201, false);
  }

  if (event.httpMethod === 'PUT') {
    const { error: authError } = requireAuth(event, ['admin', 'editor']);
    if (authError) return authError;
    if (!supabase) return fail('Database not configured', 503);
    if (!id) return fail('ID required', 422);

    const body = parseBody(event);
    if (!body) return fail('Invalid JSON', 400);
    const { name, short, color, members, image_url } = body;

    const { data, error } = await supabase
      .from('teams').update({ name, short, color, members, image_url }).eq('id', id).select().single();
    if (error) return fail(error.message, 500);
    return ok(data, 200, false);
  }

  if (event.httpMethod === 'DELETE') {
    const { error: authError } = requireAuth(event, ['admin']);
    if (authError) return authError;
    if (!supabase) return fail('Database not configured', 503);
    if (!id) return fail('ID required', 422);

    const { error } = await supabase.from('teams').delete().eq('id', id);
    if (error) return fail(error.message, 500);
    return ok({ deleted: true }, 200, false);
  }

  return fail('Method not allowed', 405);
}
