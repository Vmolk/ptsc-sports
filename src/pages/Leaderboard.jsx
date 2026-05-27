import { useState } from 'react';
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { Loading, ErrorState, Empty } from '../components/States.jsx';
import './Leaderboard.css';

export default function Leaderboard() {
  const [tab, setTab] = useState('teams');
  const { data, loading, error } = useFetch(() => api.getLeaderboard(), []);

  const teams       = data?.teams       || [];
  const individuals = data?.individuals || [];

  return (
    <div className="page">
      <header className="page-header">
        <div className="container">
          <h1>Bảng xếp hạng</h1>
          <p>Vàng × 3 &nbsp;·&nbsp; Bạc × 2 &nbsp;·&nbsp; Đồng × 1</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {/* Tab switcher */}
          <div className="lb-tabs">
            <button
              className={`lb-tab${tab === 'teams' ? ' active' : ''}`}
              onClick={() => setTab('teams')}
            >
              🏆 Đồng đội
            </button>
            <button
              className={`lb-tab${tab === 'individuals' ? ' active' : ''}`}
              onClick={() => setTab('individuals')}
            >
              🥇 Cá nhân
            </button>
          </div>

          {loading && <Loading />}
          {error   && <ErrorState message={error} />}

          {/* ---- TEAM TABLE ---- */}
          {!loading && !error && tab === 'teams' && (
            teams.length === 0 ? <Empty /> : (
              <table className="lb-table reveal">
                <thead>
                  <tr>
                    <th>#</th>
                    <th style={{ textAlign: 'left' }}>Đội / Phòng ban</th>
                    <th>🥇</th>
                    <th>🥈</th>
                    <th>🥉</th>
                    <th className="hide-sm">Tổng</th>
                    <th>Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((row) => (
                    <tr key={row.teamId}>
                      <td>
                        <span className={`lb-rank ${row.rank <= 3 ? `top${row.rank}` : ''}`}>
                          {row.rank}
                        </span>
                      </td>
                      <td className="team-col">
                        <div className="team-cell">
                          <span className="team-dot" style={{ background: row.color }}>
                            {row.short}
                          </span>
                          {row.name}
                        </div>
                      </td>
                      <td>{row.gold   || '—'}</td>
                      <td>{row.silver || '—'}</td>
                      <td>{row.bronze || '—'}</td>
                      <td className="hide-sm">{row.total}</td>
                      <td className="lb-points">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {/* ---- INDIVIDUAL TABLE ---- */}
          {!loading && !error && tab === 'individuals' && (
            individuals.length === 0 ? <Empty /> : (
              <table className="lb-table reveal">
                <thead>
                  <tr>
                    <th>#</th>
                    <th style={{ textAlign: 'left' }}>Vận động viên</th>
                    <th className="hide-sm">Phòng ban</th>
                    <th>🥇</th>
                    <th>🥈</th>
                    <th>🥉</th>
                    <th className="hide-sm">Môn</th>
                    <th>Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {individuals.map((row) => (
                    <tr key={row.athlete}>
                      <td>
                        <span className={`lb-rank ${row.rank <= 3 ? `top${row.rank}` : ''}`}>
                          {row.rank}
                        </span>
                      </td>
                      <td className="team-col">{row.athlete}</td>
                      <td className="hide-sm">{row.dept || '—'}</td>
                      <td>{row.gold   || '—'}</td>
                      <td>{row.silver || '—'}</td>
                      <td>{row.bronze || '—'}</td>
                      <td className="hide-sm">{row.sports?.join(', ') || '—'}</td>
                      <td className="lb-points">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </section>
    </div>
  );
}
