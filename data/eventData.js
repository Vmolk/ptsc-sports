/**
 * data/eventData.js
 * Static fallback data — used when GOOGLE_SHEET_ID is not set.
 * Teams: E&I, Painting, Dim, Vật tư, Tổng hợp, Kết cấu, Piping
 */

export const event = {
  name: 'QAQC SPORT TOURNAMENT',
  organizer: 'QAQC',
  startDate: '2026-07-01T08:00:00+07:00',
  endDate:   '2026-07-02T17:00:00+07:00',
  days: 2,
};

export const sports = [
  { id: 'football',    name: 'Bóng đá',     icon: '⚽', format: 'Vòng bảng + Knock-out', venue: 'Sân cỏ' },
  { id: 'badminton',   name: 'Cầu lông',    icon: '🏸', format: 'Knock-out',              venue: 'Nhà thi đấu' },
  { id: 'tabletennis', name: 'Bóng bàn',    icon: '🏓', format: 'Knock-out',              venue: 'Hội trường' },
  { id: 'volleyball',  name: 'Bóng chuyền', icon: '🏐', format: 'Vòng bảng',              venue: 'Sân thi đấu' },
];

export const teams = [
  { id: 'ei',      name: 'E&I',       short: 'E&I', color: '#3b82f6' },
  { id: 'painting',name: 'Painting',  short: 'PAI', color: '#e63946' },
  { id: 'dim',     name: 'Dim',       short: 'DIM', color: '#2a9d8f' },
  { id: 'vattu',   name: 'Vật tư',    short: 'VT',  color: '#f59e0b' },
  { id: 'tonghop', name: 'Tổng hợp',  short: 'TH',  color: '#8b5cf6' },
  { id: 'ketkau',  name: 'Kết cấu',   short: 'KK',  color: '#f97316' },
  { id: 'piping',  name: 'Piping',    short: 'PIP', color: '#10b981' },
];

export const medals = [
  { team: 'ei',      gold: 3, silver: 1, bronze: 2 },
  { team: 'painting',gold: 2, silver: 3, bronze: 1 },
  { team: 'dim',     gold: 2, silver: 1, bronze: 2 },
  { team: 'vattu',   gold: 1, silver: 2, bronze: 1 },
  { team: 'tonghop', gold: 1, silver: 1, bronze: 3 },
  { team: 'ketkau',  gold: 1, silver: 2, bronze: 0 },
  { team: 'piping',  gold: 0, silver: 1, bronze: 2 },
];

