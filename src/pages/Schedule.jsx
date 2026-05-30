import { useState, useMemo } from 'react';
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { Loading, ErrorState, Empty } from '../components/States.jsx';

const STATUS_LABEL = { live: 'TRỰC TIẾP', upcoming: 'SẮP DIỄN RA', finished: 'KẾT THÚC' };
const ROUND_LABEL  = {
  group: 'Vòng bảng', r16: '1/8', qf: 'Tứ kết',
  sf: 'Bán kết', '3rd': 'Hạng 3', final: 'Chung kết',
};

/* "2026-07-01" → "01/07/2026" */
function formatDate(iso) {
  if (!iso) return '';
  try {
    const [y, mo, d] = iso.split('-');
    return `${d}/${mo}/${y}`;
  } catch { return iso; }
}

/* Group an array of matches by their `date` field, keeping date order */
function groupByDate(matches) {
  const map = {};
  matches.forEach((m) => {
    const key = m.date || 'unknown';
    if (!map[key]) map[key] = [];
    map[key].push(m);
  });
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
}

export default function Schedule() {
  const [day,    setDay]    = useState('');
  const [status, setStatus] = useState('');
  const [sport,  setSport]  = useState('');

  const { data: sports } = useFetch(() => api.getSports(), []);
  const { data, loading, error } = useFetch(
    () => api.getSchedule({
      ...(day    && { day }),
      ...(status && { status }),
      ...(sport  && { sport }),
    }),
    [day, status, sport]
  );

  const grouped = useMemo(() => (data ? groupByDate(data) : []), [data]);

  return (
    <div className="page">
      <header className="page-header">
        <div className="container">
          <h1>Lịch thi đấu</h1>
          <p>01/07/2026 – 02/07/2026 · QAQC Sport Tournament 2026</p>
        </div>
      </header>

      <section className="section">
        <div className="container">

          {/* ---- Filter: Ngày ---- */}
          <div className="filters">
            <span className="filter-label">Ngày</span>
            <button className={`chip ${day === ''  ? 'active' : ''}`} onClick={() => setDay('')}>Tất cả</button>
            <button className={`chip ${day === '1' ? 'active' : ''}`} onClick={() => setDay('1')}>01/07/2026</button>
            <button className={`chip ${day === '2' ? 'active' : ''}`} onClick={() => setDay('2')}>02/07/2026</button>
          </div>

          {/* ---- Filter: Môn ---- */}
          <div className="filters">
            <span className="filter-label">Môn</span>
            <button className={`chip ${sport === '' ? 'active' : ''}`} onClick={() => setSport('')}>Tất cả</button>
            {(sports || []).map((s) => (
              <button
                key={s.id}
                className={`chip ${sport === s.id ? 'active' : ''}`}
                onClick={() => setSport(sport === s.id ? '' : s.id)}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>

          {/* ---- Filter: Trạng thái ---- */}
          <div className="filters">
            <span className="filter-label">Trạng thái</span>
            <button className={`chip ${status === ''         ? 'active' : ''}`} onClick={() => setStatus('')}>Tất cả</button>
            <button className={`chip ${status === 'live'     ? 'active' : ''}`} onClick={() => setStatus('live')}>🔴 Trực tiếp</button>
            <button className={`chip ${status === 'upcoming' ? 'active' : ''}`} onClick={() => setStatus('upcoming')}>⏳ Sắp diễn ra</button>
            <button className={`chip ${status === 'finished' ? 'active' : ''}`} onClick={() => setStatus('finished')}>✅ Kết thúc</button>
          </div>

          {loading && <Loading />}
          {error   && <ErrorState message={error} />}
          {data && data.length === 0 && <Empty label="Không có trận đấu phù hợp." />}

          {/* ---- Match count ---- */}
          {data && data.length > 0 && (
            <p className="match-summary">
              {data.length} trận
              {sport ? ` · ${sports?.find(s => s.id === sport)?.name || sport}` : ''}
            </p>
          )}

          {/* ---- Grouped by date ---- */}
          {grouped.map(([dateKey, matches]) => (
            <div key={dateKey} style={{ marginBottom: 36 }}>

              {/* Date section header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                marginBottom: 16, paddingBottom: 10,
                borderBottom: '2px solid var(--gold)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                  fontWeight: 800, letterSpacing: '.04em', color: 'var(--gold)',
                }}>
                  📅 {formatDate(dateKey)}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>
                  {matches.length} trận
                </span>
              </div>

              <div className="match-list">
                {matches.map((m, i) => (
                  <article
                    className="card match-card reveal"
                    key={m.id}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="match-when">
                      <span className="match-time">{m.time}</span>
                      <span className="match-sub">{ROUND_LABEL[m.round] ?? m.round}</span>
                    </div>

                    <div className="match-teams">
                      <span className="match-team">
                        <span className="team-dot" style={{ background: m.homeColor }}>
                          {(m.homeName || '?').split(' ').pop()[0]}
                        </span>
                        {m.homeName}
                      </span>
                      <span className={`match-score ${m.homeScore == null ? 'tbd' : ''}`}>
                        {m.homeScore == null ? 'vs' : `${m.homeScore} – ${m.awayScore}`}
                      </span>
                      <span className="match-team away">
                        <span className="team-dot" style={{ background: m.awayColor }}>
                          {(m.awayName || '?').split(' ').pop()[0]}
                        </span>
                        {m.awayName}
                      </span>
                    </div>

                    <div className="match-info">
                      <span className={`badge badge-${m.status}`}>{STATUS_LABEL[m.status]}</span>
                      <span className="match-sport">{m.sportIcon} {m.sportName}</span>
                      {m.venue && <span className="match-venue">📍 {m.venue}</span>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}

        </div>
      </section>
    </div>
  );
}
