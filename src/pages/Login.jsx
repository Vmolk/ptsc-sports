/**
 * src/pages/Login.jsx
 * Admin login form posting to the /api/login serverless function.
 * On success, stores the returned token and shows a confirmation.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import './Login.css';

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: null, user: null });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, user: null });
    try {
      const res = await api.login(form.username, form.password);
      // Persist the demo token. Replace with secure cookie auth in prod.
      sessionStorage.setItem('ptsc_token', res.token);
      setStatus({ loading: false, error: null, user: res.user });
    } catch (err) {
      setStatus({ loading: false, error: err.message, user: null });
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card card reveal">
        <span className="login-mark" aria-hidden="true">🏆</span>
        <h1 className="login-title">{t('login')}</h1>
        <p className="login-sub">PTSC M&amp;C Sports Day 2026</p>

        {status.user ? (
          <div className="login-success">
            ✅ Xin chào, <strong>{status.user.username}</strong>! Đăng nhập thành công.
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
              Về trang chủ
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="login-form">
            <label>
              Tên đăng nhập
              <input
                name="username"
                value={form.username}
                onChange={onChange}
                autoComplete="username"
                required
              />
            </label>
            <label>
              Mật khẩu
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                autoComplete="current-password"
                required
              />
            </label>

            {status.error && <p className="login-error">⚠️ {status.error}</p>}

            <button className="btn btn-primary login-btn" disabled={status.loading}>
              {status.loading ? 'Đang xử lý…' : t('login')}
            </button>
            <p className="login-hint">Demo: admin / ptsc2026</p>
          </form>
        )}
      </div>
    </div>
  );
}
