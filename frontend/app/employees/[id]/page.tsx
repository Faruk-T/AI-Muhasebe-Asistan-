// frontend/app/employees/page.tsx
'use client';

import { useState, useEffect } from 'react';
// TrendingUp'ı buraya ekledik 👇
import { Users, Plus, Phone, Mail, User, Briefcase, DollarSign, Trash2, Edit, X, Save, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Kontrolleri
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Düzenleme modu mu?
  const [selectedId, setSelectedId] = useState<string | null>(null); // Düzenlenecek kişinin ID'si

  // Form Verileri
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    title: '',
    phone: '',
    email: '',
    salary: ''
  });

  // 1. Personelleri Getir
  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:3333/employees');
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Formu Sıfırla
  const resetForm = () => {
    setForm({ firstName: '', lastName: '', title: '', phone: '', email: '', salary: '' });
    setIsEditing(false);
    setSelectedId(null);
  };

  // Yeni Ekleme Butonuna Basınca
  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Düzenle Butonuna Basınca (Verileri Doldur)
  const handleOpenEditModal = (emp: any) => {
    setForm({
      firstName: emp.firstName,
      lastName: emp.lastName,
      title: emp.title || '',
      phone: emp.phone || '',
      email: emp.email || '',
      salary: emp.salary || ''
    });
    setSelectedId(emp.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // KAYDET (Hem Yeni Ekleme Hem Güncelleme)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = isEditing 
      ? `http://localhost:3333/employees/${selectedId}` // Güncelleme URL'i
      : 'http://localhost:3333/employees';              // Ekleme URL'i
    
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...form,
            salary: Number(form.salary) // Sayıya çevirip gönder
        }),
      });

      if (res.ok) {
        toast.success(isEditing ? 'Personel güncellendi! ✅' : 'Personel eklendi! 🎉');
        setShowModal(false);
        resetForm();
        fetchEmployees(); // Listeyi yenile
      } else {
        toast.error('Hata oluştu.');
      }
    } catch {
      toast.error('Sunucu hatası.');
    }
  };

  // SİLME İŞLEMİ
  const handleDelete = async (id: string) => {
    if(!confirm("Bu personeli silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`http://localhost:3333/employees/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Personel silindi.');
        fetchEmployees();
      }
    } catch {
      toast.error('Silinemedi.');
    }
  };

  // İstatistikler
  const totalEmployees = employees.length;
  const totalSalary = employees.reduce((acc, curr) => acc + Number(curr.salary), 0);
  const avgSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white relative overflow-hidden">
      
      {/* Arka Plan Süsü */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
             <h1 className="text-3xl font-black flex items-center gap-3">
               <Users className="text-indigo-500" size={32} /> Personel Yönetimi
             </h1>
             <p className="text-slate-400 mt-1">İnsan kaynakları ve maaş takibi</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <input type="text" placeholder="Personel Ara..." className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 w-full md:w-64" />
             <button onClick={handleOpenAddModal} className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-600/20 whitespace-nowrap">
                <Plus size={20}/> Personel Ekle
             </button>
          </div>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2 text-slate-400">
                 <Users size={18}/> <span className="text-xs font-bold uppercase">Toplam Personel</span>
              </div>
              <p className="text-4xl font-black text-white">{totalEmployees}</p>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2 text-slate-400">
                 <DollarSign size={18}/> <span className="text-xs font-bold uppercase">Aylık Maaş Yükü</span>
              </div>
              <p className="text-4xl font-black text-white">{totalSalary.toLocaleString('tr-TR')} ₺</p>
           </div>
           <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2 text-indigo-300">
                 <TrendingUp size={18}/> <span className="text-xs font-bold uppercase">Ortalama Maaş</span>
              </div>
              <p className="text-4xl font-black text-white">{avgSalary.toLocaleString('tr-TR')} ₺</p>
           </div>
        </div>

        {/* Personel Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {loading ? <p>Yükleniyor...</p> : employees.map((emp) => (
             <div key={emp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition group relative">
                
                {/* 🛠️ DÜZENLEME & SİLME BUTONLARI */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleOpenEditModal(emp)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(emp.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition">
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 border border-slate-700">
                      <User size={24} />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg text-white">{emp.firstName} {emp.lastName}</h3>
                      <p className="text-sm text-slate-400 flex items-center gap-1">
                         <Briefcase size={12}/> {emp.title || 'Ünvan Yok'}
                      </p>
                   </div>
                </div>

                <div className="space-y-3 border-t border-slate-800 pt-4">
                   <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 font-bold flex items-center gap-1"><DollarSign size={14}/> Maaş</span>
                      <span className="text-emerald-400 font-bold">{Number(emp.salary).toLocaleString('tr-TR')} ₺</span>
                   </div>
                   <div className="text-sm text-slate-400 space-y-1 pl-1">
                      <p className="flex items-center gap-2"><Mail size={14} className="text-slate-600"/> {emp.email || '-'}</p>
                      <p className="flex items-center gap-2"><Phone size={14} className="text-slate-600"/> {emp.phone || '-'}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>

      </div>

      {/* --- MODAL (EKLEME & DÜZENLEME) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-md relative">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24}/></button>
              
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  {isEditing ? <Edit className="text-blue-500"/> : <Plus className="text-emerald-500"/>}
                  {isEditing ? 'Personeli Düzenle' : 'Yeni Personel Ekle'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 mb-1 block">Ad</label>
                        <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-indigo-500"
                           value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 mb-1 block">Soyad</label>
                        <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-indigo-500"
                           value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-400 mb-1 block">Ünvan / Görev</label>
                    <input type="text" placeholder="Örn: Satış Müdürü" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-indigo-500"
                       value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-400 mb-1 block">Maaş (Aylık)</label>
                    <input required type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-indigo-500 font-mono"
                       value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 mb-1 block">Telefon</label>
                        <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-indigo-500"
                           value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 mb-1 block">E-Posta</label>
                        <input type="email" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-indigo-500"
                           value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                 </div>

                 <button type="submit" className={`w-full py-3 rounded-xl font-bold text-white mt-4 flex items-center justify-center gap-2 ${isEditing ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
                    <Save size={18}/> {isEditing ? 'Değişiklikleri Kaydet' : 'Personeli Kaydet'}
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}