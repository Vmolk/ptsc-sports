/**
 * /api/bracket
 * Returns sports with group standings + knockout rounds, grouped by category.
 * Sports with multiple categories (e.g. badminton: Đơn nam/nữ, Đôi nam/nữ)
 * return { hasCategories: true, categories: [...] }.
 * Sports with one or no category return the flat structure.
 */
import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet, toInt } from './_sheets.js';
import { schedule, teams as staticTeams, sports as staticSports } from '../../data/eventData.js';

const ROUND_ORDER = { group: 0, r16: 1, qf: 2, sf: 3, '3rd': 4, final: 5 };
export const ROUND_LABEL = {
  group: 'Vòng bảng', r16: 'Vòng 1/8', qf: 'Tứ kết',
  sf: 'Bán kết', '3rd': 'Hạng 3', final: 'Chung kết',
};

/* Compute standings from a list of matches.
 * sportId='pickleball': 1 pt/win, no draws, sort by pts then hệ số (gf-ga)
 * other sports: 3 pts/win, 1 pt/draw (football style)
 */
function computeStandings(matches, teamById, sportId) {
  /* 1pt/win, no draws: pickleball + badminton */
  const isPkl = sportId === 'pickleball' || sportId === 'badminton';
  const tbl = {};
  /* h2h[idA][idB] = { pts, gd } — points/goal-diff A earned in matches *against* B */
  const h2h = {};

  const ensure = (id) => {
    if (!tbl[id]) tbl[id] = { id, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
  };
  const ensureH2H = (a, b) => {
    if (!h2h[a])    h2h[a]    = {};
    if (!h2h[b])    h2h[b]    = {};
    if (!h2h[a][b]) h2h[a][b] = { pts: 0, gd: 0 };
    if (!h2h[b][a]) h2h[b][a] = { pts: 0, gd: 0 };
  };

  matches.forEach(({ home, away, homeScore, awayScore }) => {
    ensure(home); ensure(away);
    ensureH2H(home, away);
    if (homeScore == null || awayScore == null) return;
    const hs = toInt(homeScore, 0), as = toInt(awayScore, 0);
    tbl[home].gf += hs; tbl[home].ga += as;
    tbl[away].gf += as; tbl[away].ga += hs;
    h2h[home][away].gd += hs - as;
    h2h[away][home].gd += as - hs;
    if (hs > as) {
      tbl[home].w++;
      tbl[home].pts += isPkl ? 1 : 3;
      tbl[away].l++;
      h2h[home][away].pts += isPkl ? 1 : 3;
    } else if (hs < as) {
      tbl[away].w++;
      tbl[away].pts += isPkl ? 1 : 3;
      tbl[home].l++;
      h2h[away][home].pts += isPkl ? 1 : 3;
    } else if (!isPkl) {
      tbl[home].d++; tbl[home].pts++;
      tbl[away].d++; tbl[away].pts++;
      h2h[home][away].pts++;
      h2h[away][home].pts++;
    }
  });

  return Object.values(tbl)
    .map(t => ({
      ...t, gd: t.gf - t.ga,
      name:  teamById[t.id]?.name  ?? t.id,
      short: teamById[t.id]?.short ?? '',
      color: teamById[t.id]?.color ?? '#888',
      logo:  teamById[t.id]?.logo  ?? '',
    }))
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd  !== a.gd)  return b.gd  - a.gd;
      if (b.gf  !== a.gf)  return b.gf  - a.gf;
      /* Head-to-head tiebreaker: who won the direct match? */
      const aH = h2h[a.id]?.[b.id]; /* a's record against b */
      const bH = h2h[b.id]?.[a.id]; /* b's record against a */
      if (aH && bH) {
        if (aH.pts !== bH.pts) return bH.pts - aH.pts; /* higher aH.pts → a first */
        if (aH.gd  !== bH.gd)  return bH.gd  - aH.gd;  /* higher aH.gd  → a first */
      }
      return 0;
    });
}

/* Enrich a raw match with team display info */
function enrich(m, teamById) {
  const home = teamById[m.home] || {};
  const away = teamById[m.away] || {};
  return {
    id: m.id, round: m.round, roundLabel: ROUND_LABEL[m.round] ?? m.round,
    groupName: m.groupName || '', category: m.category || '',
    home: m.home, away: m.away,
    homeScore: m.homeScore, awayScore: m.awayScore,
    homeName:  home.name  ?? m.home,  homeColor: home.color ?? '#888', homeLogo: home.logo ?? '',
    awayName:  away.name  ?? m.away,  awayColor: away.color ?? '#888', awayLogo: away.logo ?? '',
    date: m.date ?? '', time: m.time ?? '', status: m.status ?? '',
    detail: m.detail ?? '',
  };
}