export const schedule = [
  // Ngày 1 — Vòng bảng bóng đá
  { id: 'm01', sportId: 'football',    date: '2026-07-01', day: 1, time: '07:30', round: 'group',  venue: 'Sân cỏ',      home: 'ei',      away: 'painting', homeScore: 3,  awayScore: 1,  status: 'finished' },
  { id: 'm02', sportId: 'football',    date: '2026-07-01', day: 1, time: '07:30', round: 'group',  venue: 'Sân cỏ',      home: 'dim',     away: 'vattu',    homeScore: 2,  awayScore: 2,  status: 'finished' },
  { id: 'm03', sportId: 'football',    date: '2026-07-01', day: 1, time: '08:30', round: 'group',  venue: 'Sân cỏ',      home: 'tonghop', away: 'ketkau',   homeScore: 1,  awayScore: 0,  status: 'finished' },
  { id: 'm04', sportId: 'football',    date: '2026-07-01', day: 1, time: '08:30', round: 'group',  venue: 'Sân cỏ',      home: 'piping',  away: 'ei',       homeScore: 0,  awayScore: 2,  status: 'finished' },
  { id: 'm05', sportId: 'football',    date: '2026-07-01', day: 1, time: '09:30', round: 'group',  venue: 'Sân cỏ',      home: 'painting',away: 'dim',      homeScore: 1,  awayScore: 3,  status: 'finished' },
  { id: 'm06', sportId: 'football',    date: '2026-07-01', day: 1, time: '09:30', round: 'group',  venue: 'Sân cỏ',      home: 'vattu',   away: 'tonghop',  homeScore: 1,  awayScore: 2,  status: 'finished' },
  // Ngày 1 — Cầu lông tứ kết
  { id: 'm07', sportId: 'badminton',   date: '2026-07-01', day: 1, time: '08:00', round: 'qf',     venue: 'Nhà thi đấu', home: 'ei',      away: 'vattu',    homeScore: 21, awayScore: 15, status: 'finished' },
  { id: 'm08', sportId: 'badminton',   date: '2026-07-01', day: 1, time: '09:00', round: 'qf',     venue: 'Nhà thi đấu', home: 'dim',     away: 'piping',   homeScore: 21, awayScore: 18, status: 'finished' },
  { id: 'm09', sportId: 'badminton',   date: '2026-07-01', day: 1, time: '10:00', round: 'sf',     venue: 'Nhà thi đấu', home: 'painting',away: 'ketkau',   homeScore: 21, awayScore: 19, status: 'finished' },
  { id: 'm10', sportId: 'badminton',   date: '2026-07-01', day: 1, time: '11:00', round: 'sf',     venue: 'Nhà thi đấu', home: 'ei',      away: 'dim',      homeScore: 21, awayScore: 14, status: 'finished' },
  // Ngày 1 — Bóng bàn
  { id: 'm11', sportId: 'tabletennis', date: '2026-07-01', day: 1, time: '08:00', round: 'qf',     venue: 'Hội trường',  home: 'tonghop', away: 'vattu',    homeScore: 11, awayScore: 7,  status: 'finished' },
  { id: 'm12', sportId: 'tabletennis', date: '2026-07-01', day: 1, time: '09:00', round: 'qf',     venue: 'Hội trường',  home: 'piping',  away: 'ketkau',   homeScore: 8,  awayScore: 11, status: 'finished' },
  // Ngày 1 — Bóng chuyền vòng bảng
  { id: 'm13', sportId: 'volleyball',  date: '2026-07-01', day: 1, time: '14:00', round: 'group',  venue: 'Sân thi đấu', home: 'ei',      away: 'ketkau',   homeScore: 2,  awayScore: 0,  status: 'finished' },
  { id: 'm14', sportId: 'volleyball',  date: '2026-07-01', day: 1, time: '15:00', round: 'group',  venue: 'Sân thi đấu', home: 'tonghop', away: 'piping',   homeScore: 2,  awayScore: 1,  status: 'finished' },
  // Ngày 2 — Bán kết & Chung kết bóng đá
  { id: 'm15', sportId: 'football',    date: '2026-07-02', day: 2, time: '07:30', round: 'sf',     venue: 'Sân cỏ',      home: 'ei',      away: 'dim',      homeScore: null, awayScore: null, status: '' },
  { id: 'm16', sportId: 'football',    date: '2026-07-02', day: 2, time: '07:30', round: 'sf',     venue: 'Sân cỏ',      home: 'tonghop', away: 'painting', homeScore: null, awayScore: null, status: '' },
  { id: 'm17', sportId: 'football',    date: '2026-07-02', day: 2, time: '09:00', round: '3rd',    venue: 'Sân cỏ',      home: 'dim',     away: 'painting', homeScore: null, awayScore: null, status: '' },
  { id: 'm18', sportId: 'football',    date: '2026-07-02', day: 2, time: '10:30', round: 'final',  venue: 'Sân cỏ',      home: 'ei',      away: 'tonghop',  homeScore: null, awayScore: null, status: '' },
  // Ngày 2 — Chung kết cầu lông & bóng bàn
  { id: 'm19', sportId: 'badminton',   date: '2026-07-02', day: 2, time: '08:00', round: '3rd',    venue: 'Nhà thi đấu', home: 'dim',     away: 'painting', homeScore: null, awayScore: null, status: '' },
  { id: 'm20', sportId: 'badminton',   date: '2026-07-02', day: 2, time: '09:30', round: 'final',  venue: 'Nhà thi đấu', home: 'ei',      away: 'painting', homeScore: null, awayScore: null, status: '' },
  { id: 'm21', sportId: 'tabletennis', date: '2026-07-02', day: 2, time: '08:00', round: 'sf',     venue: 'Hội trường',  home: 'tonghop', away: 'ketkau',   homeScore: null, awayScore: null, status: '' },
  { id: 'm22', sportId: 'tabletennis', date: '2026-07-02', day: 2, time: '09:00', round: 'final',  venue: 'Hội trường',  home: 'tonghop', away: 'ei',       homeScore: null, awayScore: null, status: '' },
  // Ngày 2 — Chung kết bóng chuyền
  { id: 'm23', sportId: 'volleyball',  date: '2026-07-02', day: 2, time: '14:00', round: 'final',  venue: 'Sân thi đấu', home: 'ei',      away: 'tonghop',  homeScore: null, awayScore: null, status: '' },
];

export const gallery = [
  { id: 'g1', url: '', caption: 'Lễ khai mạc',         day: 1 },
  { id: 'g2', url: '', caption: 'Trận bóng đá mở màn', day: 1 },
  { id: 'g3', url: '', caption: 'Chung kết cầu lông',  day: 2 },
  { id: 'g4', url: '', caption: 'Trao huy chương',     day: 2 },
];

export const individualMedals = [
  { athlete: 'Nguyễn Văn A', dept: 'E&I',     sport: 'Cầu lông',    medal: 'gold'   },
  { athlete: 'Nguyễn Văn A', dept: 'E&I',     sport: 'Bóng bàn',    medal: 'silver' },
  { athlete: 'Trần Thị B',   dept: 'Painting', sport: 'Cầu lông',   medal: 'silver' },
  { athlete: 'Lê Văn C',     dept: 'Dim',      sport: 'Bóng bàn',   medal: 'gold'   },
  { athlete: 'Phạm Thị D',   dept: 'Piping',   sport: 'Bóng bàn',   medal: 'bronze' },
  { athlete: 'Hoàng Văn E',  dept: 'Tổng hợp', sport: 'Cầu lông',   medal: 'bronze' },
  { athlete: 'Vũ Thị F',     dept: 'Kết cấu',  sport: 'Bóng bàn',   medal: 'bronze' },
];

export const athletes = {
  total: 210,
  male: 134,
  female: 76,
};
