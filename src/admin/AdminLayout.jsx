import { NavLink, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import TournamentManager from './TournamentManager.jsx';
import SportsManager from './SportsManager.jsx';
import MatchManager from './MatchManager.jsx';
import GalleryManager from './GalleryManager.jsx';
import UserManager from './UserManager.jsx';
import './admin.css';

const NAV = [
  { to: '/admin', end: true, icon: '📊', label: 'Dashboard' },
  { to: '/admin/tournaments', icon: '🏆', label: 'Giải đấu' },
  { to: '/admin/sports', icon: '⚽', label: 'Môn thể thao' },
  { to: '/admin/matches', icon: '🎯', label: 'Trận đấu' },
  { to: '/admin/gallery', icon: '🖼️', label: 'Thư viện ảnh' },
];

export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <Link to="/admin">
            🏆 QAQC Admin
          </Link>
          <span>Sport Tournament</span>
        </div>

        <nav className="admin-nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">{n.icon}</span> {n.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin/users"
              className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">👥</span> Người dùng
            </NavLink>
          )}
          <Link to="/" style={{ marginTop: 8 }}>
            <span className="nav-icon">🌐</span> Về trang chủ
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <strong>{user?.username}</strong>
          <span className={`badge badge-${user?.role}`}>{user?.role}</span>
          <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </aside>

      <main className="admin-main">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/tournaments" element={<TournamentManager />} />
          <Route path="/sports" element={<SportsManager />} />
          <Route path="/matches" element={<MatchManager />} />
          <Route path="/gallery" element={<GalleryManager />} />
          {isAdmin && <Route path="/users" element={<UserManager />} />}
          <Route path="*" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}
