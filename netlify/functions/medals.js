import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet, toInt } from './_sheets.js';

/* The 8 departments — always shown even with 0 medals */
const DEPT_TEAMS = [
  'Tổ Cơ khí đường ống',
  'Tổ Vật tư - Thiết bị',
  'Tổ Điện - Điều Khiển',
  'Tổ Kích Thước',
  'Tổ Hàn & NDT',
  'Tổ Tổng hợp',
  'Tổ Sơn',
  'Tổ Kết Cấu',
];

export async function handler(event) {
  const pre = handlePreflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const rows = await fetchSheet('medals');

  /* Static fallback: all 8 tổ with 0 medals */
  if (!rows?.length) {
    return ok(DEPT_TEAMS.map(name => ({ name, gold: 0, silver: 0, bronze: 0 })));
  }

  /* Build map from sheet rows (column: team | gold | silver | bronze) */
  const byName = {};
  rows.forEach(r => {
    const name = (r.team || r.name || '').trim();
    if (!name) return;
    byName[name] = {
      name,
      gold:   toInt(r.gold,   0),
      silver: toInt(r.silver, 0),
      bronze: toInt(r.bronze, 0),
    };
  });

  /* Ensure all 8 tổ appear; add any extra rows from the sheet too */
  const seen = new Set(DEPT_TEAMS);
  const result = DEPT_TEAMS.map(name => byName[name] ?? { name, gold: 0, silver: 0, bronze: 0 });
  rows.forEach(r => {
    const name = (r.team || r.name || '').trim();
    if (name && !seen.has(name)) result.push(byName[name]);
  });

  return ok(result);
}
