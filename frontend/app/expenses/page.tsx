// frontend/app/expenses/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Wallet, Tag, Calendar, Save, TrendingDown, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Kategori Ekleme Modalı için State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Form State
  const [form, setForm] = useState({
    description: '',
    amount: '',
    categoryId: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Verileri Çek
  const fetchData = async () => {
    try {
      const [expRes, catRes, accRes] = await Promise.all([
        fetch('http://localhost:3333/expenses'),
        fetch('http://localhost:3333/expense-categories'),
        fetch('http://localhost:3333/finance/accounts')
      ]);

      const expData = await expRes.json();
      const catData = await catRes.json();
      const accData = await accRes.json();

      setExpenses(expData);
      setCategories(catData);
      setAccounts(accData);
      
      // Form varsayılanlarını ayarla
      if (catData.length > 0 && !form.categoryId) setForm(prev => ({ ...prev, categoryId: catData[0].id }));
      if (accData.length > 0 && !form.accountId) setForm(prev => ({ ...prev, accountId: accData[0].id }));

    } catch (error) {
      console.error(error);
      toast.error('Veriler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Yeni Kategori Kaydet
  const handleAddCategory = async () => {
    if(!newCategoryName.trim()) return toast.error("Kategori adı boş olamaz.");

    try {
        const res = await fetch('http://localhost:3333/expense-categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCategoryName })
        });

        if(res.ok) {
            toast.success("Kategori eklendi! ✅");
            setNewCategoryName('');
            setShowCategoryModal(false);
            
            // Kategorileri yeniden çek
            const catRes = await fetch('http://localhost:3333/expense-categories');
            const catData = await catRes.json();
            setCategories(catData);
            
            // Yeni ekleneni seçili yap
            const addedCat = catData.find((c: any) => c.name === newCategoryName);
            if(addedCat) setForm(prev => ({ ...prev, categoryId: addedCat.id }));

        } else {
            toast.error("Bu kategori zaten var olabilir.");
        }
    } catch {
        toast.error("Hata oluştu.");
    }
  };

  // Gider Kaydet
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.accountId || !form.categoryId) {
        toast.error('Lütfen tüm alanları doldurun.');
        return;
    }

    try {
        const res = await fetch('http://localhost:3333/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        if (res.ok) {
            toast.success('Gider kaydedildi ve kasadan düşüldü! 💸');
            setForm({ ...form, description: '', amount: '' }); 
            fetchData(); 
        } else {
            const err = await res.json();
            toast.error(err.message || 'Hata oluştu');
        }
    } catch {
        toast.error('Sunucu hatası.');
    }
  };

  // Gider Sil
  const handleDelete = async (id: string) => {
      if(!confirm('Bu gideri silmek istediğine emin misin? Para kasaya iade edilecek.')) return;

      try {
          const res = await fetch(`http://localhost:3333/expenses/${id}`, { method: 'DELETE' });
          if(res.ok) {
              toast.success('Gider silindi, bakiye düzeltildi. ✅');
              fetchData();
          } else {
              toast.error('Silinemedi.');
          }
      } catch {
          toast.error('Hata.');
      }
  }

  if (loading) return <div className="p-10 text-white text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL: FORM */}
        <div className="lg:col-span-1">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl sticky top-8">
                <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-red-400">
                    <TrendingDown /> Yeni Gider Ekle
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Tutar (TL)</label>
                        <div className="relative">
                            <input 
                                type="number" step="0.01" required
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none font-mono text-lg font-bold"
                                placeholder="0.00"
                                value={form.amount}
                                onChange={e => setForm({...form, amount: e.target.value})}
                            />
                            <span className="absolute right-4 top-3.5 text-slate-500 font-bold">₺</span>
                        </div>
                    </div>

                    {/* Kategori Seçimi + Ekleme Butonu */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1"><Tag size={12}/> Kategori</span>
                            <button type="button" onClick={() => setShowCategoryModal(true)} className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[10px] bg-red-500/10 px-2 py-0.5 rounded transition">
                                <Plus size={10}/> YENİ EKLE
                            </button>
                        </label>
                        <select 
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none"
                            value={form.categoryId}
                            onChange={e => setForm({...form, categoryId: e.target.value})}
                        >
                            <option value="" disabled>Seçiniz</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Wallet size={12}/> Ödeme Yapılan Kasa</label>
                        <select 
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none"
                            value={form.accountId}
                            onChange={e => setForm({...form, accountId: e.target.value})}
                        >
                            {accounts.map(a => (
                                <option key={a.id} value={a.id}>{a.name} (Bakiye: {Number(a.balance).toLocaleString('tr-TR')} ₺)</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Calendar size={12}/> Tarih</label>
                        <input type="date" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none"
                            value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1">Açıklama</label>
                        <input type="text" placeholder="Örn: Ofis Kirası" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none"
                            value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                    </div>

                    <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition hover:scale-[1.02] active:scale-[0.98]">
                        <Save size={18} /> Gideri Kaydet
                    </button>
                </form>
            </div>
        </div>

        {/* SAĞ: LİSTE */}
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">Son Harcamalar</h2>
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
                {expenses.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">Henüz gider kaydı yok.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-4">Açıklama</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Kasa/Banka</th>
                                <th className="p-4">Tarih</th>
                                <th className="p-4 text-right">Tutar</th>
                                <th className="p-4 text-center">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {expenses.map((exp: any) => (
                                <tr key={exp.id} className="hover:bg-white/5 transition">
                                    <td className="p-4 font-bold text-white">{exp.description}</td>
                                    <td className="p-4 text-slate-400"><span className="bg-slate-800 px-2 py-1 rounded-md text-xs border border-slate-700">{exp.category?.name}</span></td>
                                    <td className="p-4 text-slate-400 text-sm">{exp.account?.name}</td>
                                    <td className="p-4 text-slate-500 text-sm font-mono">{new Date(exp.date).toLocaleDateString('tr-TR')}</td>
                                    <td className="p-4 text-right font-black text-red-400 font-mono">- {Number(exp.amount).toLocaleString('tr-TR')} ₺</td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => handleDelete(exp.id)} className="text-slate-500 hover:text-red-400 transition p-2 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
      </div>

      {/* MODAL: KATEGORİ EKLEME */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative">
                <button onClick={() => setShowCategoryModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Tag size={18} className="text-red-500"/> Yeni Kategori</h3>
                <input 
                    autoFocus
                    type="text" 
                    placeholder="Örn: Mutfak Masrafı" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none mb-4"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button onClick={handleAddCategory} className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold transition">Kaydet</button>
            </div>
        </div>
      )}

    </div>
  );
}