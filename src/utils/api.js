const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  let json;
  try { json = await res.json(); } catch { throw new Error(`Phản hồi không hợp lệ (HTTP ${res.status})`); }
  if (!res.ok || json.success === false) throw new Error(json.error || `Yêu cầu thất bại (HTTP ${res.status})`);
  return json.data;
}

export const api = {
  getStats:      ()            => request('/stats'),
  getSports:     ()            => request('/sports'),
  getTeams:      ()            => request('/teams'),
  getLeaderboard:()            => request('/leaderboard'),
  getBracket:    ()            => request('/bracket'),
  getScorers:    ()            => request('/scorers'),
  getGallery:    (day)         => request(day ? `/gallery?day=${day}` : '/gallery'),
  getSchedule:   (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(qs ? `/schedule?${qs}` : '/schedule');
  },
};
