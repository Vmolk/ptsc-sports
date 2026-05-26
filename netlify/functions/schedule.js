/**
 * GET /api/schedule -> match schedule.
 * Optional filters: ?day=1  ?status=live|upcoming|finished  ?sport=football
 * Each match is enriched with readable team & sport names so the
 * frontend doesn't need to do the joins itself.
 */
import { ok, fail, handlePreflight } from './_shared.js';
import { schedule, teams, sports } from '../../data/eventData.js';

const teamById = Object.fromEntries(teams.map((t) => [t.id, t]));
const sportById = Object.fromEntries(sports.map((s) => [s.id, s]));

function enrich(match) {
  const home = teamById[match.home];
  const away = teamById[match.away];
  const sport = sportById[match.sportId];
  return {
    ...match,
    sportName: sport?.name ?? match.sportId,
    sportIcon: sport?.icon ?? '🏅',
    homeName: home?.name ?? match.home,
    homeColor: home?.color ?? '#888',
    awayName: away?.name ?? match.away,
    awayColor: away?.color ?? '#888',
  };
}

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const { day, status, sport } = event.queryStringParameters || {};
  let result = schedule.map(enrich);

  if (day) result = result.filter((m) => String(m.day) === String(day));
  if (status) result = result.filter((m) => m.status === status);
  if (sport) result = result.filter((m) => m.sportId === sport);

  return ok(result);
}
