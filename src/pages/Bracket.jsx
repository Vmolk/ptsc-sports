import { useState, useCallback } from 'react';
import SportIcon from '../components/SportIcon.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { Loading, ErrorState, Empty } from '../components/States.jsx';
import './Bracket.css';

const ROUND_LABEL = {
  group: 'Vòng bảng', r16: 'Vòng 1/8', qf: 'Tứ kết',
  sf: 'Bán kết', final: 'Chung kết',
};

/* ─── Layout constants ─── */
const LABEL_H = 34;   // round-label row height (px)
const MATCH_H = 140;  // rendered match card height (px) — 2 × 70px rows
const MATCH_W = 230;  // match card width (px)
const GUTTER  = 44;   // connector gutter between rounds (px)

/* Slot height must always exceed MATCH_H to prevent card overlap */
function slotSize(baseCount) {
  if (baseCount <= 2)  return 188;
  if (baseCount <= 4)  return 170;
  if (baseCount <= 8)  return 158;
  return 150;   // minimum: MATCH_H(140) + 10px gap
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

/* ─── Pair-aware name for the bracket card ─── */
function VBName({ name }) {
  if (!name) return <span className="vb-name">—</span>;
  /* Split on em-dash (–) or regular dash used as pair separator */
  const parts = name.split(/\s*[–—]\s*/);
  if (parts.length < 2) return <span className="vb-name">{name}</span>;
  return (
    <span className="vb-name vb-name-pair">
      <span>{parts[0].trim()}</span>
      <span className="vb-name-sep">/</span>
      <span>{parts[1].trim()}</span>
    </span>
  );
}

/* ─── Match card used inside visual bracket ─── */
function VBMatch({ m, showAvatar = false }) {
  if (!m) return <div className="vb-match vb-empty" />;
  const played  = m.homeScore != null && m.awayScore != null;
  const hasPens = played && m.homePens != null && m.awayPens != null;
  const homeWin = played && (m.homeScore > m.awayScore || (hasPens && m.homePens > m.awayPens));
  const awayWin = played && (m.awayScore > m.homeScore || (hasPens && m.awayPens > m.homePens));
  return (
    <div className="vb-match">
      <div className={`vb-team ${homeWin ? 'winner' : ''}`}>
        {showAvatar && <TeamAvatar name={m.homeName} short={m.homeColor?.slice(1,4)}
                    color={m.homeColor} logo={m.homeLogo} size={40} />}
        <VBName name={m.homeName} />
        {played && (
          <span className="vb-score">
            {m.homeScore}
            {hasPens && <span style={{ fontSize: '.7em', fontWeight: 400, opacity: .75 }}> ({m.homePens})</span>}
          </span>
        )}
      </div>
      <div className={`vb-team ${awayWin ? 'winner' : ''}`}>
        {showAvatar && <TeamAvatar name={m.awayName} short={m.awayColor?.slice(1,4)}
                    color={m.awayColor} logo={m.awayLogo} size={40} />}
        <VBName name={m.awayName} />
        {played && (
          <span className="vb-score">
            {m.awayScore}
            {hasPens && <span style={{ fontSize: '.7em', fontWeight: 400, opacity: .75 }}> ({m.awayPens})</span>}
          </span>
        )}
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
  const L = { position: 'absolute', background: 'var(--blue)', opacity: .6 };

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
function VisualBracket({ rounds, roundOrder, showAvatar = false }) {
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
                  <VBMatch m={m} showAvatar={showAvatar} />
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

/* Render a name that may contain " – " or "/" (pair) as stacked lines */
function PairName({ name, bold }) {
  const parts = name ? name.split(/\s*[–\/]\s*/) : [name];
  if (parts.length === 1) return <span style={{ fontWeight: bold ? 600 : 400 }}>{name}</span>;
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {parts.map((p, i) => (
        <span key={i} style={{ fontWeight: bold ? 600 : 400, lineHeight: 1.35 }}>{p.trim()}</span>
      ))}
    </span>
  );
}

/* ─── Group standings ─── */
function GroupTable({ groupName, standings, matches, sportId }) {
  /* Compact table (no D/HS/HB): pickleball AND badminton doubles/pairs */
  /* isCompact: no D column (no draws)  |  isPairSport: header "Cặp / VĐV" + stacked name  |  showAvatar: only for sports with logos */
  const isCompact   = sportId === 'pickleball' || sportId === 'badminton' || sportId === 'tugofwar';
  const isPairSport = sportId === 'pickleball' || sportId === 'badminton';
  const isPairs     = isPairSport;   /* alias used below for labels */
  const showAvt     = !isCompact;    /* hide avatar for all non-football sports */
  const [showMatches, setShowMatches] = useState(false);
  const toggle = useCallback(() => setShowMatches(v => !v), []);

  return (
    <div className="group-block">
      <h4 className="group-title">Bảng {groupName}</h4>
      <table className="group-table">
        <colgroup>
          <col style={{ width: '45%' }} />
          <col style={{ width: '7%' }} />
          <col style={{ width: '7%' }} />
          {!isCompact && <col style={{ width: '7%' }} />}
          <col style={{ width: '7%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '12%' }} />
        </colgroup>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>{isPairs ? 'Cặp / VĐV' : 'Đội'}</th>
            <th title="Played">P</th>
            <th title="Wins">W</th>
            {!isCompact && <th title="Draws">D</th>}
            <th title="Losses">L</th>
            <th title="Goal difference">+/-</th>
            <th title="Points">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((t, i) => (
            <tr key={t.id} className={i < 2 ? 'qualify' : ''}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {showAvt && <TeamAvatar name={t.name} short={t.short} color={t.color} logo={t.logo} size={28} />}
                  <PairName name={t.name} bold={i < 2} />
                </div>
              </td>
              <td>{t.w + t.d + t.l}</td>
              <td>{t.w}</td>
              {!isCompact && <td>{t.d}</td>}
              <td>{t.l}</td>
              <td className={t.gd > 0 ? 'pos' : t.gd < 0 ? 'neg' : ''}>
                {t.gd > 0 ? '+' : ''}{t.gd}
              </td>
              <td className="pts">{t.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Collapsible match results ── */}
      {matches?.length > 0 && (
        <>
          <button
            onClick={toggle}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              width: '100%', padding: '7px 0', marginTop: 6,
              background: 'transparent', border: 'none',
              borderTop: '1px dashed var(--line-blue)',
              color: 'var(--blue)', fontWeight: 700, fontSize: '.8rem',
              cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase',
              transition: 'color .15s',
            }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 18, height: 18, borderRadius: '50%',
              border: '1.5px solid var(--blue)',
              fontWeight: 800, fontSize: '.85rem', lineHeight: 1,
              transition: 'transform .2s',
              transform: showMatches ? 'rotate(45deg)' : 'rotate(0deg)',
            }}>+</span>
            {showMatches ? 'Ẩn kết quả trận' : `Xem kết quả (${matches.length} trận)`}
          </button>

          {showMatches && (
            <div className="group-matches" style={{ marginTop: 6 }}>
              {matches.map(m => <GroupMatchRow key={m.id} m={m} />)}
            </div>
          )}
        </>
      )}
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
      padding: '6px 4px', borderBottom: '1px solid var(--line)', fontSize: '.82rem',
    }}>
      <span style={{
        flex: 1, textAlign: 'right',
        fontWeight: hw ? 700 : 500,
        color: hw ? 'var(--blue-dark)' : 'var(--text)',
      }}>
        {m.homeName}
      </span>
      <span style={{
        minWidth: 56, textAlign: 'center', fontFamily: 'var(--font-display)',
        fontWeight: 800, fontSize: '1rem',
        color: played ? 'var(--blue-dark)' : 'var(--text-muted)',
        background: played ? 'rgba(21,101,192,.08)' : 'transparent',
        borderRadius: 6, padding: '1px 6px',
      }}>
        {played ? `${m.homeScore} – ${m.awayScore}` : 'vs'}
      </span>
      <span style={{
        flex: 1, textAlign: 'left',
        fontWeight: aw ? 700 : 500,
        color: aw ? 'var(--blue-dark)' : 'var(--text)',
      }}>
        {m.awayName}
      </span>
    </div>
  );
}

/* ─── Compute gold / silver / bronze from bracket data ─── */
function computeMedals(data) {
  const { rounds, groups, hasGroups } = data;
  const result = { gold: null, silver: null, bronze: null };

  if (rounds) {
    const finalM = rounds['final']?.matches?.[0];
    if (finalM?.homeScore != null && finalM?.awayScore != null) {
      const hasPens = finalM.homePens != null && finalM.awayPens != null;
      const hw = finalM.homeScore > finalM.awayScore || (hasPens && finalM.homePens > finalM.awayPens);
      result.gold   = hw ? finalM.homeName : finalM.awayName;
      result.silver = hw ? finalM.awayName : finalM.homeName;
    }

    const thirdM = rounds['3rd']?.matches?.[0];
    if (thirdM?.homeScore != null && thirdM?.awayScore != null) {
      const hasPens3 = thirdM.homePens != null && thirdM.awayPens != null;
      result.bronze = (thirdM.homeScore > thirdM.awayScore || (hasPens3 && thirdM.homePens > thirdM.awayPens)) ? thirdM.homeName : thirdM.awayName;
    } else if (!result.bronze) {
      /* Fallback: SF losers = joint bronze */
      const sfLosers = (rounds['sf']?.matches || [])
        .filter(m => m.homeScore != null && m.awayScore != null)
        .map(m => m.homeScore < m.awayScore ? m.homeName : m.awayName);
      if (sfLosers.length > 0) result.bronze = sfLosers.join(' / ');
    }
  }

  return result;
}

const MEDAL_CFG = [
  { key: 'gold',   emoji: '🥇', label: 'HUY CHƯƠNG VÀNG', color: '#d97706', bg: 'rgba(245,158,11,.08)', border: 'rgba(245,158,11,.35)' },
  { key: 'silver', emoji: '🥈', label: 'HUY CHƯƠNG BẠC',  color: '#64748b', bg: 'rgba(148,163,184,.08)', border: 'rgba(148,163,184,.35)' },
  { key: 'bronze', emoji: '🥉', label: 'HUY CHƯƠNG ĐỒNG', color: '#b45309', bg: 'rgba(180,83,9,.07)',   border: 'rgba(180,83,9,.28)'   },
];

/* ─── Medals panel ─── */
function MedalsPanel({ data }) {
  const medals = computeMedals(data);
  const hasAny = medals.gold || medals.silver || medals.bronze;

  if (!hasAny) return (
    <p style={{ color: 'var(--text-muted)', padding: '24px 0', fontSize: '.9rem' }}>
      Chưa có kết quả để xếp huy chương.
    </p>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 0' }}>
      {MEDAL_CFG.map(({ key, emoji, label, color, bg, border }) => {
        const name = medals[key];
        if (!name) return null;
        return (
          <div key={key} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            background: bg, border: `1.5px solid ${border}`,
            borderRadius: 14, padding: '14px 20px',
          }}>
            <span style={{ fontSize: '2rem', flexShrink: 0, lineHeight: 1 }}>{emoji}</span>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '.68rem',
                fontWeight: 800, letterSpacing: '.1em',
                color, textTransform: 'uppercase', marginBottom: 3,
              }}>{label}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                fontWeight: 800, color: 'var(--text)', letterSpacing: '.02em',
              }}>{name}</div>
            </div>
          </div>
        );
      })}
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
          {['#', 'Cầu thủ', 'Đội / Tổ', '⚽ Bàn'].map(h => (
            <th key={h} style={{
              padding: '8px 12px', textAlign: h === '#' || h.includes('⚽') ? 'center' : 'left',
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ─── Content of one bracket (groups + knockout) ─── */
function BracketContent({ data, sportId }) {
  const isFootball  = sportId === 'football';
  const showAvatar  = isFootball;
  const hasGroups   = data.hasGroups;
  const hasKnockout = data.roundOrder?.length > 0;

  const tabs = [
    hasGroups   && { id: 'groups',  label: '📊 Bảng đấu'      },
    hasKnockout && { id: 'bracket', label: '🏆 Sơ đồ thi đấu' },
    (hasGroups || hasKnockout) && { id: 'medals',  label: '🏅 Huy chương'     },
    isFootball  && { id: 'scorers', label: '⚽ Vua phá lưới'  },
  ].filter(Boolean);

  const [tab, setTab] = useState(tabs[0]?.id || 'bracket');

  return (
    <div>
      {tabs.length > 1 && (
        <div className="sport-tabs">
          {tabs.map(t => (
            <button key={t.id}
              className={`sport-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {tab === 'groups'  && hasGroups   && (
        <div className="groups-wrap">
          {Object.entries(data.groups).map(([gn, g]) => (
            <GroupTable key={gn} groupName={gn} standings={g.standings} matches={g.matches} sportId={sportId} />
          ))}
        </div>
      )}
      {tab === 'bracket' && hasKnockout && (() => {
        /* Separate 3rd-place match from the main bracket flow */
        const mainOrder = data.roundOrder.filter(r => r !== '3rd');
        const third     = data.rounds['3rd']?.matches?.[0];
        return (
          <>
            <VisualBracket rounds={data.rounds} roundOrder={mainOrder} showAvatar={showAvatar} />
            {third && (
              <div style={{
                marginTop: 28, paddingTop: 20,
                borderTop: '2px dashed var(--line-blue)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: '.78rem',
                  fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase',
                  color: '#b45309', marginBottom: 12,
                }}>🥉 Tranh hạng 3</p>
                <div style={{ maxWidth: 280 }}>
                  <VBMatch m={third} showAvatar={showAvatar} />
                </div>
              </div>
            )}
          </>
        );
      })()}
      {tab === 'medals'  && <MedalsPanel data={data} />}
      {tab === 'scorers' && <TopScorers />}

      {!hasKnockout && !hasGroups && tab !== 'scorers' && tab !== 'medals' && (
        <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>Chưa có trận đấu.</p>
      )}
    </div>
  );
}

/* ─── Per-sport section ─── */
function SportSection({ sport }) {
  const hasCategories = sport.hasCategories && sport.categories?.length > 0;
  const [catName, setCatName] = useState(sport.categories?.[0]?.name ?? '');

  /* Active data: either the selected category or sport itself */
  const activeData = hasCategories
    ? (sport.categories.find(c => c.name === catName) || sport.categories[0])
    : sport;

  return (
    <section className="sport-section card">
      <div className="sport-section-head">
        <SportIcon icon={sport.icon} size="2rem" />
        <h2 className="sport-section-name">{sport.name}</h2>
      </div>

      {/* Category tabs (e.g. Đơn nam / Đơn nữ / Đôi nam / Đôi nữ) */}
      {hasCategories && (
        <div className="sport-tabs" style={{ marginBottom: 8, flexWrap: 'wrap' }}>
          {sport.categories.map(c => (
            <button key={c.name}
              className={`sport-tab ${catName === c.name ? 'active' : ''}`}
              onClick={() => setCatName(c.name)}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Bracket content — remounts when category changes to reset inner tab */}
      <BracketContent key={catName} data={activeData} sportId={sport.id} />
    </section>
  );
}

/* ─── Overall medal standings across all sports ─── */
function OverallMedals({ data }) {
  /* Per-sport medal summary (auto-computed from bracket results) */
  const rows = [];
  data.forEach(sp => {
    if (sp.hasCategories) {
      sp.categories.forEach(cat => {
        const m = computeMedals(cat);
        if (m.gold || m.silver || m.bronze)
          rows.push({ sportName: sp.name, sportIcon: sp.icon, catName: cat.name, ...m });
      });
    } else {
      const m = computeMedals(sp);
      if (m.gold || m.silver || m.bronze)
        rows.push({ sportName: sp.name, sportIcon: sp.icon, catName: '', ...m });
    }
  });

  /* Medal tally: fetched from dedicated "medals" sheet (manually entered) */
  const { data: tallyData } = useFetch(() => api.getMedals(), []);
  const ranked = (tallyData || [])
    .map(t => ({ ...t, total: (t.gold || 0) + (t.silver || 0) + (t.bronze || 0) }))
    .sort((a, b) => b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze || b.total - a.total || a.name.localeCompare(b.name, 'vi'));

  if (!rows.length && !ranked.length) return (
    <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>Chưa có kết quả huy chương.</p>
  );

  return (
    <div className="om-layout">
      {/* ── Medal tally table ── */}
      <div className="om-tally-section">
        <div className="om-card-title">🏆 Bảng tổng sắp</div>
        <table className="om-tally-table">
          <thead>
            <tr>
              <th className="om-th-tt">TT</th>
              <th className="om-th-team">Tổ</th>
              <th className="om-th-medal"><span className="om-th-icon">🥇</span></th>
              <th className="om-th-medal"><span className="om-th-icon">🥈</span></th>
              <th className="om-th-medal"><span className="om-th-icon">🥉</span></th>
              <th className="om-th-total">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r, i) => (
              <tr key={r.name} className={`om-tally-row${i === 0 && r.gold > 0 ? ' om-tally-top' : ''}`}>
                <td className="om-td-tt">{i + 1}</td>
                <td className="om-td-team">{r.name}</td>
                <td className="om-td-medal om-gold-val">{r.gold || 0}</td>
                <td className="om-td-medal om-silver-val">{r.silver || 0}</td>
                <td className="om-td-medal om-bronze-val">{r.bronze || 0}</td>
                <td className="om-td-total">{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Per-sport medal summary ── */}
      {rows.length > 0 && (
        <div className="om-card">
          <div className="om-card-title">🏅 Kết quả theo môn</div>
          <table className="om-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Môn thi đấu</th>
                <th>🥇</th>
                <th>🥈</th>
                <th>🥉</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="om-sport-name">
                    <SportIcon icon={r.sportIcon} size="1.1em" /> {r.sportName}
                    {r.catName && <span className="om-cat">{r.catName}</span>}
                  </td>
                  <td className="om-gold">{r.gold   || <span className="om-empty">—</span>}</td>
                  <td className="om-silver">{r.silver || <span className="om-empty">—</span>}</td>
                  <td className="om-bronze">{r.bronze || <span className="om-empty">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Main page ─── */
export default function Bracket() {
  const { t } = useLanguage();
  const { data, loading, error } = useFetch(() => api.getBracket(), []);
  const [showOverall, setShowOverall] = useState(true);

  return (
    <div className="page">
      <header className="page-header">
        <div className="container">
          <h1>{t('page_bracket_title')}</h1>
          <p>{t('page_bracket_sub')}</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {loading && <Loading />}
          {error   && <ErrorState message={error} />}
          {data && data.length === 0 && <Empty label="Chưa có dữ liệu thi đấu." />}

          {/* ── Overall medal standings ── */}
          {data && data.length > 0 && (
            <div className="om-section">
              <button className="om-toggle" onClick={() => setShowOverall(v => !v)}>
                <span>🏅 Tổng sắp huy chương</span>
                <span className="om-toggle-arrow">{showOverall ? '▲' : '▼'}</span>
              </button>
              {showOverall && <OverallMedals data={data} />}
            </div>
          )}

          {data && data.map(sp => <SportSection key={sp.id} sport={sp} />)}
        </div>
      </section>
    </div>
  );
}
