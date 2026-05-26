import { ok, fail, handlePreflight, getSupabase } from './_shared.js';
import { teams, medals } from '../../data/eventData.js';

const POINTS = { gold: 3, silver: 2, bronze: 1 };

function calcFromStatic() {
  const teamById = Object.fromEntries(teams.map((t) => [t.id, t]));
  return medals
    .map((m) => {
      const team = teamById[m.teamId] || {};
      const points = m.gold * 3 + m.silver * 2 + m.bronze;
      return { teamId: m.teamId, name: team.name ?? m.teamId, short: team.short ?? '',
        color: team.color ?? '#888', gold: m.gold, silver: m.silver, bronze: m.bronze,
        total: m.gold + m.silver + m.bronze, points };
    })
    .sort((a, b) => b.points - a.points || b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const supabase = getSupabase();
  if (!supabase) return ok(calcFromStatic());

  const { data, error } = await supabase
    .from('medals')
    .select('*, team:teams(name,short,color)')
    .order('gold', { ascending: false });

  if (error || !data?.length) return ok(calcFromStatic());

  const table = data
    .map((m) => {
      const points = m.gold * 3 + m.silver * 2 + m.bronze;
      return { teamId: m.team_id, name: m.team?.name ?? m.team_id, short: m.team?.short ?? '',
        color: m.team?.color ?? '#888', gold: m.gold, silver: m.silver, bronze: m.bronze,
        total: m.gold + m.silver + m.bronze, points };
    })
    .sort((a, b) => b.points - a.points || b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze)
    .map((row, i) => ({ ...row, rank: i + 1 }));

  return ok(table);
}
