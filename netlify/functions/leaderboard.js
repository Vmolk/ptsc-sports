/**
 * GET /api/leaderboard -> teams ranked by points.
 * Points = Gold*3 + Silver*2 + Bronze*1.
 * Ties broken by gold, then silver, then bronze.
 */
import { ok, fail, handlePreflight } from './_shared.js';
import { teams, medals } from '../../data/eventData.js';

const POINTS = { gold: 3, silver: 2, bronze: 1 };
const teamById = Object.fromEntries(teams.map((t) => [t.id, t]));

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const table = medals
    .map((m) => {
      const team = teamById[m.teamId] || {};
      const points =
        m.gold * POINTS.gold + m.silver * POINTS.silver + m.bronze * POINTS.bronze;
      return {
        teamId: m.teamId,
        name: team.name ?? m.teamId,
        short: team.short ?? '',
        color: team.color ?? '#888',
        gold: m.gold,
        silver: m.silver,
        bronze: m.bronze,
        total: m.gold + m.silver + m.bronze,
        points,
      };
    })
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.gold - a.gold ||
        b.silver - a.silver ||
        b.bronze - a.bronze
    )
    .map((row, i) => ({ ...row, rank: i + 1 }));

  return ok(table);
}
