import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Plus, Trash2, Pencil, ToggleLeft, ToggleRight, Loader2, X, Upload, Search, Newspaper, Save } from 'lucide-react';
import { ModernAlert } from '../../Modals/Alert';
import ConfirmationModal from '../../Modals/ConfirmationModal';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const getToken = () => localStorage.getItem('adminToken');
const EMPTY_FORM = { title: '', message: '', isActive: true, expiresAt: '' };

export default function NewsPopupManagement() {
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirm, setConfirm] = useState({ show: false, title: '', message: '', onConfirm: null, confirmText: 'Confirm' });

  useEffect(() => { fetchPopups(); }, []);

  const fetchPopups = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE_URL}/api/content/news-popup/admin/all`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const d = await r.json();
      if (d.success) setPopups(d.data); else throw new Error(d.message);
    } catch (e) { toast.error('Failed to fetch news popups'); }
    finally { setLoading(false); }
  };

  const showAlert = (message) => {
    setAlert({ show: true, message, type: 'success' });
    setTimeout(() => setAlert(a => ({ ...a, show: false })), 3000);
  };

  const closeConfirm = () => setConfirm(c => ({ ...c, show: false }));

  const filtered = useMemo(() =>
    !searchTerm.trim() ? popups : popups.filter(p =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.message?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [popups, searchTerm]);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setImageFile(null); setPreview(null); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ title: p.title, message: p.message || '', isActive: p.isActive, expiresAt: p.expiresAt ? p.expiresAt.slice(0, 16) : '' });
    setImageFile(null); setPreview(p.image); setModalOpen(true);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please select a valid image file');
    if (file.size > 10 * 1024 * 1024) return toast.error('File size must be less than 10MB');
    setImageFile(file); setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required');
    if (!editing && !imageFile) return toast.error('Image is required');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      const url = editing ? `${API_BASE_URL}/api/content/news-popup/admin/${editing._id}` : `${API_BASE_URL}/api/content/news-popup/admin`;
      const r = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { Authorization: `Bearer ${getToken()}` }, body: fd });
      const d = await r.json();
      if (!d.success) throw new Error(d.message);
      setModalOpen(false); fetchPopups(); showAlert(editing ? 'Popup updated successfully!' : 'Popup created successfully!');
    } catch (e) { toast.error(e.message || 'Failed to save popup'); }
    finally { setSaving(false); }
  };

  const handleDelete = (p) => setConfirm({
    show: true, title: 'Delete Popup?',
    message: `Are you sure you want to delete "${p.title}"? This action cannot be undone.`,
    confirmText: 'Delete',
    onConfirm: async () => {
      try {
        const r = await fetch(`${API_BASE_URL}/api/content/news-popup/admin/${p._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
        const d = await r.json();
        if (!d.success) throw new Error(d.message);
        fetchPopups(); showAlert('Popup deleted successfully!');
      } catch (e) { toast.error(e.message || 'Failed to delete popup'); }
      finally { closeConfirm(); }
    },
  });

  const handleToggle = async (p) => {
    try {
      const r = await fetch(`${API_BASE_URL}/api/content/news-popup/admin/${p._id}/toggle`, { method: 'PATCH', headers: { Authorization: `Bearer ${getToken()}` } });
      const d = await r.json();
      if (!d.success) throw new Error(d.message);
      fetchPopups(); showAlert(d.message || 'Status updated');
    } catch (e) { toast.error(e.message || 'Failed to update status'); }
  };

  const toggleSelect = (id, checked) => { const s = new Set(selected); checked ? s.add(id) : s.delete(id); setSelected(s); };
  const toggleAll = (checked) => setSelected(checked ? new Set(filtered.map(p => p._id)) : new Set());

  const handleBulkDelete = () => {
    if (!selected.size) return;
    const count = selected.size;
    setConfirm({
      show: true, title: 'Delete Multiple Popups?',
      message: `Are you sure you want to delete ${count} popup${count > 1 ? 's' : ''}? This action cannot be undone.`,
      confirmText: `Delete ${count} Popup${count > 1 ? 's' : ''}`,
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await Promise.all(Array.from(selected).map(id =>
            fetch(`${API_BASE_URL}/api/content/news-popup/admin/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } })
          ));
          setSelected(new Set()); fetchPopups(); showAlert(`${count} popup${count > 1 ? 's' : ''} deleted successfully!`);
        } catch (e) { toast.error('Failed to delete selected popups'); }
        finally { setIsDeleting(false); closeConfirm(); }
      },
    });
  };

  const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p._id));
  const inputCls = 'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500';
  const labelCls = 'block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1';

  return (
    <div className="px-4 py-0 bg-gray-200 dark:bg-gray-900 rounded-xl">
      <div className="flex flex-col h-full">

        {alert.show && <div className="mb-4"><ModernAlert message={alert.message} type={alert.type} /></div>}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-sky-400" />
              News Popup Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} of {popups.length} popup{popups.length !== 1 ? 's' : ''}
              {selected.size > 0 && ` • ${selected.size} selected`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search popups..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition-colors w-64" />
            </div>
            {selected.size > 0 && (
              <button onClick={handleBulkDelete} disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-3 bg-red-500 dark:bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-600 dark:hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Selected ({selected.size})
              </button>
            )}
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 dark:bg-sky-600 text-white text-sm font-medium rounded-xl hover:bg-sky-600 dark:hover:bg-sky-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Popup
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-sky-500" /><p>Loading news popups...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 max-w-md mx-auto">
                <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{searchTerm ? 'No matching popups' : 'No popups yet'}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{searchTerm ? `No popups match "${searchTerm}". Try a different search term.` : 'Create your first news popup to get started'}</p>
                {!searchTerm && <button onClick={openAdd} className="px-4 py-2 bg-sky-600 dark:bg-sky-700 text-white text-sm font-medium rounded-xl hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors">Add Popup</button>}
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3">
                      <input type="checkbox" checked={allSelected} onChange={e => toggleAll(e.target.checked)} className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded" />
                    </th>
                    {['Preview', 'Title', 'Message', 'Expires At', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.map(p => {
                    const expired = p.expiresAt && new Date(p.expiresAt) < new Date();
                    return (
                      <tr key={p._id} className={`transition-colors ${selected.has(p._id) ? 'bg-sky-50 dark:bg-sky-900/20' : 'hover:bg-sky-50 dark:hover:bg-gray-700/40'}`}>
                        <td className="px-6 py-4">
                          <input type="checkbox" checked={selected.has(p._id)} onChange={e => toggleSelect(p._id, e.target.checked)} className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded" />
                        </td>
                        <td className="px-6 py-4"><img src={p.image} alt="" className="w-16 h-12 object-cover rounded-lg" /></td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{p.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">{p.message || '—'}</td>
                        <td className="px-6 py-4 text-sm">
                          {p.expiresAt
                            ? <span className={expired ? 'text-red-500' : 'text-green-600'}>{new Date(p.expiresAt).toLocaleDateString()}{expired ? ' (Expired)' : ''}</span>
                            : <span className="text-gray-600 dark:text-gray-300">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.isActive && !expired ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                            {p.isActive && !expired ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/30 text-sky-500 transition-colors"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleToggle(p)} className={`p-1.5 rounded-lg transition-colors ${p.isActive ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                              {p.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                            </button>
                            <button onClick={() => handleDelete(p)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <ConfirmationModal isOpen={confirm.show} title={confirm.title} message={confirm.message} confirmText={confirm.confirmText}
          cancelText="Cancel" danger onConfirm={confirm.onConfirm} onCancel={closeConfirm} darkMode={false} />

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editing ? 'Edit Popup' : 'Add New Popup'}</h2>
                  <button onClick={() => setModalOpen(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                    <X size={18} className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Poster Image {!editing && '*'}</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-3 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                      <input type="file" accept="image/*" className="hidden" id="popupImage" onChange={handleImage} />
                      <label htmlFor="popupImage" className="cursor-pointer">
                        {preview ? (
                          <div className="space-y-1">
                            <img src={preview} alt="Preview" className="mx-auto max-h-40 rounded-xl object-cover" />
                            <p className="text-xs text-gray-600 dark:text-gray-400">Click to change image</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Upload size={24} className="mx-auto text-gray-400" />
                            <p className="text-xs text-gray-600 dark:text-gray-400">Click to upload (Max 10MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Title *</label>
                    <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Happy Khmer New Year!" className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Message</label>
                    <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3} placeholder="Optional message..." className={`${inputCls} resize-none`} />
                  </div>

                  <div>
                    <label className={labelCls}>Expires At <span className="text-gray-400 font-normal">(leave empty = no expiry)</span></label>
                    <input type="datetime-local" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} className={inputCls} />
                  </div>

                  <div className="flex items-center">
                    <input type="checkbox" id="popupActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded" />
                    <label htmlFor="popupActive" className="ml-2 text-xs text-gray-700 dark:text-gray-200">Set as active popup</label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-5 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => setModalOpen(false)} className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-1.5 rounded-xl flex items-center gap-1 text-xs transition-colors disabled:opacity-50">
                    {saving ? <><Loader2 className="w-3 h-3 animate-spin" />{editing ? 'Updating...' : 'Creating...'}</> : <><Save size={14} />{editing ? 'Update' : 'Create'}</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}