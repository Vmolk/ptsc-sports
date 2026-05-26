/**
 * data/eventData.js
 * ------------------------------------------------------------
 * Single source of truth for all event data served by the
 * Netlify Functions. Kept as plain JS so it's trivial to swap
 * for a real database later (each function just imports from here).
 *
 * To migrate to a DB: replace the exported arrays with queries.
 * ------------------------------------------------------------
 */

export const event = {
  name: 'QAQC SPORT TOURNAMENT',
  organizer: 'QAQC',
  // Mirrors VITE_EVENT_DATE; the backend exposes it too for SSR-less clients.
  startDate: '2026-07-01T08:00:00+07:00',
  endDate: '2026-07-02T17:00:00+07:00',
  days: 2,
};

export const sports = [
  { id: 'football',   name: 'Bóng đá',        icon: '⚽', teams: 8,  format: 'Loại trực tiếp', venue: 'Sân vận động A' },
  { id: 'badminton',  name: 'Cầu lông',       icon: '🏸', teams: 16, format: 'Vòng tròn + KO', venue: 'Nhà thi đấu B' },
  { id: 'tabletennis',name: 'Bóng bàn',       icon: '🏓', teams: 12, format: 'Vòng tròn + KO', venue: 'Nhà thi đấu B' },
  { id: 'tennis',     name: 'Quần vợt',       icon: '🎾', teams: 8,  format: 'Loại trực tiếp', venue: 'Sân Tennis C' },
  { id: 'volleyball', name: 'Bóng chuyền',    icon: '🏐', teams: 6,  format: 'Vòng tròn',      venue: 'Sân vận động A' },
  { id: 'chess',      name: 'Cờ vua',         icon: '♟️', teams: 20, format: 'Hệ Thụy Sĩ',     venue: 'Hội trường D' },
  { id: 'running',    name: 'Chạy việt dã',   icon: '🏃', teams: 0,  format: 'Cá nhân',        venue: 'Khu vực ngoài trời' },
  { id: 'tugofwar',   name: 'Kéo co',         icon: '🤝', teams: 10, format: 'Loại trực tiếp', venue: 'Sân vận động A' },
];

export const teams = [
  { id: 't1', name: 'Phòng Kỹ thuật',     short: 'KT',  color: '#e63946', members: 42 },
  { id: 't2', name: 'Phòng Vận hành',     short: 'VH',  color: '#1d3557', members: 38 },
  { id: 't3', name: 'Phòng Dự án',        short: 'DA',  color: '#2a9d8f', members: 35 },
  { id: 't4', name: 'Phòng Tài chính',    short: 'TC',  color: '#e9c46a', members: 28 },
  { id: 't5', name: 'Phòng Nhân sự',      short: 'NS',  color: '#f4a261', members: 24 },
  { id: 't6', name: 'Phòng An toàn',      short: 'AT',  color: '#264653', members: 31 },
];

// Leaderboard derives medal counts -> points (Gold 3, Silver 2, Bronze 1)
export const medals = [
  { teamId: 't1', gold: 5, silver: 3, bronze: 2 },
  { teamId: 't2', gold: 4, silver: 5, bronze: 3 },
  { teamId: 't3', gold: 3, silver: 2, bronze: 4 },
  { teamId: 't4', gold: 2, silver: 3, bronze: 5 },
  { teamId: 't5', gold: 1, silver: 2, bronze: 3 },
  { teamId: 't6', gold: 2, silver: 1, bronze: 2 },
];

export const schedule = [
  { id: 'm1', sportId: 'football',   round: 'Tứ kết',    day: 1, time: '08:00', venue: 'Sân vận động A', home: 't1', away: 't2', homeScore: 2, awayScore: 1, status: 'finished' },
  { id: 'm2', sportId: 'badminton',  round: 'Bán kết',   day: 1, time: '09:30', venue: 'Nhà thi đấu B',  home: 't3', away: 't4', homeScore: 21, awayScore: 18, status: 'finished' },
  { id: 'm3', sportId: 'volleyball', round: 'Vòng bảng', day: 1, time: '10:00', venue: 'Sân vận động A', home: 't5', away: 't6', homeScore: 3, awayScore: 0, status: 'finished' },
  { id: 'm4', sportId: 'tabletennis',round: 'Tứ kết',    day: 1, time: '13:00', venue: 'Nhà thi đấu B',  home: 't2', away: 't3', homeScore: null, awayScore: null, status: 'live' },
  { id: 'm5', sportId: 'tennis',     round: 'Bán kết',   day: 2, time: '08:00', venue: 'Sân Tennis C',   home: 't1', away: 't4', homeScore: null, awayScore: null, status: 'upcoming' },
  { id: 'm6', sportId: 'football',   round: 'Chung kết', day: 2, time: '15:00', venue: 'Sân vận động A', home: 't1', away: 't3', homeScore: null, awayScore: null, status: 'upcoming' },
  { id: 'm7', sportId: 'chess',      round: 'Vòng 5',    day: 2, time: '09:00', venue: 'Hội trường D',   home: 't6', away: 't5', homeScore: null, awayScore: null, status: 'upcoming' },
  { id: 'm8', sportId: 'tugofwar',   round: 'Chung kết', day: 2, time: '16:00', venue: 'Sân vận động A', home: 't2', away: 't4', homeScore: null, awayScore: null, status: 'upcoming' },
];

export const gallery = [
  { id: 'g1', title: 'Lễ khai mạc',        sportId: null,         day: 1, color: '#1d3557' },
  { id: 'g2', title: 'Trận bóng đá mở màn', sportId: 'football',   day: 1, color: '#2a9d8f' },
  { id: 'g3', title: 'Chung kết cầu lông',  sportId: 'badminton',  day: 1, color: '#e63946' },
  { id: 'g4', title: 'Cổ động viên',        sportId: null,         day: 1, color: '#e9c46a' },
  { id: 'g5', title: 'Bóng chuyền nữ',      sportId: 'volleyball', day: 2, color: '#f4a261' },
  { id: 'g6', title: 'Kéo co tập thể',      sportId: 'tugofwar',   day: 2, color: '#264653' },
  { id: 'g7', title: 'Trao huy chương',     sportId: null,         day: 2, color: '#457b9d' },
  { id: 'g8', title: 'Bế mạc',              sportId: null,         day: 2, color: '#8d99ae' },
];

// Athlete demographic breakdown used by the home stats section.
export const athletes = {
  total: 198,
  male: 122,
  female: 76,
  under45: 134,
  over45: 64,
};
