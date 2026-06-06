/**
 * /api/participants
 * Returns athletes grouped by sport and team.
 * Google Sheet tab: participants  columns: sport_id, team_id, name, category
 */
import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet } from './_sheets.js';
import {
  participants as staticParticipants,
  teams as staticTeams,
  sports as staticSports,
} from '../../data/eventData.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const sportId = event.queryStringParameters?.sport;

  const [pRows, teamRows, sportRows] = await Promise.all([
    fetchSheet('participants'),
    fetchSheet('teams'),
    fetchSheet('sports'),
  ]);

  /* ── Debug logging ── */
  console.log('[participants] pRows:', pRows === null ? 'NULL' : `${pRows.length} rows`);
  if (pRows?.length) {
    console.log('[participants] columns:', Object.keys(pRows[0]).join(', '));
    const sportIds = [...new Set(pRows.map(r => r.sport_id || '(empty)'))];
    console.log('[participants] unique sport_ids in sheet:', sportIds.join(', '));
  }

  const teamById  = Object.fromEntries(
    (teamRows?.length ? teamRows : staticTeams).map(t => [t.id, t])
  );
  const sportById = Object.fromEntries(
    (sportRows?.length ? sportRows : staticSports).map(s => [s.id, s])
  );

  let data;
  if (pRows?.length) {
    data = pRows.map(r => {
      const tid = r.team_id || r.teamId || '';
      const sid = r.sport_id || r.sportId || '';
      return {
        sportId:   sid,
        teamId:    tid,
        name:      r.name     || '',
        category:  r.category || '',
        jersey:    r.jersey   || r.so_ao || '',   // Số áo — column "jersey" or "so_ao"
        teamName:  teamById[tid]?.name  ?? tid,
        teamColor: teamById[tid]?.color ?? '#888',
        teamShort: teamById[tid]?.short ?? '',
        sportName: sportById[sid]?.name ?? sid,
        sportIcon: sportById[sid]?.icon ?? '🏅',
      };
    }).filter(r => r.name);
  } else {
    data = staticParticipants.map(r => ({
      ...r,
      jersey:    r.jersey || '',
      teamName:  teamById[r.teamId]?.name  ?? r.teamId,
      teamColor: teamById[r.teamId]?.color ?? '#888',
      teamShort: teamById[r.teamId]?.short ?? '',
      sportName: sportById[r.sportId]?.name ?? r.sportId,
      sportIcon: sportById[r.sportId]?.icon ?? '🏅',
    }));
  }

  if (sportId) data = data.filter(p => p.sportId === sportId);

  return ok(data);
}
