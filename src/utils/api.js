const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function getToken() { return localStorage.getItem('qaqc_token'); }

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  let json;
  try { json = await res.json(); } catch { throw new Error(`Phản hồi không hợp lệ từ máy chủ (HTTP ${res.status})`); }
  if (!res.ok || json.success === false) throw new Error(json.error || `Yêu cầu thất bại (HTTP ${res.status})`);
  return json.data;
}

/* ---- Public API ---- */
export const api = {
  getStats: () => request('/stats'),
  getSports: () => request('/sports'),
  getTeams: () => request('/teams'),
  getLeaderboard: () => request('/leaderboard'),
  getGallery: (day) => request(day ? `/gallery?day=${day}` : '/gallery'),
  getSchedule: (params = {}) => { const qs = new URLSearchParams(params).toString(); return request(qs ? `/schedule?${qs}` : '/schedule'); },
  login: (username, password) => request('/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
};

/* ---- Admin API (requires auth token) ---- */
export const adminApi = {
  // Stats
  getStats: () => request('/stats'),

  // Tournaments
  getTournaments: () => request('/tournaments'),
  getTournament: (id) => request(`/tournaments?id=${id}`),
  createTournament: (data) => request('/tournaments', { method: 'POST', body: JSON.stringify(data) }),
  updateTournament: (id, data) => request(`/tournaments?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTournament: (id) => request(`/tournaments?id=${id}`, { method: 'DELETE' }),

  // Sports
  getSports: () => request('/sports'),
  createSport: (data) => request('/sports', { method: 'POST', body: JSON.stringify(data) }),
  updateSport: (id, data) => request(`/sports?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSport: (id) => request(`/sports?id=${id}`, { method: 'DELETE' }),

  // Matches
  getMatches: (params = {}) => { const qs = new URLSearchParams(params).toString(); return request(qs ? `/matches?${qs}` : '/matches'); },
  createMatch: (data) => request('/matches', { method: 'POST', body: JSON.stringify(data) }),
  updateMatch: (id, data) => request(`/matches?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMatch: (id) => request(`/matches?id=${id}`, { method: 'DELETE' }),

  // Teams
  getTeams: () => request('/teams'),
  createTeam: (data) => request('/teams', { method: 'POST', body: JSON.stringify(data) }),
  updateTeam: (id, data) => request(`/teams?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTeam: (id) => request(`/teams?id=${id}`, { method: 'DELETE' }),

  // Gallery
  getGallery: () => request('/gallery'),
  createGalleryItem: (data) => request('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  deleteGalleryItem: (id) => request(`/gallery?id=${id}`, { method: 'DELETE' }),

  // Upload
  uploadImage: (data) => request('/upload', { method: 'POST', body: JSON.stringify(data) }),

  // Users (admin only)
  getUsers: () => request('/users'),
  createUser: (data) => request('/auth-register', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => request(`/users?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/users?id=${id}`, { method: 'DELETE' }),
};
