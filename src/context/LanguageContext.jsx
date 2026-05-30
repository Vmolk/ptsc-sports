/**
 * src/context/LanguageContext.jsx
 * Lightweight i18n. The reference site has a VI/EN switch in the navbar.
 * Provides t() lookups and a toggle. Persists choice in localStorage.
 */
import { createContext, useContext, useState, useCallback } from 'react';

const STRINGS = {
  vi: {
    nav_home: 'Trang chủ',
    nav_leaderboard: 'Bảng Xếp Hạng',
    nav_gallery: 'Thư Viện Ảnh',
    nav_sports: 'Môn thể thao',
    nav_schedule: 'Lịch thi đấu',
    nav_bracket:  'Bảng thi đấu',
    countdown: 'Đếm ngược đến ngày thi đấu',
    days: 'Ngày', hours: 'Giờ', minutes: 'Phút', seconds: 'Giây',
    stat_sports: 'Môn thi đấu',
    stat_days: 'Ngày thi đấu',
    stat_teams: 'Đội thi đấu',
    stat_athletes: 'Tổng VĐV',
    stat_gender: 'Nam / Nữ',
    stat_matches: 'Trận đấu',
    sports_title: 'Các môn thể thao',
    hero_cta: 'Xem lịch thi đấu',
    organized_by: 'Tổ chức bởi QAQC',
  },
  en: {
    nav_home: 'Home',
    nav_leaderboard: 'Leaderboard',
    nav_gallery: 'Gallery',
    nav_sports: 'Sports',
    nav_schedule: 'Schedule',
    nav_bracket:  'Bracket',
    countdown: 'Countdown to the games',
    days: 'Days', hours: 'Hours', minutes: 'Mins', seconds: 'Secs',
    stat_sports: 'Sports',
    stat_days: 'Event days',
    stat_teams: 'Teams',
    stat_athletes: 'Athletes',
    stat_gender: 'Male / Female',
    stat_matches: 'Matches',
    sports_title: 'Sports Disciplines',
    hero_cta: 'View schedule',
    organized_by: 'Organized by QAQC',
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
