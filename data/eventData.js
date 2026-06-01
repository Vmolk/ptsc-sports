/**
 * data/eventData.js
 * Static fallback — used when GOOGLE_SHEET_ID is not set.
 * 5 sports: football, badminton, pickleball, waterhandball, tugofwar
 * 7 teams: E&I, Painting, Dim, Vật tư, Tổng hợp, Kết cấu, Piping
 */

export const event = {
  name:      'HỘI THAO PHÒNG QUẢN LÝ CHẤT LƯỢNG 2026',
  organizer: 'PTSC M&C',
  startDate: '2026-07-05T08:00:00+07:00',
  endDate:   '2026-07-18T17:00:00+07:00',
  days:      14,
};

export const sports = [
  { id: 'football',     name: 'Bóng đá',      icon: '⚽', format: 'Vòng bảng + Bán kết + Chung kết',                    venue: 'Sân cỏ nhân tạo', teams: 6 },
  { id: 'badminton',    name: 'Cầu lông',      icon: '🏸', format: 'Đơn nam · Đơn nữ · Đôi nam · Đôi nữ — Tứ kết → CK', venue: 'Nhà thi đấu',     teams: 7 },
  { id: 'pickleball',   name: 'Pickleball',    icon: '🏓', format: 'Đôi nam — Tứ kết → Bán kết → Chung kết',             venue: 'Sân ngoài trời',  teams: 7 },
  { id: 'waterhandball',name: 'Bóng ném nước', icon: '🤽', format: 'Bán kết + Chung kết',                                 venue: 'Hồ bơi PTSC',     teams: 4 },
  { id: 'tugofwar',     name: 'Kéo co',        icon: '🪢', format: 'Thi đấu theo tổ — Bán kết + Chung kết',              venue: 'Bãi thi đấu',     teams: 7 },
];

export const teams = [
  { id: 'ei',      name: 'E&I',      short: 'E&I', color: '#3b82f6', logo: '' },
  { id: 'painting',name: 'Painting', short: 'PAI', color: '#e63946', logo: '' },
  { id: 'dim',     name: 'Dim',      short: 'DIM', color: '#2a9d8f', logo: '' },
  { id: 'vattu',   name: 'Vật tư',   short: 'VT',  color: '#f59e0b', logo: '' },
  { id: 'tonghop', name: 'Tổng hợp', short: 'TH',  color: '#8b5cf6', logo: '' },
  { id: 'ketkau',  name: 'Kết cấu',  short: 'KK',  color: '#f97316', logo: '' },
  { id: 'piping',  name: 'Piping',   short: 'PIP', color: '#10b981', logo: '' },
];

export const medals = [
  { team: 'ei',      gold: 2, silver: 1, bronze: 1 },
  { team: 'dim',     gold: 1, silver: 2, bronze: 1 },
  { team: 'tonghop', gold: 1, silver: 1, bronze: 2 },
  { team: 'piping',  gold: 1, silver: 1, bronze: 0 },
  { team: 'painting',gold: 0, silver: 1, bronze: 2 },
  { team: 'ketkau',  gold: 0, silver: 0, bronze: 1 },
  { team: 'vattu',   gold: 0, silver: 0, bronze: 1 },
];

export const individualMedals = [
  { athlete: 'Nguyễn Văn An',    dept: 'E&I',      sport: 'Cầu lông',      medal: 'gold'   },
  { athlete: 'Trần Thị Lan',     dept: 'E&I',      sport: 'Pickleball',    medal: 'silver' },
  { athlete: 'Đinh Mạnh Tiến',   dept: 'Dim',      sport: 'Cầu lông',      medal: 'gold'   },
  { athlete: 'Lê Thanh Tuấn',    dept: 'Tổng hợp', sport: 'Kéo co',        medal: 'gold'   },
  { athlete: 'Hoàng Minh Đức',   dept: 'Piping',   sport: 'Pickleball',    medal: 'silver' },
  { athlete: 'Phạm Thị Hoa',     dept: 'Painting', sport: 'Cầu lông',      medal: 'bronze' },
  { athlete: 'Vũ Thị Thu Thảo',  dept: 'Kết cấu',  sport: 'Pickleball',    medal: 'bronze' },
];

