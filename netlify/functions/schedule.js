import { ok, fail, handlePreflight, getSupabase } from './_shared.js';
import { schedule, teams, sports } from '../../data/eventData.js';

const teamById = Object.fromEntries(teams.map((t) => [t.id, t]));
const sportById = Object.fromEntries(sports.map((s) => [s.id, s]));

function enrichStatic(match) {
  const home = teamById[match.home] || {};
  const away = teamById[match.away] || {};
  const sport = sportById[match.sportId] || {};
  return { ...match, sportName: sport.name ?? match.sportId, sportIcon: sport.icon ?? '🏅',
    homeName: home.name ?? match.home, homeColor: home.color ?? '#888',
    awayName: away.name ?? match.away, awayColor: away.color ?? '#888' };
}

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const { day, status, sport } = event.queryStringParameters || {};
  const supabase = getSupabase();

  if (!supabase) {
    let r = schedule.map(enrichStatic);
    if (day) r = r.filter((m) => String(m.day) === String(day));
    if (status) r = r.filter((m) => m.status === status);
    if (sport) r = r.filter((m) => m.sportId === sport);
    return ok(r);
  }

  let q = supabase.from('matches')
    .select('*, sports(name,icon), home_team:teams!home_team_id(name,color,short), away_team:teams!away_team_id(name,color,short)')
    .order('day').order('match_time');
  if (day) q = q.eq('day', day);
  if (status) q = q.eq('status', status);
  if (sport) q = q.eq('sport_id', sport);

  const { data, error } = await q;
  if (error) return fail(error.message, 500);

  if (!data?.length) {
    let r = schedule.map(enrichStatic);
    if (day) r = r.filter((m) => String(m.day) === String(day));
    if (status) r = r.filter((m) => m.status === status);
    if (sport) r = r.filter((m) => m.sportId === sport);
    return ok(r);
  }

  const enriched = data.map((m) => ({
    ...m, sportName: m.sports?.name ?? m.sport_id, sportIcon: m.sports?.icon ?? '🏅',
    homeName: m.home_team?.name ?? m.home_team_id, homeColor: m.home_team?.color ?? '#888',
    awayName: m.away_team?.name ?? m.away_team_id, awayColor: m.away_team?.color ?? '#888',
  }));
  return ok(enriched);
}
