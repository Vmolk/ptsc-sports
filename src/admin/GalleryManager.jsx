import { useState, useEffect, useRef } from 'react';
import { adminApi } from '../utils/api.js';

const EMPTY = { title: '', url: '', sport_id: '', day: 1 };

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.getGallery(), adminApi.getSports()])
      .then(([g, s]) => { setItems(g); setSports(s); })
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setForm(EMPTY); setError(''); setModal(true); };
  const close = () => setModal(false);

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { setError('File tối đa 8MB'); return; }
    setUploading(true); setError('');
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(',')[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const result = await adminApi.uploadImage({ file: base64, filename: file.name, type: file.type });
      setForm((f) => ({ ...f, url: result.url }));
    } catch (e) { setError('Upload thất bại: ' + e.message); }
    finally { setUploading(false); }
  };

  const save = async () => {
    if (!form.url.trim()) { setError('URL ảnh không được để trống'); return; }
    setSaving(true); setError('');
    try { await adminApi.createGalleryItem(form); close(); load(); }
    catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  const remove = async (item) => {
    if (!confirm('Xoá ảnh này?')) return;
    try { await adminApi.deleteGalleryItem(item.id); load(); } catch (e) { alert(e.message); }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Thư viện ảnh</h1><p className="admin-page-subtitle">Upload & quản lý ảnh sự kiện</p></div>
        <button className="btn btn-gold" onClick={openNew}>+ Upload ảnh</button>
      </div>

      {loading ? <div style={{ padding: 32, textAlign: 'center', color: '#889' }}>Đang tải...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: item.color || '#1d3557', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
              {item.url ? (
                <img src={item.url} alt={item.title} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🖼️</div>
              )}
              <div style={{ padding: '10px 12px' }}>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '.85rem' }}>{item.title}</div>
                {item.day && <div style={{ color: 'rgba(255,255,255,.6)', fontSize: '.75rem' }}>Ngày {item.day}</div>}
              </div>
              <button onClick={() => remove(item)} className="btn btn-danger btn-sm" style={{ position: 'absolute', top: 8, right: 8, padding: '4px 8px', fontSize: '.7rem' }}>✕</button>
            </div>
          ))}
          {items.length === 0 && (
            <div className="admin-empty" style={{ gridColumn: '1/-1' }}>
              <span className="empty-icon">🖼️</span><p>Chưa có ảnh nào</p>
              <button className="btn btn-primary" onClick={openNew}>Upload ảnh đầu tiên</button>
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="modal">
            <div className="modal-header"><h2>Upload ảnh</h2><button className="modal-close" onClick={close}>✕</button></div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group">
                <label className="form-label">Upload file</label>
                <div className="upload-area" onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files?.[0])} />
                  {uploading ? <p>⏳ Đang upload...</p> : <><p style={{ fontSize: '1.5rem' }}>📎</p><p>Click để chọn ảnh (tối đa 8MB)</p></>}
                </div>
                {form.url && <img src={form.url} alt="" className="img-preview" />}
              </div>
              <div className="form-group"><label className="form-label">Hoặc nhập URL trực tiếp</label><input className="form-control" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
              <div className="form-group"><label className="form-label">Tiêu đề</label><input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Môn thể thao</label><select className="form-control form-select" value={form.sport_id} onChange={(e) => setForm({ ...form, sport_id: e.target.value })}><option value="">-- Tất cả --</option>{sports.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Ngày</label><input type="number" min={1} className="form-control" value={form.day} onChange={(e) => setForm({ ...form, day: +e.target.value })} /></div>
              </div>
            </div>
            <div className="modal-footer"><button className="btn btn-ghost" onClick={close}>Huỷ</button><button className="btn btn-primary" onClick={save} disabled={saving || uploading}>{saving ? 'Đang lưu...' : 'Lưu'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