/* Build groups + knockout rounds from an array of enriched matches */
function buildBracket(enrichedMatches, teamById, sportId) {
  const groupMatches = enrichedMatches.filter(m => m.round === 'group');
  const knockouts    = enrichedMatches.filter(m => m.round !== 'group');

  let groups = null;
  if (groupMatches.length) {
    const groupNames = [...new Set(groupMatches.map(m => m.groupName || 'A'))].sort();
    groups = {};
    groupNames.forEach(gn => {
      const gm = groupMatches.filter(m => (m.groupName || 'A') === gn);
      groups[gn] = { matches: gm, standings: computeStandings(gm, teamById, sportId) };
    });
  }

  const roundKeys = [...new Set(knockouts.map(m => m.round))]
    .sort((a, b) => (ROUND_ORDER[a] ?? 9) - (ROUND_ORDER[b] ?? 9));
  const rounds = {};
  roundKeys.forEach(r => {
    rounds[r] = { label: ROUND_LABEL[r] ?? r, matches: knockouts.filter(m => m.round === r) };
  });

  return { hasGroups: groupMatches.length > 0, groups, rounds, roundOrder: roundKeys };
}

/* Same overrides as sports.js — keep in sync */
const ICON_OVERRIDES = {
  pickleball: '/pickleball-icon.png',
};

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
        sportId:   m.sport_id   || m.sportId   || '',
        round:     m.round      || 'group',
        category:  m.category   || '',
        groupName: m.group_name || m.groupName  || '',
        home: m.home, away: m.away,
        homeScore: (m.home_score !== '' && m.home_score != null) ? toInt(m.home_score, null) : null,
        awayScore: (m.away_score !== '' && m.away_score != null) ? toInt(m.away_score, null) : null,
        date: m.date || '', time: m.time || m.match_time || '', status: m.status || '',
        detail: m.detail || '',
      }))
    : schedule.map(m => ({
        id: m.id, sportId: m.sportId, round: m.round,
        category:  m.category  || '',
        groupName: m.groupName || '',
        home: m.home, away: m.away,
        homeScore: m.homeScore ?? null, awayScore: m.awayScore ?? null,
        date: m.date || '', time: m.time || '', status: m.status || '',
        detail: m.detail || '',
      }));

  /* Group by sport */
  const bySport = {};
  rawMatches.forEach(m => {
    if (!bySport[m.sportId]) bySport[m.sportId] = [];
    bySport[m.sportId].push(m);
  });

  const result = sports.map(sp => {
    const sportMatches = bySport[sp.id] || [];

    /* Check if this sport uses categories */
    const cats = [...new Set(sportMatches.map(m => m.category || ''))];
    const hasCategories = cats.some(c => c !== '');

    if (hasCategories) {
      /* Build a separate bracket per category */
      const namedCats = cats.filter(c => c !== '').sort();

      /* Knockout matches with no category filled in (common when users forget
         to fill the category column for SF/Final rows in Google Sheets).
         When there is only ONE named category, we can safely assign them to it.
         When there are multiple categories we leave them out to avoid duplication. */
      const singleCat = namedCats.length === 1;
      const floatingKO = singleCat
        ? sportMatches.filter(m => (!m.category || m.category === '') && m.round !== 'group')
        : [];

      const categories = namedCats
        .map(cat => {
          const catMatches = [
            ...sportMatches.filter(m => m.category === cat),
            ...floatingKO,                         // attach uncategorised KO matches
          ];
          const enriched   = catMatches.map(m => enrich(m, teamById));
          const bracket    = buildBracket(enriched, teamById, sp.id);
          return { name: cat, ...bracket };
        })
        .filter(c => c.hasGroups || c.roundOrder.length > 0);

      return {
        id: sp.id, name: sp.name, icon: ICON_OVERRIDES[sp.id] ?? sp.icon ?? '🏅',
        hasCategories: true,
        categories,
      };
    }

    /* Single bracket (no categories) */
    const enriched = sportMatches.map(m => enrich(m, teamById));
    const bracket  = buildBracket(enriched, teamById, sp.id);
    return {
      id: sp.id, name: sp.name, icon: ICON_OVERRIDES[sp.id] ?? sp.icon ?? '🏅',
      hasCategories: false,
      ...bracket,
    };
  }).filter(sp =>
    sp.hasCategories
      ? sp.categories?.length > 0
      : sp.hasGroups || sp.roundOrder?.length > 0
  );

  return ok(result);
}
