import { useState } from 'react';
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { Loading, ErrorState, Empty } from '../components/States.jsx';
import './Bracket.css';

const ROUND_LABEL = {
  group: 'Vòng bảng', r16: '1/8 Cuối', qf: 'Tứ kết',
  sf: 'Bán kết', final: 'Chung kết',
};

/* ─── Layout constants ─── */
const LABEL_H = 34;   // round-label row height (px)
const MATCH_H = 76;   // rendered match card height (px)
const MATCH_W = 214;  // match card width (px)
const GUTTER  = 44;   // connector gutter between rounds (px)

function slotSize(baseCount) {
  if (baseCount <= 2) return 130;
  if (baseCount <= 4) return 108;
  return 90;
}

/* ─── Team avatar ─── */
function TeamAvatar({ name, short, color, logo, size = 22 }) {
  if (logo) return (
    <img src={logo} alt={name}
      style={{ width: size, height: size, borderRadius: 5, objectFit: 'cover', flexShrink: 0 }} />
  );
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: 5,
      background: color || '#888', color: '#fff',
      fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
    }}>
      {short || (name || '?')[0]}
    </span>
  );
}

/* ─── Match card used inside visual bracket ─── */
function VBMatch({ m }) {
  if (!m) return <div className="vb-match vb-empty" />;
  const played  = m.homeScore != null && m.awayScore != null;
  const homeWin = played && m.homeScore > m.awayScore;
  const awayWin = played && m.awayScore > m.homeScore;
  return (
    <div className="vb-match">
      <div className={`vb-team ${homeWin ? 'winner' : ''}`}>
        <TeamAvatar name={m.homeName} short={m.homeColor?.slice(1,4)}
                    color={m.homeColor} logo={m.homeLogo} />
        <span className="vb-name">{m.homeName || '—'}</span>
        {played && <span className="vb-score">{m.homeScore}</span>}
      </div>
      <div className={`vb-team ${awayWin ? 'winner' : ''}`}>
        <TeamAvatar name={m.awayName} short={m.awayColor?.slice(1,4)}
                    color={m.awayColor} logo={m.awayLogo} />
        <span className="vb-name">{m.awayName || '—'}</span>
        {played && <span className="vb-score">{m.awayScore}</span>}
      </div>
    </div>
  );
}

/* ─── Connector lines between rounds ─── */
function BkConnector({ cx, cy, mi, matchCount, sh, half }) {
  const vx           = cx + half;
  const isPairLeader = mi % 2 === 0;
  const hasPair      = isPairLeader && (mi + 1) < matchCount;
  const nextCy       = hasPair ? LABEL_H + (mi + 1.5) * sh : 0;
  const midY         = hasPair ? (cy + nextCy) / 2 : 0;
  const L = { position: 'absolute', background: 'var(--gold)', opacity: .55 };

  return (
    <>
      {/* Horizontal line from match right edge to vertical bar */}
      <div style={{ ...L, left: cx, top: cy - 1, width: half, height: 2 }} />
      {hasPair && <>
        {/* Vertical bar connecting the pair */}
        <div style={{ ...L, left: vx - 1, top: cy, width: 2, height: nextCy - cy }} />
        {/* Outgoing horizontal from midpoint to next round */}
        <div style={{ ...L, left: vx, top: midY - 1, width: half, height: 2 }} />
      </>}
    </>
  );
}

