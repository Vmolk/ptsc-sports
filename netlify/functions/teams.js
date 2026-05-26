/** GET /api/teams -> list of competing teams. */
import { ok, fail, handlePreflight } from './_shared.js';
import { teams } from '../../data/eventData.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);
  return ok(teams);
}
