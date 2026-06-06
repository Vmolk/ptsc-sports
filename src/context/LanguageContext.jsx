/**
 * src/context/LanguageContext.jsx
 * Lightweight i18n — VI/EN toggle, persisted in localStorage.
 */
import { createContext, useContext, useState, useCallback } from 'react';

const STRINGS = {
  vi: {
    /* ── Navigation ── */
    nav_home:      'Trang chủ',
    nav_gallery:   'Thư Viện Ảnh',
    nav_sports:    'Môn thể thao',
    nav_schedule:  'Lịch thi đấu',
    nav_bracket:   'Bảng xếp hạng',
    nav_leaderboard: 'Bảng Xếp Hạng',

    /* ── Countdown ── */
    countdown: 'Đếm ngược đến ngày thi đấu',
    days: 'Ngày', hours: 'Giờ', minutes: 'Phút', seconds: 'Giây',

    /* ── Home stats ── */
    stat_sports:   'Môn thi đấu',
    stat_days:     'Ngày thi đấu',
    stat_teams:    'Đội thi đấu',
    stat_athletes: 'Tổng VĐV',
    stat_gender:   'Nam / Nữ',
    stat_matches:  'Trận đấu',

    /* ── Common ── */
    sports_title:  'Môn thể thao',
    hero_cta:      'Xem lịch thi đấu',
    organized_by:  'Hội Thao Phòng Quản Lý Chất Lượng 2026',
    loading:       'Đang tải...',
    no_data:       'Chưa có dữ liệu.',
    all:           'Tất cả',

    /* ── Sports page ── */
    page_sports_title:   'Môn Thể Thao',
    page_sports_sub:     'Hội Thao Phòng Quản Lý Chất Lượng 2026',
    athletes_list:       'Danh sách VĐV tham dự',
    no_athletes:         'Chưa có danh sách VĐV.',
    venue_label:         '📍 Địa điểm',
    teams_label:         '👥 Số đội / cặp',

    /* ── Bracket page ── */
    page_bracket_title:  'Bảng Xếp Hạng',
    page_bracket_sub:    'Hội Thao Phòng Quản Lý Chất Lượng 2026',
    tab_groups:          '📊 Bảng đấu',
    tab_bracket:         '🏆 Sơ đồ thi đấu',
    tab_scorers:         '⚽ Vua phá lưới',
    show_results:        'Xem kết quả',
    hide_results:        'Ẩn kết quả',
    matches_label:       'trận',
    no_matches:          'Chưa có trận đấu.',
    group_label:         'Bảng',
    qualify_note:        'Vòng 2 dòng đầu đi tiếp',
    col_team:            'Đội',
    col_pair:            'Cặp / VĐV',
    round_group:         'Vòng bảng',
    round_r16:           'Vòng 1/8',
    round_qf:            'Tứ kết',
    round_sf:            'Bán kết',
    round_3rd:           'Hạng 3',
    round_final:         'Chung kết',

    /* ── Schedule page ── */
    page_schedule_title: 'Lịch Thi Đấu',
    page_schedule_sub:   '05/07/2026 – 18/07/2026 · Hội Thao Phòng Quản Lý Chất Lượng 2026',
    filter_date:         'Ngày',
    filter_sport:        'Môn',
    filter_status:       'Trạng thái',
    status_live:         '🔴 Trực tiếp',
    status_upcoming:     '⏳ Sắp diễn ra',
    status_finished:     '✅ Kết thúc',
    badge_live:          'TRỰC TIẾP',
    badge_upcoming:      'SẮP DIỄN RA',
    badge_finished:      'KẾT THÚC',
    no_matches_filter:   'Không có trận đấu phù hợp.',
    match_summary:       'trận',

    /* ── Gallery page ── */
    page_gallery_title:  'Thư Viện Ảnh',
    page_gallery_sub:    'Khoảnh khắc đáng nhớ · Nhấn vào ảnh để xem album Drive',
    no_photos:           'Chưa có ảnh.',
  },

  en: {
    /* ── Navigation ── */
    nav_home:      'Home',
    nav_gallery:   'Gallery',
    nav_sports:    'Sports',
    nav_schedule:  'Schedule',
    nav_bracket:   'Standings',
    nav_leaderboard: 'Leaderboard',

    /* ── Countdown ── */
    countdown: 'Countdown to the games',
    days: 'Days', hours: 'Hours', minutes: 'Mins', seconds: 'Secs',

    /* ── Home stats ── */
    stat_sports:   'Sports',
    stat_days:     'Event days',
    stat_teams:    'Teams',
    stat_athletes: 'Athletes',
    stat_gender:   'Male / Female',
    stat_matches:  'Matches',

    /* ── Common ── */
    sports_title:  'Sports Disciplines',
    hero_cta:      'View schedule',
    organized_by:  'PTSC M&C Sports Tournament 2026',
    loading:       'Loading...',
    no_data:       'No data available.',
    all:           'All',

    /* ── Sports page ── */
    page_sports_title:   'Sports',
    page_sports_sub:     'PTSC M&C Sports Tournament 2026',
    athletes_list:       'Participant list',
    no_athletes:         'No participants yet.',
    venue_label:         '📍 Venue',
    teams_label:         '👥 Teams / pairs',

    /* ── Bracket page ── */
    page_bracket_title:  'Standings',
    page_bracket_sub:    'PTSC M&C Sports Tournament 2026',
    tab_groups:          '📊 Group stage',
    tab_bracket:         '🏆 Bracket',
    tab_scorers:         '⚽ Top scorers',
    show_results:        'Show results',
    hide_results:        'Hide results',
    matches_label:       'matches',
    no_matches:          'No matches yet.',
    group_label:         'Group',
    qualify_note:        'Top 2 advance',
    col_team:            'Team',
    col_pair:            'Pair / Athlete',
    round_group:         'Group stage',
    round_r16:           'Round of 16',
    round_qf:            'Quarter-final',
    round_sf:            'Semi-final',
    round_3rd:           '3rd place',
    round_final:         'Final',

    /* ── Schedule page ── */
    page_schedule_title: 'Schedule',
    page_schedule_sub:   '05/07/2026 – 18/07/2026 · PTSC M&C Sports Tournament 2026',
    filter_date:         'Date',
    filter_sport:        'Sport',
    filter_status:       'Status',
    status_live:         '🔴 Live',
    status_upcoming:     '⏳ Upcoming',
    status_finished:     '✅ Finished',
    badge_live:          'LIVE',
    badge_upcoming:      'UPCOMING',
    badge_finished:      'FINISHED',
    no_matches_filter:   'No matches found.',
    match_summary:       'matches',

    /* ── Gallery page ── */
    page_gallery_title:  'Gallery',
    page_gallery_sub:    'Memorable moments · Click to open Google Drive album',
    no_photos:           'No photos yet.',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'vi');

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'vi' ? 'en' : 'vi';
      localStorage.setItem('lang', next);
      return next;
    });
  }, []);

  const t = useCallback((key) => STRINGS[lang][key] ?? key, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