/* ─── Visual bracket (absolute-positioned cards + connector lines) ─── */
function VisualBracket({ rounds, roundOrder }) {
  if (!roundOrder?.length) return null;

  const baseCount = rounds[roundOrder[0]].matches.length;
  const SH        = slotSize(baseCount);
  const totalH    = baseCount * SH;
  const half      = GUTTER / 2;

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
      <div style={{
        position: 'relative',
        height: totalH + LABEL_H + 16,
        minWidth: roundOrder.length * (MATCH_W + GUTTER),
      }}>

        {/* Round labels */}
        {roundOrder.map((r, ri) => (
          <div key={`lbl-${r}`} className="vb-round-label"
            style={{ left: ri * (MATCH_W + GUTTER), width: MATCH_W, top: 0, height: LABEL_H }}>
            {ROUND_LABEL[r] ?? r}
          </div>
        ))}

        {/* Matches and connector lines */}
        {roundOrder.map((r, ri) => {
          const matchCount = rounds[r].matches.length;
          const sh   = totalH / matchCount;
          const colX = ri * (MATCH_W + GUTTER);
          const isLast = ri === roundOrder.length - 1;

          return rounds[r].matches.map((m, mi) => {
            const cy  = LABEL_H + (mi + 0.5) * sh;
            const top = cy - MATCH_H / 2;

            return (
              <div key={m.id}>
                {/* Match card */}
                <div style={{ position: 'absolute', left: colX, top, width: MATCH_W }}>
                  <VBMatch m={m} />
                </div>

                {/* Connectors (not after the last round) */}
                {!isLast && (
                  <BkConnector
                    cx={colX + MATCH_W} cy={cy}
                    mi={mi} matchCount={matchCount}
                    sh={sh} half={half}
                  />
                )}

                {/* Champion trophy when final is played */}
                {isLast && m.homeScore != null && m.homeScore !== m.awayScore && (
                  <div style={{
                    position: 'absolute',
                    left: colX + MATCH_W + 10,
                    top: cy - 18,
                    fontSize: '1.4rem',
                    lineHeight: 1,
                  }}>🏆</div>
                )}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}

/* ─── Group standings (football) ─── */
function GroupTable({ groupName, standings, matches }) {
  return (
    <div className="group-block">
      <h4 className="group-title">Bảng {groupName}</h4>
      <table className="group-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Đội</th>
            <th>T</th><th>W</th><th>D</th><th>L</th>
            <th>HS</th><th>HB</th><th>HL</th><th>Điểm</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((t, i) => (
            <tr key={t.id} className={i < 2 ? 'qualify' : ''}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TeamAvatar name={t.name} short={t.short} color={t.color} logo={t.logo} size={22} />
                  <span style={{ fontWeight: i < 2 ? 600 : 400 }}>{t.name}</span>
                </div>
              </td>
              <td>{t.w + t.d + t.l}</td>
              <td>{t.w}</td><td>{t.d}</td><td>{t.l}</td>
              <td>{t.gf}</td><td>{t.ga}</td>
              <td className={t.gd > 0 ? 'pos' : t.gd < 0 ? 'neg' : ''}>
                {t.gd > 0 ? '+' : ''}{t.gd}
              </td>
              <td className="pts">{t.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="group-matches">
        {matches.map(m => <GroupMatchRow key={m.id} m={m} />)}
      </div>
    </div>
  );
}

function GroupMatchRow({ m }) {
  const played = m.homeScore != null && m.awayScore != null;
  const hw = played && m.homeScore > m.awayScore;
  const aw = played && m.awayScore > m.homeScore;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 0', borderBottom: '1px solid var(--line)', fontSize: '.82rem',
    }}>
      <span style={{ flex: 1, textAlign: 'right', fontWeight: hw ? 700 : 400, color: hw ? '#fff' : 'var(--text-muted)' }}>
        {m.homeName}
      </span>
      <span style={{
        minWidth: 56, textAlign: 'center', fontFamily: 'var(--font-display)',
        fontWeight: 800, fontSize: '1rem', color: played ? '#fff' : 'var(--text-muted)',
      }}>
        {played ? `${m.homeScore} – ${m.awayScore}` : 'vs'}
      </span>
      <span style={{ flex: 1, textAlign: 'left', fontWeight: aw ? 700 : 400, color: aw ? '#fff' : 'var(--text-muted)' }}>
        {m.awayName}
      </span>
    </div>
  );
}

/* ─── Top scorers (football only) ─── */
function TopScorers() {
  const { data, loading } = useFetch(() => api.getScorers(), []);
  if (loading) return <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', padding: '16px 0' }}>Đang tải...</p>;
  if (!data?.length) return <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', padding: '16px 0' }}>Chưa có dữ liệu.</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
      <thead>
        <tr>
          {['#', 'Cầu thủ', 'Đội / Tổ', '⚽ Bàn', '🎯 Kiến tạo'].map(h => (
            <th key={h} style={{
              padding: '8px 12px', textAlign: h === '#' || h.includes('⚽') || h.includes('🎯') ? 'center' : 'left',
              fontSize: '.72rem', fontWeight: 700, letterSpacing: '.06em',
              textTransform: 'uppercase', color: 'var(--text-muted)',
              borderBottom: '1px solid var(--line)',
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((p, i) => (
          <tr key={`${p.player}-${i}`} style={{ borderBottom: '1px solid var(--line)' }}>
            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 26, height: 26, borderRadius: '50%', fontWeight: 700, fontSize: '.82rem',
                background: i === 0 ? 'var(--gold)' : i === 1 ? '#b0bec5' : i === 2 ? '#a0674a' : 'var(--bg-700)',
                color: i < 3 ? '#000' : 'var(--text-muted)',
              }}>{i + 1}</span>
            </td>
            <td style={{ padding: '10px 12px', fontWeight: 600 }}>{p.player}</td>
            <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: '.85rem' }}>{p.team}</td>
            <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{p.goals}</td>
            <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text-muted)' }}>{p.assists || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ─── Per-sport section ─── */
function SportSection({ sport }) {
  const isFootball  = sport.id === 'football';
  const hasGroups   = sport.hasGroups;
  const hasKnockout = sport.roundOrder?.length > 0;
  const [tab, setTab] = useState(hasGroups ? 'groups' : 'bracket');

  return (
    <section className="sport-section card">
      <div className="sport-section-head">
        <span className="sport-section-icon">{sport.icon}</span>
        <h2 className="sport-section-name">{sport.name}</h2>
      </div>

      {/* Build tab list — only render bar if 2+ tabs */}
      {(() => {
        const tabs = [
          hasGroups   && { id: 'groups',  label: '📊 Bảng đấu'       },
          hasKnockout && { id: 'bracket', label: '🏆 Sơ đồ thi đấu'  },
          isFootball  && { id: 'scorers', label: '⚽ Vua phá lưới'   },
        ].filter(Boolean);
        return tabs.length > 1 ? (
          <div className="sport-tabs">
            {tabs.map(t => (
              <button key={t.id}
                className={`sport-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        ) : null;
      })()}

      {tab === 'groups'  && hasGroups   && (
        <div className="groups-wrap">
          {Object.entries(sport.groups).map(([gn, g]) => (
            <GroupTable key={gn} groupName={gn} standings={g.standings} matches={g.matches} />
          ))}
        </div>
      )}
      {tab === 'bracket' && hasKnockout && <VisualBracket rounds={sport.rounds} roundOrder={sport.roundOrder} />}
      {tab === 'scorers'                 && <TopScorers />}

      {!hasKnockout && !hasGroups && tab !== 'scorers' && (
        <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>Chưa có trận đấu.</p>
      )}
    </section>
  );
}

/* ─── Main page ─── */
export default function Bracket() {
  const { data, loading, error } = useFetch(() => api.getBracket(), []);

  return (
    <div className="page">
      <header className="page-header">
        <div className="container">
          <h1>Bảng thi đấu</h1>
          <p>Sơ đồ đấu loại từng môn · QAQC Sport Tournament 2026</p>
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
