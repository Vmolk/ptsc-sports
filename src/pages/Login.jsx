import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Login.css';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [form, setForm] = useState({ username: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: null });

  if (user) {
    return (
      <div className="login-wrap">
        <div className="login-card card reveal">
          <span className="login-mark" aria-hidden="true">🏆</span>
          <h1 className="login-title">Đã đăng nhập</h1>
          <p className="login-sub">QAQC Sport Tournament</p>
          <p style={{ textAlign: 'center', marginBottom: 16 }}>Xin chào, <strong>{user.username}</strong>!</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {(user.role === 'admin' || user.role === 'editor') && (
              <Link to="/admin" className="btn btn-primary">Vào Admin Panel</Link>
            )}
            <Link to="/" className="btn btn-gold">Về trang chủ</Link>
          </div>
        </div>
      </div>
    );
  }

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null });
    try {
      const u = await login(form.username, form.password);
      if (u.role === 'admin' || u.role === 'editor') navigate('/admin', { replace: true });
      else navigate(from, { replace: true });
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card card reveal">
        <span className="login-mark" aria-hidden="true">🏆</span>
        <h1 className="login-title">Đăng nhập</h1>
        <p className="login-sub">QAQC Sport Tournament</p>

        <form onSubmit={onSubmit} className="login-form">
          <label>
            Tên đăng nhập
            <input name="username" value={form.username} onChange={onChange} autoComplete="username" required />
          </label>
          <label>
            Mật khẩu
            <input type="password" name="password" value={form.password} onChange={onChange} autoComplete="current-password" required />
          </label>
          {status.error && <p className="login-error">⚠️ {status.error}</p>}
          <button className="btn btn-primary login-btn" disabled={status.loading}>
            {status.loading ? 'Đang xử lý…' : 'Đăng nhập'}
          </button>
          <p className="login-hint">Admin/Editor sẽ được chuyển vào trang quản trị.</p>
        </form>
      </div>
    </div>
  );
}
