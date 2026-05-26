/**
 * src/utils/api.js
 * ------------------------------------------------------------
 * Central API client. Every backend call goes through `request()`
 * so error handling, base URL, and response shape are consistent
 * and easy to debug in one place.
 * ------------------------------------------------------------
 */

const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Low-level request helper.
 * @param {string} path   e.g. "/stats"
 * @param {object} options fetch options
 * @returns {Promise<any>} the `data` field of the JSON envelope
 */
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Phản hồi không hợp lệ từ máy chủ (HTTP ${res.status})`);
  }

  if (!res.ok || json.success === false) {
    throw new Error(json.error || `Yêu cầu thất bại (HTTP ${res.status})`);
  }
  return json.data;
}

/* ---- Public API surface (one function per endpoint) ---- */
export const api = {
  getStats: () => request('/stats'),
  getSports: () => request('/sports'),
  getTeams: () => request('/teams'),
  getLeaderboard: () => request('/leaderboard'),
  getGallery: (day) => request(day ? `/gallery?day=${day}` : '/gallery'),
  getSchedule: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(qs ? `/schedule?${qs}` : '/schedule');
  },
  login: (username, password) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
};
