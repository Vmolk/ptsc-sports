import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet, toInt } from './_sheets.js';
import { sports as staticSports } from '../../data/eventData.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const rows = await fetchSheet('sports');
  if (!rows?.length) return ok(staticSports);

  const data = rows.map((r) => ({
    id:     r.id,
    name:   r.name,
    icon:   r.icon || '🏆',
    teams:  toInt(r.teams),
    format: r.format || '',
    venue:  r.venue || '',
  }));
  return ok(data);
}
