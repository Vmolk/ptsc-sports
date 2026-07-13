import { ok, fail, handlePreflight } from './_shared.js';
import { fetchSheet, toInt } from './_sheets.js';
import { event as se, sports as ss, teams as st, athletes as sa, schedule as sch } from '../data/eventData.js';

export async function handler(req) {
  const pre = handlePreflight(req);
  if (pre) return pre;
  if (req.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const [evRows, sportsRows, teamsRows, matchRows, athleteRows] = await Promise.all([
    fetchSheet('event'),
    fetchSheet('sports'),
    fetchSheet('teams'),
    fetchSheet('matches'),
    fetchSheet('athletes'),
  ]);

  // event meta
  let event = se;
  if (evRows?.length) {
    const kv = Object.fromEntries(evRows.map((r) => [r.key, r.value]));
    event = {
      name: kv.name || se.name,
      organizer: kv.organizer || se.organizer,
      startDate: kv.start_date || se.startDate,
      endDate: kv.end_date || se.endDate,
      days: toInt(kv.days, se.days),
      location: kv.location || '',
    };
  }

  // athletes
  let athletes = sa;
  if (athleteRows?.length) {
    const kv = Object.fromEntries(athleteRows.map((r) => [r.key, r.value]));
    athletes = {
      total:  toInt(kv.total, sa.total),
      male:   toInt(kv.male, sa.male),
      female: toInt(kv.female, sa.female),
    };
  }

  /* Allow overriding teamsCount via event sheet key "teams_count" */
  let teamsCount = teamsRows?.length ?? st.length;
  if (evRows?.length) {
    const kv = Object.fromEntries(evRows.map(r => [r.key, r.value]));
    if (kv.teams_count) teamsCount = toInt(kv.teams_count, teamsCount);
  }

  return ok({
    event,
    sportsCount:  sportsRows?.length  || ss.length,
    days:         event.days,
    teamsCount,
    athletes,
    matchesCount: matchRows?.length   || sch.length,
  });
}
