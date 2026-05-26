import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { adminApi } from '../utils/api.js';

const QUICK_LINKS = [
  { to: '/admin/tournaments', icon: '🏆', label: 'Quản lý giải đấu', desc: 'Tạo & chỉnh sửa giải đấu' },
  { to: '/admin/sports', icon: '⚽', label: 'Môn thể thao', desc: 'Thêm môn thi đấu' },
  { to: '/admin/matches', icon: '🎯', label: 'Trận đấu', desc: 'Cập nhật kết quả' },
  { to: '/admin/gallery', icon: '🖼️', label: 'Thư viện ảnh', desc: 'Upload ảnh sự kiện' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);

  useEffect(() => {
    adminApi.getStats().then(setStats).catch(() => {});
    adminApi.getMatches({ status: 'live' }).then(setRecentMatches).catch(() => {});
  }, []);

  const hasDb = Boolean(import.meta.env.VITE_SUPABASE_URL);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Xin chào, {user?.username}!</p>
        </div>
      </div>

      {!hasDb && (
        <div className="alert alert-warning">
          ⚠️ <strong>Chưa cấu hình database.</strong> Các tính năng CRUD yêu cầu Supabase.
          Xem <code>.env.example</code> để thiết lập <code>SUPABASE_URL</code>, <code>SUPABASE_SERVICE_ROLE_KEY</code>.
          Hiện tại dữ liệu đọc từ file tĩnh, chỉ auth hoạt động qua env vars.
        </div>
      )}

      {stats && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-num">{stats.sportsCount}</div>
            <div className="stat-label">Môn thể thao</div>
          </div>
          <div className="admin-stat-card blue">
            <div className="stat-num">{stats.teamsCount}</div>
            <div className="stat-label">Đội thi đấu</div>
          </div>
          <div className="admin-stat-card red">
            <div className="stat-num">{stats.matchesCount}</div>
            <div className="stat-label">Trận đấu</div>
          </div>
          <div className="admin-stat-card purple">
            <div className="stat-num">{stats.athletes?.total ?? '—'}</div>
            <div className="stat-label">Vận động viên</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginBottom: 32 }}>
        {QUICK_LINKS.map((ql) => (
          <Link key={ql.to} to={ql.to} style={{ textDecoration: 'none' }}>
            <div className="admin-stat-card" style={{ borderLeft: '4px solid #0b1f3a', cursor: 'pointer' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{ql.icon}</div>
              <div style={{ fontWeight: 700, color: '#0b1f3a', fontSize: '.95rem' }}>{ql.label}</div>
              <div style={{ fontSize: '.78rem', color: '#667', marginTop: 2 }}>{ql.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {recentMatches.length > 0 && (
        <div className="admin-table-wrap">
          <div className="admin-table-toolbar">
            <strong style={{ color: '#0b1f3a' }}>🔴 Trận đang diễn ra</strong>
          </div>
          <table className="admin-table">
            <thead><tr><th>Môn</th><th>Đội nhà</th><th>Tỷ số</th><th>Đội khách</th><th>Vòng</th></tr></thead>
            <tbody>
              {recentMatches.map((m) => (
                <tr key={m.id}>
                  <td>{m.sportName || m.sport_id}</td>
                  <td>{m.homeName || m.home_team_id}</td>
                  <td><strong>{m.home_score ?? '—'} : {m.away_score ?? '—'}</strong></td>
                  <td>{m.awayName || m.away_team_id}</td>
                  <td>{m.round}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
