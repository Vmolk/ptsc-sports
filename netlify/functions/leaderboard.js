import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet, toInt } from './_sheets.js';
import { teams, medals } from '../../data/eventData.js';

function calcTable(medalRows, teamRows) {
  const teamById = Object.fromEntries(
    (teamRows || teams).map((t) => [t.id, t])
  );
  return (medalRows || medals)
    .map((m) => {
      const g = toInt(m.gold ?? m.gold, 0);
      const s = toInt(m.silver ?? m.silver, 0);
      const b = toInt(m.bronze ?? m.bronze, 0);
      const id = m.team_id || m.teamId;
      const team = teamById[id] || {};
      return {
        teamId: id,
        name: team.name ?? id,
        short: team.short ?? '',
        color: team.color ?? '#888',
        gold: g, silver: s, bronze: b,
        total: g + s + b,
        points: g * 3 + s * 2 + b,
      };
    })
    .sort((a, b) => b.points - a.points || b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const [medalRows, teamRows] = await Promise.all([fetchSheet('medals'), fetchSheet('teams')]);
  return ok(calcTable(medalRows?.length ? medalRows : null, teamRows?.length ? teamRows : null));
}
