import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet, toInt } from './_sheets.js';
import { individualMedals } from '../../data/eventData.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const rows = await fetchSheet('scorers');
  if (!rows?.length) return ok([]);

  return ok(
    rows
      .map(r => ({
        player:  r.player  || '',
        team:    r.team    || '',
        goals:   toInt(r.goals,   0),
        assists: toInt(r.assists, 0),
      }))
      .filter(r => r.player)
      .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
  );
}
