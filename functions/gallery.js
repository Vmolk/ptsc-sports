import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet, toInt } from './_sheets.js';
import { gallery as staticGallery } from '../data/eventData.js';

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const day  = event.queryStringParameters?.day;
  const rows = await fetchSheet('gallery');

  if (!rows?.length) {
    const items = day
      ? staticGallery.filter(g => String(g.day) === String(day))
      : staticGallery;
    return ok(items);
  }

  let data = rows.map(r => ({
    id:        r.id,
    caption:   r.caption || r.title || '',
    url:       r.url || '',           // Google Drive album link (click to open)
    thumbnail: r.thumbnail || '',     // Direct image URL for preview
    day:       r.day || '',           // Actual date string e.g. "05/07/2026"
  }));
  if (day) data = data.filter(g => g.day === day);
  return ok(data);
}
