import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet, toInt } from './_sheets.js';
import { gallery as staticGallery } from '../../data/eventData.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const day = event.queryStringParameters?.day;
  const rows = await fetchSheet('gallery');

  if (!rows?.length) {
    const items = day ? staticGallery.filter((g) => String(g.day) === String(day)) : staticGallery;
    return ok(items);
  }

  let data = rows.map((r) => ({
    id:      r.id,
    title:   r.title,
    url:     r.url || '',
    sportId: r.sport_id || '',
    day:     toInt(r.day, 1),
    color:   r.color || '#1d3557',
  }));
  if (day) data = data.filter((g) => String(g.day) === String(day));
  return ok(data);
}
