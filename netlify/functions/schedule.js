import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet, toInt } from './_sheets.js';
import { schedule, teams, sports } from '../../data/eventData.js';

const staticTeamById  = Object.fromEntries(teams.map((t) => [t.id, t]));
const staticSportById = Object.fromEntries(sports.map((s) => [s.id, s]));

function enrichStatic(m) {
  const home  = staticTeamById[m.home] || {};
  const away  = staticTeamById[m.away] || {};
  const sport = staticSportById[m.sportId] || {};
  return { ...m, sportName: sport.name ?? m.sportId, sportIcon: sport.icon ?? '🏅',
    homeName: home.name ?? m.home, homeColor: home.color ?? '#888',
    awayName: away.name ?? m.away, awayColor: away.color ?? '#888' };
}

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const { day, status, sport } = event.queryStringParameters || {};

  const [matchRows, teamRows, sportRows] = await Promise.all([
    fetchSheet('matches'), fetchSheet('teams'), fetchSheet('sports'),
  ]);

  if (!matchRows?.length) {
    let r = schedule.map(enrichStatic);
    if (day) r = r.filter((m) => String(m.day) === String(day));
    if (status) r = r.filter((m) => m.status === status);
    if (sport) r = r.filter((m) => m.sportId === sport);
    return ok(r);
  }

  const teamById  = Object.fromEntries((teamRows || []).map((t) => [t.id, t]));
  const sportById = Object.fromEntries((sportRows || []).map((s) => [s.id, s]));

  let rows = matchRows.map((m) => {
    const home  = teamById[m.home]  || staticTeamById[m.home]  || {};
    const away  = teamById[m.away]  || staticTeamById[m.away]  || {};
    const sp    = sportById[m.sport_id || m.sportId] || staticSportById[m.sport_id || m.sportId] || {};
    return {
      id: m.id, sportId: m.sport_id || m.sportId,
      round: m.round, day: toInt(m.day, 1), time: m.time || m.match_time,
      venue: m.venue, home: m.home, away: m.away,
      homeScore: m.home_score !== '' ? toInt(m.home_score, null) : null,
      awayScore: m.away_score !== '' ? toInt(m.away_score, null) : null,
      status: m.status || 'upcoming',
      sportName: sp.name ?? '', sportIcon: sp.icon ?? '🏅',
      homeName: home.name ?? m.home, homeColor: home.color ?? '#888',
      awayName: away.name ?? m.away, awayColor: away.color ?? '#888',
    };
  });

  if (day)    rows = rows.filter((m) => String(m.day) === String(day));
  if (status) rows = rows.filter((m) => m.status === status);
  if (sport)  rows = rows.filter((m) => m.sportId === sport);
  rows.sort((a, b) => a.day - b.day || (a.time || '').localeCompare(b.time || ''));
  return ok(rows);
}
