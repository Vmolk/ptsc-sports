import { useState } from 'react';
import SportIcon from '../components/SportIcon.jsx';
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { Loading, ErrorState, Empty } from '../components/States.jsx';
import './Leaderboard.css';

function TeamAvatar({ name, short, color, logo }) {
  if (logo) return (
    <img src={logo} alt={name}
      style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
  );
  return <span className="team-dot" style={{ background: color }}>{short}</span>;
}

/* Football special: top scorers */
function TopScorers() {
  const { data, loading } = useFetch(() => api.getScorers(), []);
  if (loading) return <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Đang tải...</p>;
  if (!data?.length) return <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Chưa có dữ liệu.</p>;
  return (
    <table className="lb-table">
      <thead>
        <tr>
          <th>#</th>
          <th style={{ textAlign: 'left' }}>Cầu thủ</th>
          <th style={{ textAlign: 'left' }}>Đội</th>
          <th>⚽ Bàn</th>
          <th className="hide-sm">🎯 Kiến tạo</th>
        </tr>
      </thead>
      <tbody>
        {data.map((p, i) => (
          <tr key={`${p.player}-${i}`}>
            <td><span className={`lb-rank ${i < 3 ? `top${i+1}` : ''}`}>{i + 1}</span></td>
            <td className="team-col">{p.player}</td>
            <td className="team-col" style={{ color: 'var(--text-muted)', fontSize: '.88rem' }}>{p.team}</td>
            <td className="lb-points">{p.goals}</td>
            <td className="hide-sm">{p.assists || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* Group standings for a sport */
function GroupStandings({ groups }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: 24 }}>
      {Object.entries(groups).map(([gn, g]) => (
        <div key={gn}>
          <h4 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', letterSpacing: '.08em', marginBottom: 12, textTransform: 'uppercase' }}>
            Bảng {gn}
          </h4>
          <table className="lb-table">
            <thead>
              <tr><th style={{ textAlign: 'left' }}>Đội</th><th>T</th><th>W</th><th>D</th><th>L</th><th className="hide-sm">HS</th><th className="hide-sm">HL</th><th>Điểm</th></tr>
            </thead>
            <tbody>
              {g.standings.map((t, i) => (
                <tr key={t.id} style={i < 2 ? { borderLeft: '2px solid var(--gold)' } : {}}>
                  <td className="team-col">
                    <div className="team-cell">
                      <TeamAvatar name={t.name} short={t.short} color={t.color} logo={t.logo} />
                      {t.name}
                    </div>
                  </td>
                  <td>{t.w + t.d + t.l}</td>
                  <td>{t.w}</td><td>{t.d}</td><td>{t.l}</td>
                  <td className="hide-sm">{t.gf}</td>
                  <td className="hide-sm">{t.ga}</td>
                  <td className="lb-points">{t.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

/* Per-sport leaderboard */
function SportLeaderboard({ sport }) {
  const isFootball = sport.id === 'football';
  const [subTab, setSubTab] = useState(sport.hasGroups ? 'groups' : 'results');

  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
        <SportIcon icon={sport.icon} size="1.8rem" />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.04em' }}>
          {sport.name}
        </h2>
      </div>

      {/* Sub-tabs for football */}
      {isFootball && (
        <div className="lb-tabs" style={{ marginBottom: 20 }}>
          {sport.hasGroups && (
            <button className={`lb-tab ${subTab === 'groups' ? 'active' : ''}`} onClick={() => setSubTab('groups')}>
              Bảng đấu
            </button>
          )}
          {sport.roundOrder?.length > 0 && (
            <button className={`lb-tab ${subTab === 'results' ? 'active' : ''}`} onClick={() => setSubTab('results')}>
              Vòng loại
            </button>
          )}
          <button className={`lb-tab ${subTab === 'scorers' ? 'active' : ''}`} onClick={() => setSubTab('scorers')}>
            ⚽ Vua phá lưới
          </button>
        </div>
      )}

      {subTab === 'groups' && sport.hasGroups && (
        <GroupStandings groups={sport.groups} />
      )}

      {subTab === 'results' && sport.roundOrder?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sport.roundOrder.map(r => (
            <div key={r}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                {sport.rounds[r].label}
              </h4>
              {sport.rounds[r].matches.map(m => <MatchRow key={m.id} m={m} />)}
            </div>
          ))}
        </div>
      )}

      {/* Non-football: show group standings or knockout results */}
      {!isFootball && sport.hasGroups && (
        <GroupStandings groups={sport.groups} />
      )}
      {!isFootball && !sport.hasGroups && sport.roundOrder?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sport.roundOrder.map(r => (
            <div key={r}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                {sport.rounds[r].label}
              </h4>
              {sport.rounds[r].matches.map(m => <MatchRow key={m.id} m={m} />)}
            </div>
          ))}
        </div>
      )}

      {subTab === 'scorers' && <TopScorers />}
    </section>
  );
}

function MatchRow({ m }) {
  const hs = m.homeScore, as = m.awayScore;
  const played = hs != null && as != null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
      <span style={{ flex: 1, textAlign: 'right', fontWeight: played && hs > as ? 700 : 400, color: played && hs > as ? '#fff' : 'var(--text-muted)' }}>{m.homeName}</span>
      <span style={{ minWidth: 60, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: played ? '#fff' : 'var(--text-muted)' }}>
        {played ? `${hs} – ${as}` : 'vs'}
      </span>
      <span style={{ flex: 1, textAlign: 'left', fontWeight: played && as > hs ? 700 : 400, color: played && as > hs ? '#fff' : 'var(--text-muted)' }}>{m.awayName}</span>
    </div>
  );
}

export default function Leaderboard() {
  const { data, loading, error } = useFetch(() => api.getBracket(), []);
  const [activeSport, setActiveSport] = useState(null);

  const sports = data || [];
  const current = activeSport
    ? sports.find(s => s.id === activeSport) || sports[0]
    : sports[0];

  return (
    <div className="page">
      <header className="page-header">
        <div className="container">
          <h1>Bảng xếp hạng</h1>
          <p>Kết quả & thống kê từng môn thi đấu</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {loading && <Loading />}
          {error   && <ErrorState message={error} />}
          {!loading && !error && sports.length === 0 && <Empty />}

          {sports.length > 0 && (
            <>
              {/* Sport selector tabs */}
              <div className="lb-tabs" style={{ marginBottom: 32, flexWrap: 'wrap' }}>
                {sports.map(s => (
                  <button
                    key={s.id}
                    className={`lb-tab ${(current?.id === s.id) ? 'active' : ''}`}
                    onClick={() => setActiveSport(s.id)}
                  >
                    <SportIcon icon={s.icon} size="1.1em" /> {s.name}
                  </button>
                ))}
              </div>

              {current && <SportLeaderboard sport={current} />}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
