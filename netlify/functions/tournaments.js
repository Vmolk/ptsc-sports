import { ok, fail, handlePreflight, getSupabase, requireAuth, parseBody } from './_shared.js';
import { event as staticEvent } from '../../data/eventData.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;

  const { id } = event.queryStringParameters || {};
  const supabase = getSupabase();

  if (event.httpMethod === 'GET') {
    if (!supabase) {
      return ok([{ id: 'default', name: staticEvent.name, organizer: staticEvent.organizer,
        start_date: staticEvent.startDate, end_date: staticEvent.endDate,
        status: 'upcoming', location: 'TBD' }]);
    }
    if (id) {
      const { data, error } = await supabase.from('tournaments').select('*').eq('id', id).single();
      if (error) return fail('Tournament not found', 404);
      return ok(data);
    }
    const { data, error } = await supabase
      .from('tournaments').select('*').order('start_date', { ascending: false });
    if (error) return fail(error.message, 500);
    return ok(data);
  }

  if (event.httpMethod === 'POST') {
    const { error: authError, user } = requireAuth(event, ['admin', 'editor']);
    if (authError) return authError;
    if (!supabase) return fail('Database not configured', 503);

    const body = parseBody(event);
    if (!body) return fail('Invalid JSON', 400);
    const { name, description, start_date, end_date, location, status, banner_url } = body;
    if (!name) return fail('Name is required', 422);

    const { data, error } = await supabase
      .from('tournaments')
      .insert({ name, description, start_date, end_date, location,
        status: status || 'upcoming', banner_url, created_by: user.sub })
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
    const { name, description, start_date, end_date, location, status, banner_url } = body;

    const { data, error } = await supabase
      .from('tournaments')
      .update({ name, description, start_date, end_date, location, status, banner_url,
        updated_at: new Date().toISOString() })
      .eq('id', id).select().single();
    if (error) return fail(error.message, 500);
    return ok(data, 200, false);
  }

  if (event.httpMethod === 'DELETE') {
    const { error: authError } = requireAuth(event, ['admin']);
    if (authError) return authError;
    if (!supabase) return fail('Database not configured', 503);
    if (!id) return fail('ID required', 422);

    const { error } = await supabase.from('tournaments').delete().eq('id', id);
    if (error) return fail(error.message, 500);
    return ok({ deleted: true }, 200, false);
  }

  return fail('Method not allowed', 405);
}
