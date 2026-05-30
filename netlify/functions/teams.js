import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet, toInt } from './_sheets.js';
import { teams as staticTeams } from '../../data/eventData.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const rows = await fetchSheet('teams');
  if (!rows?.length) return ok(staticTeams);

  return ok(rows.map(r => ({
    id:      r.id,
    name:    r.name,
    short:   r.short   || '',
    color:   r.color   || '#1d3557',
    logo:    r.logo    || '',
    members: toInt(r.members, 0),
  })));
}
