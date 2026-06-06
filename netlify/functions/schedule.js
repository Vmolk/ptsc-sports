import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet, toInt } from './_sheets.js';
import { schedule, teams, sports } from '../../data/eventData.js';

const staticTeamById  = Object.fromEntries(teams.map((t) => [t.id, t]));
const staticSportById = Object.fromEntries(sports.map((s) => [s.id, s]));

const ICON_OVERRIDES = { pickleball: '/pickleball-icon.png' };

// Duration (minutes) per sport — used for auto status calculation.
// If a sport is not listed here, DEFAULT_DURATION is used.
const SPORT_DURATION = {
  football:    90,
  futsal:      40,
  badminton:   60,
  tabletennis: 60,
  tennis:      90,
  volleyball:  90,
  basketball:  60,
};
const DEFAULT_DURATION = 90; // minutes

/**
 * Auto-calculate match status based on date + time.
 * If `status` is already set manually in the sheet, that takes priority.
 *
 * @param {string} manualStatus  - value from sheet (may be empty)
 * @param {string} date          - "2026-07-01"
 * @param {string} time          - "08:30"
 * @param {string} sportId       - used to look up duration
 * @returns {'upcoming'|'live'|'finished'}
 */
function resolveStatus(manualStatus, date, time, sportId) {
  if (manualStatus && manualStatus !== '') return manualStatus;
  if (!date || !time) return 'upcoming';

  try {
    const startMs  = new Date(`${date}T${time}:00+07:00`).getTime();
    const duration = (SPORT_DURATION[sportId] ?? DEFAULT_DURATION) * 60_000;
    const now      = Date.now();

    if (now < startMs)              return 'upcoming';
    if (now < startMs + duration)   return 'live';
    return 'finished';
  } catch {
    return manualStatus || 'upcoming';
  }
}

function enrichStatic(m) {
  const home  = staticTeamById[m.home] || {};
  const away  = staticTeamById[m.away] || {};
  const sport = staticSportById[m.sportId] || {};
  return {
    ...m,
    status:    resolveStatus(m.status, m.date, m.time, m.sportId),
    sportName: sport.name  ?? m.sportId,
    sportIcon: ICON_OVERRIDES[sport.id] ?? sport.icon  ?? '🏅',
    homeName:  home.name   ?? m.home,
    homeColor: home.color  ?? '#888',
    homeLogo:  home.logo   ?? '',
    awayName:  away.name   ?? m.away,
    awayColor: away.color  ?? '#888',
    awayLogo:  away.logo   ?? '',
  };
}

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const { day, status, sport } = event.queryStringParameters || {};

  const [matchRows, teamRows, sportRows] = await Promise.all([
    fetchSheet('matches'), fetchSheet('teams'), fetchSheet('sports'),
  ]);

  // ---- Static fallback ----
  if (!matchRows?.length) {
    let r = schedule.map(enrichStatic);
    if (day)    r = r.filter((m) => String(m.day) === String(day));
    if (status) r = r.filter((m) => m.status === status);
    if (sport)  r = r.filter((m) => m.sportId === sport);
    return ok(r);
  }

  // ---- From Google Sheet ----
  const teamById  = Object.fromEntries((teamRows  || []).map((t) => [t.id, t]));
  const sportById = Object.fromEntries((sportRows || []).map((s) => [s.id, s]));

  let rows = matchRows.map((m) => {
    const home    = teamById[m.home]  || staticTeamById[m.home]  || {};
    const away    = teamById[m.away]  || staticTeamById[m.away]  || {};
    const sportId = m.sport_id || m.sportId || '';
    const sp      = sportById[sportId] || staticSportById[sportId] || {};

    return {
      id:        m.id,
      sportId,
      round:     m.round,
      day:       toInt(m.day, 1),
      date:      m.date || '',          // "2026-07-01"
      time:      m.time || m.match_time || '',
      venue:     m.venue || '',
      home:      m.home,
      away:      m.away,
      homeScore: m.home_score !== '' && m.home_score != null ? toInt(m.home_score, null) : null,
      awayScore: m.away_score !== '' && m.away_score != null ? toInt(m.away_score, null) : null,
      status:    resolveStatus(m.status, m.date, m.time || m.match_time, sportId),
      sportName: sp.name  ?? sportId,
      sportIcon: ICON_OVERRIDES[sp.id] ?? sp.icon  ?? '🏅',
      homeName:  home.name  ?? m.home,
      homeColor: home.color ?? '#888',
      homeLogo:  home.logo  ?? '',
      awayName:  away.name  ?? m.away,
      awayColor: away.color ?? '#888',
      awayLogo:  away.logo  ?? '',
    };
  });

  if (day)    rows = rows.filter((m) => String(m.day) === String(day));
  if (status) rows = rows.filter((m) => m.status === status);
  if (sport)  rows = rows.filter((m) => m.sportId === sport);
  rows.sort((a, b) => a.day - b.day || (a.time || '').localeCompare(b.time || ''));

  return ok(rows);
}