export const schedule = [
  // ═══════════════════════════════════════
  // ⚽  BÓNG ĐÁ
  // ═══════════════════════════════════════
  // Vòng bảng — Bảng A: E&I, Painting, Piping
  { id: 'f01', sportId: 'football', groupName: 'A', round: 'group', date: '2026-07-05', day: 1, time: '07:00', venue: 'Sân cỏ', home: 'ei',      away: 'painting', homeScore: 2,    awayScore: 1,    status: 'finished' },
  { id: 'f02', sportId: 'football', groupName: 'A', round: 'group', date: '2026-07-05', day: 1, time: '07:45', venue: 'Sân cỏ', home: 'painting', away: 'piping',  homeScore: 0,    awayScore: 3,    status: 'finished' },
  { id: 'f03', sportId: 'football', groupName: 'A', round: 'group', date: '2026-07-05', day: 1, time: '08:30', venue: 'Sân cỏ', home: 'ei',      away: 'piping',   homeScore: 1,    awayScore: 1,    status: 'finished' },
  // Vòng bảng — Bảng B: Dim, Vật tư, Tổng hợp
  { id: 'f04', sportId: 'football', groupName: 'B', round: 'group', date: '2026-07-05', day: 1, time: '07:00', venue: 'Sân cỏ', home: 'dim',     away: 'vattu',    homeScore: 3,    awayScore: 0,    status: 'finished' },
  { id: 'f05', sportId: 'football', groupName: 'B', round: 'group', date: '2026-07-05', day: 1, time: '07:45', venue: 'Sân cỏ', home: 'vattu',   away: 'tonghop',  homeScore: 1,    awayScore: 2,    status: 'finished' },
  { id: 'f06', sportId: 'football', groupName: 'B', round: 'group', date: '2026-07-05', day: 1, time: '08:30', venue: 'Sân cỏ', home: 'dim',     away: 'tonghop',  homeScore: 2,    awayScore: 1,    status: 'finished' },
  // Bán kết
  { id: 'f07', sportId: 'football', round: 'sf',    date: '2026-07-12', day: 2, time: '07:30', venue: 'Sân cỏ', home: 'ei',    away: 'dim',     homeScore: null, awayScore: null, status: '' },
  { id: 'f08', sportId: 'football', round: 'sf',    date: '2026-07-12', day: 2, time: '07:30', venue: 'Sân cỏ', home: 'piping',away: 'tonghop', homeScore: null, awayScore: null, status: '' },
  // Chung kết (không có trận tranh hạng 3)
  { id: 'f09', sportId: 'football', round: 'final', date: '2026-07-12', day: 2, time: '10:30', venue: 'Sân cỏ', home: 'ei',    away: 'piping',  homeScore: null, awayScore: null, status: '' },

  // ═══════════════════════════════════════
  // 🏸  CẦU LÔNG  (4 nội dung: Đơn nam · Đơn nữ · Đôi nam · Đôi nữ)
  // ═══════════════════════════════════════
  // Đơn nam
  { id: 'b_dn01', sportId: 'badminton', category: 'Đơn nam', round: 'qf', date: '2026-07-05', day: 1, time: '08:00', venue: 'Nhà thi đấu', home: 'ei',      away: 'vattu',   homeScore: 21, awayScore: 12, status: 'finished' },
  { id: 'b_dn02', sportId: 'badminton', category: 'Đơn nam', round: 'qf', date: '2026-07-05', day: 1, time: '08:00', venue: 'Nhà thi đấu', home: 'painting',away: 'tonghop', homeScore: 15, awayScore: 21, status: 'finished' },
  { id: 'b_dn03', sportId: 'badminton', category: 'Đơn nam', round: 'qf', date: '2026-07-05', day: 1, time: '09:00', venue: 'Nhà thi đấu', home: 'dim',     away: 'ketkau',  homeScore: 21, awayScore: 19, status: 'finished' },
  { id: 'b_dn04', sportId: 'badminton', category: 'Đơn nam', round: 'qf', date: '2026-07-05', day: 1, time: '09:00', venue: 'Nhà thi đấu', home: 'piping',  away: 'vattu',   homeScore: 21, awayScore: 16, status: 'finished' },
  { id: 'b_dn05', sportId: 'badminton', category: 'Đơn nam', round: 'sf', date: '2026-07-05', day: 1, time: '11:00', venue: 'Nhà thi đấu', home: 'ei',      away: 'tonghop', homeScore: null, awayScore: null, status: '' },
  { id: 'b_dn06', sportId: 'badminton', category: 'Đơn nam', round: 'sf', date: '2026-07-05', day: 1, time: '11:00', venue: 'Nhà thi đấu', home: 'dim',     away: 'piping',  homeScore: null, awayScore: null, status: '' },
  { id: 'b_dn07', sportId: 'badminton', category: 'Đơn nam', round: 'final', date: '2026-07-12', day: 2, time: '09:00', venue: 'Nhà thi đấu', home: 'ei', away: 'dim', homeScore: null, awayScore: null, status: '' },
  // Đơn nữ
  { id: 'b_dnu01', sportId: 'badminton', category: 'Đơn nữ', round: 'qf', date: '2026-07-05', day: 1, time: '08:30', venue: 'Nhà thi đấu', home: 'ei',      away: 'painting',homeScore: 21, awayScore: 14, status: 'finished' },
  { id: 'b_dnu02', sportId: 'badminton', category: 'Đơn nữ', round: 'qf', date: '2026-07-05', day: 1, time: '08:30', venue: 'Nhà thi đấu', home: 'dim',     away: 'vattu',   homeScore: 21, awayScore: 17, status: 'finished' },
  { id: 'b_dnu03', sportId: 'badminton', category: 'Đơn nữ', round: 'qf', date: '2026-07-05', day: 1, time: '09:30', venue: 'Nhà thi đấu', home: 'tonghop', away: 'ketkau',  homeScore: 21, awayScore: 13, status: 'finished' },
  { id: 'b_dnu04', sportId: 'badminton', category: 'Đơn nữ', round: 'qf', date: '2026-07-05', day: 1, time: '09:30', venue: 'Nhà thi đấu', home: 'piping',  away: 'painting',homeScore: 16, awayScore: 21, status: 'finished' },
  { id: 'b_dnu05', sportId: 'badminton', category: 'Đơn nữ', round: 'sf', date: '2026-07-05', day: 1, time: '11:30', venue: 'Nhà thi đấu', home: 'ei',      away: 'dim',     homeScore: null, awayScore: null, status: '' },
  { id: 'b_dnu06', sportId: 'badminton', category: 'Đơn nữ', round: 'sf', date: '2026-07-05', day: 1, time: '11:30', venue: 'Nhà thi đấu', home: 'tonghop', away: 'painting',homeScore: null, awayScore: null, status: '' },
  { id: 'b_dnu07', sportId: 'badminton', category: 'Đơn nữ', round: 'final', date: '2026-07-12', day: 2, time: '09:30', venue: 'Nhà thi đấu', home: 'ei', away: 'tonghop', homeScore: null, awayScore: null, status: '' },
  // Đôi nam
  { id: 'b_don01', sportId: 'badminton', category: 'Đôi nam', round: 'sf', date: '2026-07-07', day: 1, time: '14:00', venue: 'Nhà thi đấu', home: 'ei',     away: 'dim',     homeScore: 21, awayScore: 18, status: 'finished' },
  { id: 'b_don02', sportId: 'badminton', category: 'Đôi nam', round: 'sf', date: '2026-07-07', day: 1, time: '14:00', venue: 'Nhà thi đấu', home: 'piping', away: 'tonghop', homeScore: 21, awayScore: 15, status: 'finished' },
  { id: 'b_don03', sportId: 'badminton', category: 'Đôi nam', round: 'final', date: '2026-07-12', day: 2, time: '10:00', venue: 'Nhà thi đấu', home: 'ei', away: 'piping', homeScore: null, awayScore: null, status: '' },
  // Đôi nữ
  { id: 'b_donu01', sportId: 'badminton', category: 'Đôi nữ', round: 'sf', date: '2026-07-07', day: 1, time: '15:00', venue: 'Nhà thi đấu', home: 'painting',away: 'vattu',  homeScore: 21, awayScore: 11, status: 'finished' },
  { id: 'b_donu02', sportId: 'badminton', category: 'Đôi nữ', round: 'sf', date: '2026-07-07', day: 1, time: '15:00', venue: 'Nhà thi đấu', home: 'ketkau', away: 'tonghop', homeScore: 15, awayScore: 21, status: 'finished' },
  { id: 'b_donu03', sportId: 'badminton', category: 'Đôi nữ', round: 'final', date: '2026-07-12', day: 2, time: '10:30', venue: 'Nhà thi đấu', home: 'painting', away: 'tonghop', homeScore: null, awayScore: null, status: '' },

  // ═══════════════════════════════════════
  // 🏓  PICKLEBALL  (chỉ Đôi nam)
  // ═══════════════════════════════════════
  { id: 'p01', sportId: 'pickleball', category: 'Đôi nam', round: 'qf',    date: '2026-07-05', day: 1, time: '10:00', venue: 'Sân ngoài trời', home: 'ei',      away: 'ketkau',  homeScore: 11,   awayScore: 7,    status: 'finished' },
  { id: 'p02', sportId: 'pickleball', category: 'Đôi nam', round: 'qf',    date: '2026-07-05', day: 1, time: '10:00', venue: 'Sân ngoài trời', home: 'vattu',   away: 'painting',homeScore: 11,   awayScore: 8,    status: 'finished' },
  { id: 'p03', sportId: 'pickleball', category: 'Đôi nam', round: 'qf',    date: '2026-07-05', day: 1, time: '11:00', venue: 'Sân ngoài trời', home: 'dim',     away: 'tonghop', homeScore: 11,   awayScore: 9,    status: 'finished' },
  { id: 'p04', sportId: 'pickleball', category: 'Đôi nam', round: 'qf',    date: '2026-07-05', day: 1, time: '11:00', venue: 'Sân ngoài trời', home: 'piping',  away: 'painting',homeScore: 7,    awayScore: 11,   status: 'finished' },
  { id: 'p05', sportId: 'pickleball', category: 'Đôi nam', round: 'sf',    date: '2026-07-12', day: 2, time: '08:00', venue: 'Sân ngoài trời', home: 'ei',      away: 'vattu',   homeScore: null, awayScore: null, status: '' },
  { id: 'p06', sportId: 'pickleball', category: 'Đôi nam', round: 'sf',    date: '2026-07-12', day: 2, time: '08:00', venue: 'Sân ngoài trời', home: 'dim',     away: 'painting',homeScore: null, awayScore: null, status: '' },
  { id: 'p07', sportId: 'pickleball', category: 'Đôi nam', round: 'final', date: '2026-07-12', day: 2, time: '10:00', venue: 'Sân ngoài trời', home: 'ei',      away: 'dim',     homeScore: null, awayScore: null, status: '' },

  // ═══════════════════════════════════════
  // 🤽  BÓNG NÉM NƯỚC
  // ═══════════════════════════════════════
  { id: 'w01', sportId: 'waterhandball', round: 'sf',    date: '2026-07-05', day: 1, time: '13:00', venue: 'Hồ bơi PTSC', home: 'ei',      away: 'dim',     homeScore: 6,    awayScore: 4,    status: 'finished' },
  { id: 'w02', sportId: 'waterhandball', round: 'sf',    date: '2026-07-05', day: 1, time: '14:00', venue: 'Hồ bơi PTSC', home: 'tonghop', away: 'painting',homeScore: 3,    awayScore: 5,    status: 'finished' },
  { id: 'w03', sportId: 'waterhandball', round: 'final', date: '2026-07-12', day: 2, time: '11:00', venue: 'Hồ bơi PTSC', home: 'ei',      away: 'painting',homeScore: null, awayScore: null, status: '' },

  // ═══════════════════════════════════════
  // 🪢  KÉO CO
  // ═══════════════════════════════════════
  { id: 'k01', sportId: 'tugofwar', round: 'sf',    date: '2026-07-05', day: 1, time: '14:00', venue: 'Bãi thi đấu', home: 'ei',      away: 'piping',  homeScore: 2,    awayScore: 1,    status: 'finished' },
  { id: 'k02', sportId: 'tugofwar', round: 'sf',    date: '2026-07-05', day: 1, time: '15:00', venue: 'Bãi thi đấu', home: 'dim',     away: 'tonghop', homeScore: 1,    awayScore: 2,    status: 'finished' },
  { id: 'k03', sportId: 'tugofwar', round: 'final', date: '2026-07-12', day: 2, time: '15:00', venue: 'Bãi thi đấu', home: 'ei',      away: 'tonghop', homeScore: null, awayScore: null, status: '' },
];

