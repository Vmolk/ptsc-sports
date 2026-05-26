import { useState, useEffect } from 'react';
import { adminApi } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const EMPTY = { username: '', password: '', email: '', role: 'viewer' };
const ROLES = ['admin', 'editor', 'viewer'];

export default function UserManager() {
  const { user: currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [noDb, setNoDb] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.getUsers()
      .then(setItems)
      .catch((e) => { if (e.message?.includes('503') || e.message?.includes('configured')) setNoDb(true); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setForm(EMPTY); setError(''); setModal('new'); };
  const openEdit = (item) => { setForm({ username: item.username, password: '', email: item.email || '', role: item.role }); setError(''); setModal(item); };
  const close = () => setModal(null);

  const save = async () => {
    if (!form.username.trim()) { setError('Username không được để trống'); return; }
    if (modal === 'new' && !form.password) { setError('Password không được để trống'); return; }
    setSaving(true); setError('');
    try {
      if (modal === 'new') await adminApi.createUser(form);
      else {
        const upd = { email: form.email, role: form.role };
        if (form.password) upd.password = form.password;
        await adminApi.updateUser(modal.id, upd);
      }
      close(); load();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  const remove = async (item) => {
    if (item.id === currentUser?.id || item.username === currentUser?.username) { alert('Không thể xoá tài khoản đang đăng nhập'); return; }
    if (!confirm(`Xoá người dùng "${item.username}"?`)) return;
    try { await adminApi.deleteUser(item.id); load(); } catch (e) { alert(e.message); }
  };

  if (noDb) return (
    <div className="admin-page">
      <h1 className="admin-page-title">Người dùng</h1>
      <div className="alert alert-warning">⚠️ Quản lý người dùng yêu cầu Supabase database. Hãy cấu hình <code>SUPABASE_URL</code> và <code>SUPABASE_SERVICE_ROLE_KEY</code>.</div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Người dùng</h1><p className="admin-page-subtitle">Quản lý tài khoản & phân quyền</p></div>
        <button className="btn btn-gold" onClick={openNew}>+ Thêm người dùng</button>
      </div>

      <div className="admin-table-wrap">
        {loading ? <div style={{ padding: 32, textAlign: 'center', color: '#889' }}>Đang tải...</div> : items.length === 0 ? (
          <div className="admin-empty"><span className="empty-icon">👥</span><p>Chưa có người dùng nào</p><button className="btn btn-primary" onClick={openNew}>Tạo người dùng đầu tiên</button></div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Username</th><th>Email</th><th>Vai trò</th><th>Ngày tạo</th><th>Hành động</th></tr></thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.username}</strong>{u.id === currentUser?.id && <span style={{ marginLeft: 6, fontSize: '.7rem', color: '#2a9d8f' }}>(bạn)</span>}</td>
                  <td>{u.email || '—'}</td>
                  <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td style={{ fontSize: '.8rem' }}>{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                  <td><div className="actions"><button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}>✏️ Sửa</button>{u.id !== currentUser?.id && <button className="btn btn-danger btn-sm" onClick={() => remove(u)}>🗑️</button>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="modal">
            <div className="modal-header"><h2>{modal === 'new' ? 'Thêm người dùng' : `Chỉnh sửa: ${modal.username}`}</h2><button className="modal-close" onClick={close}>✕</button></div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              {modal === 'new' && <div className="form-group"><label className="form-label">Username *</label><input className="form-control" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="off" /></div>}
              <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">{modal === 'new' ? 'Mật khẩu *' : 'Mật khẩu mới (để trống = giữ nguyên)'}</label><input type="password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" /><p className="form-hint">Tối thiểu 6 ký tự</p></div>
              <div className="form-group">
                <label className="form-label">Vai trò</label>
                <select className="form-control form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <p className="form-hint">Admin: toàn quyền · Editor: CRUD · Viewer: chỉ xem</p>
              </div>
            </div>
            <div className="modal-footer"><button className="btn btn-ghost" onClick={close}>Huỷ</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
