import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet, toInt } from './_sheets.js';
import { sports as staticSports } from '../data/eventData.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const rows = await fetchSheet('sports');
  if (!rows?.length) return ok(staticSports);

  /* Icon overrides: use custom image for specific sports regardless of sheet value */
  const ICON_OVERRIDES = {
    pickleball: '/pickleball-icon.png',
  };

  const data = rows.map((r) => ({
    id:     r.id,
    name:   r.name,
    icon:   ICON_OVERRIDES[r.id] || r.icon || '🏆',
    /* Keep teams as raw string — can be "6", "16 đơn + 16 đôi", "16 cặp" etc. */
    teams:  r.teams || '',
    format: r.format || '',
    venue:  r.venue || '',
  }));
  return ok(data);
}