export const gallery = [
  { id: 'g1', url: '', caption: 'Lễ khai mạc',         day: 1 },
  { id: 'g2', url: '', caption: 'Trận bóng đá mở màn', day: 1 },
  { id: 'g3', url: '', caption: 'Thi đấu Pickleball',  day: 1 },
  { id: 'g4', url: '', caption: 'Chung kết Cầu lông',  day: 2 },
  { id: 'g5', url: '', caption: 'Kéo co hấp dẫn',      day: 2 },
  { id: 'g6', url: '', caption: 'Trao huy chương',      day: 2 },
];

/* Top scorers (bóng đá) */
export const scorers = [
  { player: 'Hoàng Minh Đức',   team: 'Piping',    goals: 4, assists: 1 },
  { player: 'Đinh Mạnh Tiến',   team: 'Dim',       goals: 3, assists: 2 },
  { player: 'Nguyễn Văn An',    team: 'E&I',       goals: 2, assists: 3 },
  { player: 'Lê Thanh Tuấn',    team: 'Tổng hợp',  goals: 2, assists: 1 },
  { player: 'Nguyễn Hải Long',  team: 'Painting',  goals: 1, assists: 0 },
];

/* Participants — VĐV theo môn và tổ */
export const participants = [
  // ⚽ BÓNG ĐÁ
  { sportId: 'football', teamId: 'ei',       name: 'Nguyễn Văn An',      category: 'Nam' },
  { sportId: 'football', teamId: 'ei',       name: 'Trần Quốc Bảo',      category: 'Nam' },
  { sportId: 'football', teamId: 'ei',       name: 'Lê Minh Tuấn',       category: 'Nam' },
  { sportId: 'football', teamId: 'ei',       name: 'Phạm Đức Huy',       category: 'Nam' },
  { sportId: 'football', teamId: 'painting', name: 'Nguyễn Hải Long',    category: 'Nam' },
  { sportId: 'football', teamId: 'painting', name: 'Trần Văn Mạnh',      category: 'Nam' },
  { sportId: 'football', teamId: 'painting', name: 'Đặng Quốc Cường',    category: 'Nam' },
  { sportId: 'football', teamId: 'piping',   name: 'Hoàng Minh Đức',     category: 'Nam' },
  { sportId: 'football', teamId: 'piping',   name: 'Vũ Thanh Hà',        category: 'Nam' },
  { sportId: 'football', teamId: 'piping',   name: 'Bùi Văn Tùng',       category: 'Nam' },
  { sportId: 'football', teamId: 'piping',   name: 'Mai Chân Hoà',       category: 'Nam' },
  { sportId: 'football', teamId: 'dim',      name: 'Đinh Mạnh Tiến',     category: 'Nam' },
  { sportId: 'football', teamId: 'dim',      name: 'Lê Văn Khoa',        category: 'Nam' },
  { sportId: 'football', teamId: 'dim',      name: 'Phạm Trung Hiếu',    category: 'Nam' },
  { sportId: 'football', teamId: 'vattu',    name: 'Nguyễn Quang Vinh',  category: 'Nam' },
  { sportId: 'football', teamId: 'vattu',    name: 'Trần Anh Dũng',      category: 'Nam' },
  { sportId: 'football', teamId: 'vattu',    name: 'Phạm Văn Hùng',      category: 'Nam' },
  { sportId: 'football', teamId: 'tonghop',  name: 'Lê Thanh Tuấn',      category: 'Nam' },
  { sportId: 'football', teamId: 'tonghop',  name: 'Nguyễn Trung Kiên',  category: 'Nam' },
  { sportId: 'football', teamId: 'tonghop',  name: 'Vũ Ngọc Sơn',        category: 'Nam' },

  // 🏸 CẦU LÔNG (Đơn nam · Đơn nữ · Đôi nam · Đôi nữ)
  { sportId: 'badminton', teamId: 'ei',       name: 'Nguyễn Văn An',        category: 'Đơn nam' },
  { sportId: 'badminton', teamId: 'ei',       name: 'Trần Thị Lan',         category: 'Đơn nữ'  },
  { sportId: 'badminton', teamId: 'ei',       name: 'Lê Minh Tuấn',         category: 'Đôi nam' },
  { sportId: 'badminton', teamId: 'ei',       name: 'Phạm Đức Huy',         category: 'Đôi nam' },
  { sportId: 'badminton', teamId: 'painting', name: 'Nguyễn Hải Long',      category: 'Đơn nam' },
  { sportId: 'badminton', teamId: 'painting', name: 'Phạm Thị Hoa',         category: 'Đơn nữ'  },
  { sportId: 'badminton', teamId: 'painting', name: 'Trần Văn Mạnh',        category: 'Đôi nam' },
  { sportId: 'badminton', teamId: 'painting', name: 'Đặng Thị Hồng',        category: 'Đôi nữ'  },
  { sportId: 'badminton', teamId: 'dim',      name: 'Đinh Mạnh Tiến',       category: 'Đơn nam' },
  { sportId: 'badminton', teamId: 'dim',      name: 'Nguyễn Thị Thu Thuỳ',  category: 'Đơn nữ'  },
  { sportId: 'badminton', teamId: 'vattu',    name: 'Trần Văn Bình',        category: 'Đơn nam' },
  { sportId: 'badminton', teamId: 'vattu',    name: 'Lê Thị Thuận',         category: 'Đơn nữ'  },
  { sportId: 'badminton', teamId: 'tonghop',  name: 'Lê Thanh Tuấn',        category: 'Đơn nam' },
  { sportId: 'badminton', teamId: 'tonghop',  name: 'Nguyễn Quỳnh Hoa',     category: 'Đơn nữ'  },
  { sportId: 'badminton', teamId: 'tonghop',  name: 'Nguyễn Trung Kiên',    category: 'Đôi nam' },
  { sportId: 'badminton', teamId: 'tonghop',  name: 'Vũ Ngọc Hương',        category: 'Đôi nữ'  },
  { sportId: 'badminton', teamId: 'ketkau',   name: 'Hoàng Văn Em',         category: 'Đơn nam' },
  { sportId: 'badminton', teamId: 'ketkau',   name: 'Vũ Thị Thu Thảo',      category: 'Đơn nữ'  },
  { sportId: 'badminton', teamId: 'piping',   name: 'Mai Chân Hoà',         category: 'Đơn nam' },
  { sportId: 'badminton', teamId: 'piping',   name: 'Nguyễn Thị Phương Anh',category: 'Đơn nữ'  },

  // 🏓 PICKLEBALL (chỉ Đôi nam)
  { sportId: 'pickleball', teamId: 'ei',       name: 'Nguyễn Văn An',     category: 'Đôi nam' },
  { sportId: 'pickleball', teamId: 'ei',       name: 'Lê Minh Tuấn',      category: 'Đôi nam' },
  { sportId: 'pickleball', teamId: 'painting', name: 'Nguyễn Hải Long',   category: 'Đôi nam' },
  { sportId: 'pickleball', teamId: 'painting', name: 'Trần Văn Mạnh',     category: 'Đôi nam' },
  { sportId: 'pickleball', teamId: 'dim',      name: 'Đinh Mạnh Tiến',    category: 'Đôi nam' },
  { sportId: 'pickleball', teamId: 'dim',      name: 'Lê Văn Khoa',       category: 'Đôi nam' },
  { sportId: 'pickleball', teamId: 'vattu',    name: 'Trần Văn Bình',     category: 'Đôi nam' },
  { sportId: 'pickleball', teamId: 'vattu',    name: 'Nguyễn Quang Vinh', category: 'Đôi nam' },
  { sportId: 'pickleball', teamId: 'tonghop',  name: 'Lê Thanh Tuấn',    category: 'Đôi nam' },
  { sportId: 'pickleball', teamId: 'tonghop',  name: 'Nguyễn Trung Kiên', category: 'Đôi nam' },
  { sportId: 'pickleball', teamId: 'ketkau',   name: 'Hoàng Văn Em',      category: 'Đôi nam' },
  { sportId: 'pickleball', teamId: 'ketkau',   name: 'Phạm Quang Hiệu',   category: 'Đôi nam' },
  { sportId: 'pickleball', teamId: 'piping',   name: 'Mai Chân Hoà',      category: 'Đôi nam' },
  { sportId: 'pickleball', teamId: 'piping',   name: 'Bùi Văn Tùng',      category: 'Đôi nam' },

  // 🤽 BÓNG NÉM NƯỚC
  { sportId: 'waterhandball', teamId: 'ei',       name: 'Nguyễn Văn An',    category: 'Nam' },
  { sportId: 'waterhandball', teamId: 'ei',       name: 'Trần Quốc Bảo',    category: 'Nam' },
  { sportId: 'waterhandball', teamId: 'ei',       name: 'Lê Minh Tuấn',     category: 'Nam' },
  { sportId: 'waterhandball', teamId: 'ei',       name: 'Phạm Đức Huy',     category: 'Nam' },
  { sportId: 'waterhandball', teamId: 'dim',      name: 'Đinh Mạnh Tiến',   category: 'Nam' },
  { sportId: 'waterhandball', teamId: 'dim',      name: 'Lê Văn Khoa',      category: 'Nam' },
  { sportId: 'waterhandball', teamId: 'dim',      name: 'Phạm Trung Hiếu',  category: 'Nam' },
  { sportId: 'waterhandball', teamId: 'tonghop',  name: 'Lê Thanh Tuấn',   category: 'Nam' },
  { sportId: 'waterhandball', teamId: 'tonghop',  name: 'Nguyễn Trung Kiên',category: 'Nam' },
  { sportId: 'waterhandball', teamId: 'painting', name: 'Nguyễn Hải Long',  category: 'Nam' },
  { sportId: 'waterhandball', teamId: 'painting', name: 'Trần Văn Mạnh',    category: 'Nam' },
  { sportId: 'waterhandball', teamId: 'painting', name: 'Đặng Quốc Cường',  category: 'Nam' },

  // 🪢 KÉO CO (thi đấu theo đội tổ)
  { sportId: 'tugofwar', teamId: 'ei',       name: 'Nguyễn Văn An',       category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'ei',       name: 'Trần Quốc Bảo',       category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'ei',       name: 'Lê Minh Tuấn',        category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'ei',       name: 'Phạm Đức Huy',        category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'ei',       name: 'Trần Thị Lan',        category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'piping',   name: 'Hoàng Minh Đức',      category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'piping',   name: 'Vũ Thanh Hà',         category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'piping',   name: 'Bùi Văn Tùng',        category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'piping',   name: 'Nguyễn Thị Phương Anh',category: 'Đội tổ'},
  { sportId: 'tugofwar', teamId: 'dim',      name: 'Đinh Mạnh Tiến',      category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'dim',      name: 'Lê Văn Khoa',         category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'dim',      name: 'Phạm Trung Hiếu',     category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'dim',      name: 'Nguyễn Thị Thu Thuỳ', category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'tonghop',  name: 'Lê Thanh Tuấn',       category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'tonghop',  name: 'Nguyễn Trung Kiên',   category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'tonghop',  name: 'Vũ Ngọc Sơn',         category: 'Đội tổ' },
  { sportId: 'tugofwar', teamId: 'tonghop',  name: 'Nguyễn Quỳnh Hoa',    category: 'Đội tổ' },
];

export const athletes = { total: 150, male: 96, female: 54 };
