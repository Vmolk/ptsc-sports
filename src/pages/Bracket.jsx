import { useState } from 'react';
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { Loading, ErrorState, Empty } from '../components/States.jsx';
import './Bracket.css';

const ROUND_LABEL = {
  group: 'Vòng bảng', r16: '1/8', qf: 'Tứ kết',
  sf: 'Bán kết', '3rd': 'Hạng 3', final: 'Chung kết',
};

/* ---- Team logo/avatar ---- */
function TeamAvatar({ name, short, color, logo, size = 28 }) {
  if (logo) return (
    <img src={logo} alt={name}
      style={{ width: size, height: size, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
  );
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: 6,
      background: color, color: '#fff', fontSize: size * 0.38,
      fontWeight: 700, flexShrink: 0,
    }}>{short || (name || '?')[0]}</span>
  );
}

/* ---- Single match card in bracket ---- */
function BracketMatch({ m }) {
  if (!m) return <div className="bm-slot bm-empty" />;
  const hs = m.homeScore, as = m.awayScore;
  const played = hs != null && as != null;
  const homeWin = played && hs > as;
  const awayWin = played && as > hs;
  return (
    <div className="bm-slot">
      <div className={`bm-team ${homeWin ? 'winner' : ''}`}>
        <TeamAvatar name={m.homeName} short={m.homeColor?.slice(1,4)} color={m.homeColor} logo={m.homeLogo} size={22} />
        <span className="bm-name">{m.homeName || '—'}</span>
        <span className="bm-score">{played ? hs : ''}</span>
      </div>
      <div className={`bm-team ${awayWin ? 'winner' : ''}`}>
        <TeamAvatar name={m.awayName} short={m.awayColor?.slice(1,4)} color={m.awayColor} logo={m.awayLogo} size={22} />
        <span className="bm-name">{m.awayName || '—'}</span>
        <span className="bm-score">{played ? as : ''}</span>
      </div>
      {m.time && <div className="bm-meta">{m.date ? formatDate(m.date) : ''}{m.date && m.time ? ' · ' : ''}{m.time}</div>}
    </div>
  );
}

/* ---- Group standings table ---- */
function GroupTable({ groupName, standings, matches }) {
  return (
    <div className="group-block">
      <h4 className="group-title">Bảng {groupName}</h4>
      <table className="group-table">
        <thead>
          <tr><th>Đội</th><th>T</th><th>W</th><th>D</th><th>L</th><th>HS</th><th>HB</th><th>HL</th><th>Điểm</th></tr>
        </thead>
        <tbody>
          {standings.map((t, i) => (
            <tr key={t.id} className={i < 2 ? 'qualify' : ''}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TeamAvatar name={t.name} short={t.short} color={t.color} logo={t.logo} size={22} />
                  <span>{t.name}</span>
                </div>
              </td>
              <td>{t.w + t.d + t.l}</td>
              <td>{t.w}</td><td>{t.d}</td><td>{t.l}</td>
              <td>{t.gf}</td><td>{t.ga}</td>
              <td className={t.gd > 0 ? 'pos' : t.gd < 0 ? 'neg' : ''}>{t.gd > 0 ? '+' : ''}{t.gd}</td>
              <td className="pts">{t.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Group matches */}
      <div className="group-matches">
        {matches.map(m => <BracketMatch key={m.id} m={m} />)}
      </div>
    </div>
  );
}

/* ---- Knockout bracket columns ---- */
function KnockoutBracket({ rounds, roundOrder }) {
  if (!roundOrder?.length) return null;
  return (
    <div className="knockout-wrap">
      {roundOrder.map(r => (
        <div key={r} className="ko-round">
          <div className="ko-round-label">{ROUND_LABEL[r] ?? r}</div>
          <div className="ko-matches">
            {rounds[r].matches.map(m => <BracketMatch key={m.id} m={m} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(d) {
  if (!d) return '';
  try {
    const [y, mo, day] = d.split('-');
    return `${day}/${mo}/${y}`;
  } catch { return d; }
}

/* ---- Sport section ---- */
function SportSection({ sport }) {
  const [tab, setTab] = useState(sport.hasGroups ? 'groups' : 'bracket');
  const hasKnockout = sport.roundOrder?.length > 0;

  return (
    <section className="sport-section card">
      <div className="sport-section-head">
        <span className="sport-section-icon">{sport.icon}</span>
        <h2 className="sport-section-name">{sport.name}</h2>
      </div>

      {sport.hasGroups && hasKnockout && (
        <div className="sport-tabs">
          <button className={`sport-tab ${tab === 'groups' ? 'active' : ''}`} onClick={() => setTab('groups')}>
            Bảng đấu
          </button>
          <button className={`sport-tab ${tab === 'bracket' ? 'active' : ''}`} onClick={() => setTab('bracket')}>
            Knock-out
          </button>
        </div>
      )}

      {(tab === 'groups' && sport.hasGroups) && (
        <div className="groups-wrap">
          {Object.entries(sport.groups).map(([gn, g]) => (
            <GroupTable key={gn} groupName={gn} standings={g.standings} matches={g.matches} />
          ))}
        </div>
      )}

      {(tab === 'bracket' || !sport.hasGroups) && hasKnockout && (
        <KnockoutBracket rounds={sport.rounds} roundOrder={sport.roundOrder} />
      )}

      {!hasKnockout && !sport.hasGroups && (
        <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>Chưa có trận đấu.</p>
      )}
    </section>
  );
}

/* ---- Main page ---- */
export default function Bracket() {
  const { data, loading, error } = useFetch(() => api.getBracket(), []);

  return (
    <div className="page">
      <header className="page-header">
        <div className="container">
          <h1>Bảng thi đấu</h1>
          <p>Lịch sử và kết quả từng môn · QAQC Sport Tournament 2026</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {loading && <Loading />}
          {error   && <ErrorState message={error} />}
          {data && data.length === 0 && <Empty label="Chưa có dữ liệu thi đấu." />}
          {data && data.map(sp => <SportSection key={sp.id} sport={sp} />)}
        </div>
      </section>
    </div>
  );
}
