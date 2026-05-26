/**
 * GET /api/stats -> aggregated numbers for the homepage counters
 * (sports count, days, teams, athletes, gender split, age split, matches)
 * plus the event meta + countdown target date.
 */
import { ok, fail, handlePreflight } from './_shared.js';
import { event, sports, teams, athletes, schedule } from '../../data/eventData.js';

export async function handler(req) {
  const pre = handlePreflight(req);
  if (pre) return pre;
  if (req.httpMethod !== 'GET') return fail('Method not allowed', 405);

  return ok({
    event,
    sportsCount: sports.length,
    days: event.days,
    teamsCount: teams.length,
    athletes,
    matchesCount: schedule.length,
  });
}
