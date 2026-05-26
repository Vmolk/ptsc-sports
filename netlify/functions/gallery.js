/** GET /api/gallery -> photo gallery items (optionally filter by ?day=). */
import { ok, fail, handlePreflight } from './_shared.js';
import { gallery } from '../../data/eventData.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const day = event.queryStringParameters?.day;
  const items = day
    ? gallery.filter((g) => String(g.day) === String(day))
    : gallery;
  return ok(items);
}
