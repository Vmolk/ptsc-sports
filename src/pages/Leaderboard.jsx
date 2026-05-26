/**
 * src/pages/Leaderboard.jsx
 * Medal table ranked by computed points (data joined server-side).
 */
import { api } from '../utils/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Loading, ErrorState, Empty } from '../components/States.jsx';

export default function Leaderboard() {
  const { t } = useLanguage();
  const { data, loading, error } = useFetch(() => api.getLeaderboard(), []);

  return (
    <div className="page">
      <header className="page-header">
        <div className="container">
          <h1>{t('nav_leaderboard')}</h1>
          <p>Xếp hạng theo điểm — Vàng×3, Bạc×2, Đồng×1</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {loading && <Loading />}
          {error && <ErrorState message={error} />}
          {data && data.length === 0 && <Empty />}
          {data && data.length > 0 && (
            <table className="lb-table reveal">
              <thead>
                <tr>
                  <th>#</th>
                  <th style={{ textAlign: 'left' }}>Đội</th>
                  <th>🥇</th>
                  <th>🥈</th>
                  <th>🥉</th>
                  <th className="hide-sm">Tổng</th>
                  <th>Điểm</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
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
                    <td>{row.gold}</td>
                    <td>{row.silver}</td>
                    <td>{row.bronze}</td>
                    <td className="hide-sm">{row.total}</td>
                    <td className="lb-points">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
