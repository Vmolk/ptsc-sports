import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet, toInt } from './_sheets.js';
import { teams, medals, individualMedals } from '../data/eventData.js';

/* ---- Team leaderboard ---- */
function calcTeamTable(medalRows, teamRows) {
  const teamById = Object.fromEntries(
    (teamRows || teams).map((t) => [t.id, t])
  );
  return (medalRows || medals)
    .map((m) => {
      const g = toInt(m.gold, 0);
      const s = toInt(m.silver, 0);
      const b = toInt(m.bronze, 0);
      const id = m.team_id || m.teamId || m.team;
      const team = teamById[id] || {};
      return {
        teamId: id,
        name:   team.name  ?? id,
        short:  team.short ?? '',
        color:  team.color ?? '#888',
        gold: g, silver: s, bronze: b,
        total:  g + s + b,
        points: g * 3 + s * 2 + b,
      };
    })
    .sort((a, b) => b.points - a.points || b.gold - a.gold || b.silver - a.silver)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}

/* ---- Individual leaderboard ---- */
function calcIndividualTable(rows) {
  const map = {};
  (rows || individualMedals).forEach((r) => {
    const key = r.athlete;
    if (!key) return;
    if (!map[key]) {
      map[key] = { athlete: r.athlete, dept: r.dept || '', gold: 0, silver: 0, bronze: 0, sports: [] };
    }
    const medal = (r.medal || '').toLowerCase();
    if (medal === 'gold')        map[key].gold++;
    else if (medal === 'silver') map[key].silver++;
    else if (medal === 'bronze') map[key].bronze++;
    if (r.sport && !map[key].sports.includes(r.sport)) map[key].sports.push(r.sport);
  });

  return Object.values(map)
    .map((p) => ({
      ...p,
      total:  p.gold + p.silver + p.bronze,
      points: p.gold * 3 + p.silver * 2 + p.bronze,
    }))
    .sort((a, b) => b.points - a.points || b.gold - a.gold || b.silver - a.silver)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const [medalRows, teamRows, indivRows] = await Promise.all([
    fetchSheet('medals'),
    fetchSheet('teams'),
    fetchSheet('individual_medals'),
  ]);

  return ok({
    teams:      calcTeamTable(medalRows?.length ? medalRows : null, teamRows?.length ? teamRows : null),
    individuals: calcIndividualTable(indivRows?.length ? indivRows : null),
  });
}
