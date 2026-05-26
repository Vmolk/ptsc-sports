import { ok, fail, handlePreflight, getSupabase } from './_shared.js';
import { event as staticEvent, sports, teams, athletes, schedule } from '../../data/eventData.js';

export async function handler(req) {
  const pre = handlePreflight(req);
  if (pre) return pre;
  if (req.httpMethod !== 'GET') return fail('Method not allowed', 405);

  const supabase = getSupabase();
  if (!supabase) {
    return ok({ event: staticEvent, sportsCount: sports.length, days: staticEvent.days,
      teamsCount: teams.length, athletes, matchesCount: schedule.length });
  }

  const [tourRes, sportRes, teamRes, matchRes] = await Promise.all([
    supabase.from('tournaments').select('id,name,organizer,start_date,end_date,days,status').order('start_date', { ascending: false }).limit(1).single(),
    supabase.from('sports').select('id', { count: 'exact', head: true }),
    supabase.from('teams').select('id', { count: 'exact', head: true }),
    supabase.from('matches').select('id', { count: 'exact', head: true }),
  ]);

  const eventData = tourRes.data
    ? { name: tourRes.data.name, organizer: tourRes.data.organizer,
        startDate: tourRes.data.start_date, endDate: tourRes.data.end_date,
        days: tourRes.data.days || staticEvent.days }
    : staticEvent;

  return ok({
    event: eventData,
    sportsCount: sportRes.count ?? sports.length,
    days: eventData.days,
    teamsCount: teamRes.count ?? teams.length,
    athletes,
    matchesCount: matchRes.count ?? schedule.length,
  });
}
