// admin-panel/app/licenses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Key, RefreshCw, ShieldCheck, User, Power, LogOut, Edit, X, Calendar } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Create Formu
  const [formData, setFormData] = useState({ key: '', owner: '', expiresAt: '' });

  // DÜZENLEME MODU İÇİN STATE'LER
  const [editingLicense, setEditingLicense] = useState<any>(null); // Hangi lisans düzenleniyor?
  const [editForm, setEditForm] = useState({ owner: '', expiresAt: '' });

  // 🛡️ GÜVENLİK
  useEffect(() => {
    const isAdmin = sessionStorage.getItem('adminAuth');
    if (!isAdmin) router.push('/login');
    else fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const res = await fetch('http://localhost:4000/list');
      const data = await res.json();
      setLicenses(data);
    } catch (error) { toast.error('Sunucu hatası!'); }
  };

  // Yeni Ekle
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('Lisans üretildi!');
        setFormData({ key: '', owner: '', expiresAt: '' });
        fetchLicenses();
      }
    } catch { toast.error('Hata.'); } 
    finally { setLoading(false); }
  };

  // Sil
  const handleDelete = async (id: string) => {
    if(!confirm('Silmek istediğine emin misin?')) return;
    try {
        await fetch(`http://localhost:4000/delete/${id}`, { method: 'DELETE' });
        toast.success('Silindi.');
        fetchLicenses();
    } catch { toast.error('Silinemedi.'); }
  };

  // Durum Değiştir
  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
        await fetch(`http://localhost:4000/toggle/${id}`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: !currentStatus }) 
        });
        toast.success('Durum güncellendi.');
        fetchLicenses();
    } catch { toast.error('Hata.'); }
  };

  // 🟡 DÜZENLEME PENCERESİNİ AÇ
  const openEditModal = (license: any) => {
    setEditingLicense(license);
    // Mevcut tarihi forma doldur (Tarih formatını inputa uydurmak için kesiyoruz)
    const formattedDate = license.expiresAt ? new Date(license.expiresAt).toISOString().split('T')[0] : '';
    setEditForm({ owner: license.owner, expiresAt: formattedDate });
  };

  // 🟢 GÜNCELLEMEYİ KAYDET
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLicense) return;

    try {
      const res = await fetch(`http://localhost:4000/update/${editingLicense.id}`, {
        method: 'PUT', // Güncelleme metodu
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        toast.success('Lisans güncellendi! ✅');
        setEditingLicense(null); // Modalı kapat
        fetchLicenses(); // Listeyi yenile
      } else {
        toast.error('Güncellenemedi.');
      }
    } catch {
      toast.error('Sunucu hatası.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    router.push('/login');
  };

  const generateRandomKey = () => {
    const key = 'LISANS-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setFormData({ ...formData, key });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10 relative">
      <Toaster />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg"><ShieldCheck size={40} /></div>
            <div><h1 className="text-3xl font-bold">Patron Paneli</h1><p className="text-gray-400">Yönetim Merkezi</p></div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"><LogOut size={18}/> Çıkış</button>
        </div>

        {/* Ekleme Formu */}
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl mb-12">
           <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-400"><Plus size={20}/> Yeni Lisans Üret</h2>
           <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative group">
                    <Key className="absolute left-3 top-3.5 text-gray-500" size={18} />
                    <input type="text" placeholder="Lisans Anahtarı" required className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 text-white outline-none focus:border-indigo-500 transition font-mono" value={formData.key} onChange={(e) => setFormData({...formData, key: e.target.value})} />
                    <button type="button" onClick={generateRandomKey} className="absolute right-2 top-2 p-1.5 bg-gray-700 rounded-lg hover:bg-gray-600 text-xs text-gray-300"><RefreshCw size={14} /></button>
                </div>
                <div className="relative"><User className="absolute left-3 top-3.5 text-gray-500" size={18} /><input type="text" placeholder="Müşteri Adı" required className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 text-white outline-none focus:border-indigo-500 transition" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} /></div>
                <input type="date" className="bg-gray-800 border border-gray-700 rounded-xl py-3 px-4 text-white outline-none focus:border-indigo-500 transition" value={formData.expiresAt} onChange={(e) => setFormData({...formData, expiresAt: e.target.value})} />
                <button disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition active:scale-95">{loading ? '...' : 'Anahtarı Bas ⚡'}</button>
           </form>
        </div>

        {/* Liste */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
          <table className="w-full text-left">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
              <tr>
                <th className="p-5">Anahtar</th>
                <th className="p-5">Müşteri</th>
                <th className="p-5">Durum</th>
                <th className="p-5">Bitiş Tarihi</th>
                <th className="p-5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {licenses.map((lic: any) => (
                <tr key={lic.id} className="hover:bg-gray-800/50 transition">
                  <td className="p-5 font-mono text-indigo-400 font-bold">{lic.key}</td>
                  <td className="p-5 font-medium">{lic.owner}</td>
                  <td className="p-5"><span className={`px-3 py-1 rounded-full text-xs font-bold ${lic.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{lic.isActive ? 'AKTİF' : 'PASİF'}</span></td>
                  <td className="p-5 text-sm text-gray-400">{lic.expiresAt ? new Date(lic.expiresAt).toLocaleDateString('tr-TR') : 'Süresiz'}</td>
                  <td className="p-5 text-right flex justify-end gap-2">
                    {/* DÜZENLE BUTONU (Yeni) */}
                    <button onClick={() => openEditModal(lic)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition"><Edit size={18} /></button>
                    <button onClick={() => handleToggle(lic.id, lic.isActive)} className={`p-2 rounded-lg transition ${lic.isActive ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}><Power size={18} /></button>
                    <button onClick={() => handleDelete(lic.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🟢 DÜZENLEME MODALI (POPUP) */}
      {editingLicense && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setEditingLicense(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>
            
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
              <Edit className="text-blue-500" /> Lisansı Düzenle
            </h2>
            
            <div className="mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Seçili Lisans</p>
                <p className="font-mono text-blue-400 font-bold tracking-wider">{editingLicense.key}</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Müşteri Adı</label>
                <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-500" size={18} />
                    <input type="text" className="w-full bg-gray-800 border border-gray-600 rounded-xl py-3 pl-10 text-white outline-none focus:border-blue-500 transition" 
                        value={editForm.owner} onChange={(e) => setEditForm({...editForm, owner: e.target.value})} 
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Yeni Bitiş Tarihi</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 text-gray-500" size={18} />
                    <input type="date" className="w-full bg-gray-800 border border-gray-600 rounded-xl py-3 pl-10 text-white outline-none focus:border-blue-500 transition" 
                        value={editForm.expiresAt} onChange={(e) => setEditForm({...editForm, expiresAt: e.target.value})} 
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">* Tarihi boş bırakırsanız "Süresiz" olur.</p>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition mt-4">
                Değişiklikleri Kaydet
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}