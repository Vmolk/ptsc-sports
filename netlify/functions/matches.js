import { ok, fail, handlePreflight, getSupabase, requireAuth, parseBody } from './_shared.js';
import { schedule as staticSchedule, teams, sports } from '../../data/eventData.js';

const teamById = Object.fromEntries(teams.map((t) => [t.id, t]));
const sportById = Object.fromEntries(sports.map((s) => [s.id, s]));

function enrichStatic(m) {
  const home = teamById[m.home] || {};
  const away = teamById[m.away] || {};
  const sport = sportById[m.sportId] || {};
  return { ...m, sportName: sport.name ?? m.sportId, sportIcon: sport.icon ?? '🏅',
    homeName: home.name ?? m.home, homeColor: home.color ?? '#888',
    awayName: away.name ?? m.away, awayColor: away.color ?? '#888' };
}

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;

  const { id, day, status, sport, tournament_id } = event.queryStringParameters || {};
  const supabase = getSupabase();

  if (event.httpMethod === 'GET') {
    if (!supabase) {
      let r = staticSchedule.map(enrichStatic);
      if (day) r = r.filter((m) => String(m.day) === String(day));
      if (status) r = r.filter((m) => m.status === status);
      if (sport) r = r.filter((m) => m.sportId === sport);
      return ok(r);
    }

    if (id) {
      const { data, error } = await supabase
        .from('matches').select('*, sports(name,icon), home_team:teams!home_team_id(name,color), away_team:teams!away_team_id(name,color)')
        .eq('id', id).single();
      if (error) return fail('Match not found', 404);
      return ok(data);
    }

    let q = supabase.from('matches')
      .select('*, sports(name,icon), home_team:teams!home_team_id(name,color,short), away_team:teams!away_team_id(name,color,short)')
      .order('day').order('match_time');
    if (day) q = q.eq('day', day);
    if (status) q = q.eq('status', status);
    if (sport) q = q.eq('sport_id', sport);
    if (tournament_id) q = q.eq('tournament_id', tournament_id);
    const { data, error } = await q;
    if (error) return fail(error.message, 500);
    return ok(data);
  }

  if (event.httpMethod === 'POST') {
    const { error: authError, user } = requireAuth(event, ['admin', 'editor']);
    if (authError) return authError;
    if (!supabase) return fail('Database not configured', 503);

    const body = parseBody(event);
    if (!body) return fail('Invalid JSON', 400);
    const { sport_id, tournament_id: tid, round, day: d, match_time, venue,
      home_team_id, away_team_id, home_score, away_score, status: s } = body;

    const { data, error } = await supabase
      .from('matches')
      .insert({ sport_id, tournament_id: tid, round, day: d || 1, match_time, venue,
        home_team_id, away_team_id, home_score, away_score, status: s || 'upcoming' })
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
    const { sport_id, round, day: d, match_time, venue, home_team_id, away_team_id,
      home_score, away_score, status: s } = body;

    const { data, error } = await supabase
      .from('matches')
      .update({ sport_id, round, day: d, match_time, venue, home_team_id, away_team_id,
        home_score, away_score, status: s, updated_at: new Date().toISOString() })
      .eq('id', id).select().single();
    if (error) return fail(error.message, 500);
    return ok(data, 200, false);
  }

  if (event.httpMethod === 'DELETE') {
    const { error: authError } = requireAuth(event, ['admin']);
    if (authError) return authError;
    if (!supabase) return fail('Database not configured', 503);
    if (!id) return fail('ID required', 422);

    const { error } = await supabase.from('matches').delete().eq('id', id);
    if (error) return fail(error.message, 500);
    return ok({ deleted: true }, 200, false);
  }

  return fail('Method not allowed', 405);
}
