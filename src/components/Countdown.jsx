/**
 * src/components/Countdown.jsx
 * Live countdown to the event date. Ticks every second and stops
 * cleanly at zero. Target date comes from the backend stats (falls
 * back to VITE_EVENT_DATE).
 */
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import './Countdown.css';

function diff(target) {
  const total = Math.max(0, target - Date.now());
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor((total % 86_400_000) / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1000);
  return { total, days, hours, minutes, seconds };
}

const pad = (n) => String(n).padStart(2, '0');

export default function Countdown({ date }) {
  const { t } = useLanguage();
  const target = new Date(date).getTime();
  const [time, setTime] = useState(() => diff(target));

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { value: time.days, label: t('days') },
    { value: time.hours, label: t('hours') },
    { value: time.minutes, label: t('minutes') },
    { value: time.seconds, label: t('seconds') },
  ];

  return (
    <div className="countdown">
      <p className="countdown-label">{t('countdown')}</p>
      <div className="countdown-grid" role="timer" aria-live="off">
        {units.map((u, i) => (
          <div className="countdown-cell" key={u.label}>
            <span className="countdown-num">{pad(u.value)}</span>
            <span className="countdown-unit">{u.label}</span>
            {i < units.length - 1 && <span className="countdown-sep">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
