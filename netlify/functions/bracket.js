/**
 * /api/bracket
 * Returns sports with group standings + knockout rounds.
 * Used by both Bracket page and Leaderboard (standings) page.
 */
import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet, toInt } from './_sheets.js';
import { schedule, teams as staticTeams, sports as staticSports } from '../../data/eventData.js';

const ROUND_ORDER = { group: 0, r16: 1, qf: 2, sf: 3, '3rd': 4, final: 5 };
export const ROUND_LABEL = {
  group: 'Vòng bảng', r16: '1/8 Cuối', qf: 'Tứ kết',
  sf: 'Bán kết', '3rd': 'Hạng 3', final: 'Chung kết',
};

/* Compute W/D/L standings from a list of {home,away,homeScore,awayScore} */
function computeStandings(matches, teamById) {
  const tbl = {};
  const ensure = (id) => {
    if (!tbl[id]) tbl[id] = { id, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
  };
  matches.forEach(({ home, away, homeScore, awayScore }) => {
    ensure(home); ensure(away);
    if (homeScore == null || awayScore == null) return;
    const hs = toInt(homeScore, 0), as = toInt(awayScore, 0);
    tbl[home].gf += hs; tbl[home].ga += as;
    tbl[away].gf += as; tbl[away].ga += hs;
    if (hs > as)      { tbl[home].w++; tbl[home].pts += 3; tbl[away].l++; }
    else if (hs < as) { tbl[away].w++; tbl[away].pts += 3; tbl[home].l++; }
    else              { tbl[home].d++; tbl[home].pts++; tbl[away].d++; tbl[away].pts++; }
  });
  return Object.values(tbl)
    .map(t => ({
      ...t,
      gd:    t.gf - t.ga,
      name:  teamById[t.id]?.name  ?? t.id,
      short: teamById[t.id]?.short ?? '',
      color: teamById[t.id]?.color ?? '#888',
      logo:  teamById[t.id]?.logo  ?? '',
    }))
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
}

/* Enrich a raw match with team/sport display info */
function enrich(m, teamById) {
  const home = teamById[m.home] || {};
  const away = teamById[m.away] || {};
  return {
    id:         m.id,
    round:      m.round,
    roundLabel: ROUND_LABEL[m.round] ?? m.round,
    groupName:  m.groupName || '',
    home: m.home, away: m.away,
    homeScore:  m.homeScore, awayScore: m.awayScore,
    homeName:   home.name  ?? m.home,  homeColor: home.color ?? '#888', homeLogo: home.logo ?? '',
    awayName:   away.name  ?? m.away,  awayColor: away.color ?? '#888', awayLogo: away.logo ?? '',
    date: m.date ?? '', time: m.time ?? '', status: m.status ?? '',
  };
}

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const [matchRows, teamRows, sportRows] = await Promise.all([
    fetchSheet('matches'), fetchSheet('teams'), fetchSheet('sports'),
  ]);

  const teamById = Object.fromEntries(
    (teamRows?.length ? teamRows : staticTeams).map(t => [t.id, t])
  );
  const sports = sportRows?.length ? sportRows : staticSports;

  /* Normalise raw rows */
  const rawMatches = matchRows?.length
    ? matchRows.map(m => ({
        id:        m.id,
        sportId:   m.sport_id || m.sportId || '',
        round:     m.round || 'group',
        groupName: m.group_name || m.groupName || '',
        home: m.home, away: m.away,
        homeScore: (m.home_score !== '' && m.home_score != null) ? toInt(m.home_score, null) : null,
        awayScore: (m.away_score !== '' && m.away_score != null) ? toInt(m.away_score, null) : null,
        date: m.date || '', time: m.time || m.match_time || '', status: m.status || '',
      }))
    : schedule.map(m => ({
        id: m.id, sportId: m.sportId, round: m.round,
        groupName: m.groupName || '',
        home: m.home, away: m.away,
        homeScore: m.homeScore ?? null, awayScore: m.awayScore ?? null,
        date: m.date || '', time: m.time || '', status: m.status || '',
      }));

  /* Group by sport */
  const bySport = {};
  rawMatches.forEach(m => {
    if (!bySport[m.sportId]) bySport[m.sportId] = [];
    bySport[m.sportId].push(m);
  });

  const result = sports.map(sp => {
    const matches = (bySport[sp.id] || []).map(m => enrich(m, teamById));

    /* Group-stage matches */
    const groupMatches = matches.filter(m => m.round === 'group');
    const knockouts    = matches.filter(m => m.round !== 'group');

    /* Build group standings */
    let groups = null;
    if (groupMatches.length) {
      const groupNames = [...new Set(groupMatches.map(m => m.groupName || 'A'))].sort();
      groups = {};
      groupNames.forEach(gn => {
        const gm = groupMatches.filter(m => (m.groupName || 'A') === gn);
        groups[gn] = {
          matches: gm,
          standings: computeStandings(gm, teamById),
        };
      });
    }

    /* Build knockout rounds in sorted order */
    const roundKeys = [...new Set(knockouts.map(m => m.round))]
      .sort((a, b) => (ROUND_ORDER[a] ?? 9) - (ROUND_ORDER[b] ?? 9));
    const rounds = {};
    roundKeys.forEach(r => {
      rounds[r] = { label: ROUND_LABEL[r] ?? r, matches: knockouts.filter(m => m.round === r) };
    });

    return { id: sp.id, name: sp.name, icon: sp.icon ?? '🏅',
             hasGroups: groupMatches.length > 0, groups, rounds, roundOrder: roundKeys };
  }).filter(sp => sp.hasGroups || sp.roundOrder.length > 0);

  return ok(result);
}
