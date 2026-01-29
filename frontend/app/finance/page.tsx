// frontend/app/finance/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, Building2, CreditCard, ArrowRightLeft, History } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function FinancePage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal Kontrolleri
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showTransModal, setShowTransModal] = useState(false);
  
  // Form Verileri
  const [accountForm, setAccountForm] = useState({ name: '', type: 'CASH', currency: 'TRY' });
  const [transForm, setTransForm] = useState({ 
    accountId: '', 
    type: 'INCOME', 
    amount: '', 
    description: '', 
    category: 'Satış' 
  });

  // 1. Verileri Çek
  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:3333/finance/accounts'); // Backend Portu 3333
      if (res.ok) {
        const data = await res.json();
        setAccounts(data);
        // İşlem formundaki varsayılan hesabı ilki yap
        if(data.length > 0 && !transForm.accountId) {
            setTransForm(prev => ({ ...prev, accountId: data[0].id }));
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Veriler çekilemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Yeni Hesap Ekle
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3333/finance/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountForm),
      });
      if (res.ok) {
        toast.success('Hesap açıldı! 🏦');
        setShowAccountModal(false);
        fetchData();
      }
    } catch { toast.error('Hata oluştu.'); }
  };

  // 3. Para Hareketi Ekle
  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3333/finance/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transForm),
      });
      if (res.ok) {
        toast.success('İşlem kaydedildi! 💸');
        setShowTransModal(false);
        fetchData();
      }
    } catch { toast.error('Hata oluştu.'); }
  };

  // Toplam Varlık Hesabı
  const totalBalance = accounts.reduce((acc, item) => acc + Number(item.balance), 0);

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-100 relative overflow-hidden">
        
        {/* Arka Plan Süsü */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* HEADER */}
        <div className="flex justify-between items-end mb-8 relative z-10">
            <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <Wallet className="text-emerald-400" size={32} /> Finans Yönetimi
                </h1>
                <p className="text-slate-400 mt-1">Kasa, banka ve nakit akışı takibi.</p>
            </div>
            <div className="flex gap-3">
                <button onClick={() => setShowAccountModal(true)} className="px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-bold transition flex items-center gap-2">
                    <Plus size={18} /> Hesap Ekle
                </button>
                <button onClick={() => setShowTransModal(true)} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition flex items-center gap-2">
                    <ArrowRightLeft size={18} /> Hızlı İşlem
                </button>
            </div>
        </div>

        {/* 1. KARTLAR (Hesaplar) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {/* Toplam Varlık Kartı */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-500/30 backdrop-blur-md">
                <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">TOPLAM VARLIK</p>
                <h2 className="text-3xl font-black text-white">{totalBalance.toLocaleString('tr-TR')} ₺</h2>
            </div>

            {/* Dinamik Hesap Kartları */}
            {accounts.map((acc) => (
                <div key={acc.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
                        {acc.type === 'BANK' ? <Building2 size={60}/> : <Wallet size={60}/>}
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-xl ${acc.type === 'BANK' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                            {acc.type === 'BANK' ? <Building2 size={20}/> : <Wallet size={20}/>}
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{acc.name}</h3>
                            <p className="text-xs text-slate-500">{acc.type === 'BANK' ? 'Banka Hesabı' : 'Nakit Kasa'}</p>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-white">{Number(acc.balance).toLocaleString('tr-TR')} <span className="text-sm font-normal text-slate-500">{acc.currency}</span></p>
                </div>
            ))}
        </div>

        {/* 2. SON HAREKETLER (Tablo) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <History className="text-slate-400" /> Son Hareketler
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-800/50 rounded-lg">
                        <tr>
                            <th className="p-4 rounded-l-lg">Tarih</th>
                            <th className="p-4">Açıklama</th>
                            <th className="p-4">Kategori</th>
                            <th className="p-4">Hesap</th>
                            <th className="p-4 text-right rounded-r-lg">Tutar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {/* Tüm hesapların içindeki transactions'ları düzleştirip gösteriyoruz */}
                        {accounts.flatMap(acc => (acc.transactions || []).map((t: any) => ({...t, accountName: acc.name})))
                         .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                         .slice(0, 10) // Sadece son 10 işlem
                         .map((t: any) => (
                            <tr key={t.id} className="hover:bg-slate-800/30 transition">
                                <td className="p-4 text-slate-400 text-sm">{new Date(t.date).toLocaleDateString('tr-TR')}</td>
                                <td className="p-4 font-medium text-white">{t.description || '-'}</td>
                                <td className="p-4 text-sm text-slate-400"><span className="px-2 py-1 bg-slate-800 rounded text-xs">{t.category}</span></td>
                                <td className="p-4 text-sm text-indigo-300">{t.accountName}</td>
                                <td className={`p-4 text-right font-bold ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {t.type === 'INCOME' ? '+' : '-'}{Number(t.amount).toLocaleString('tr-TR')} ₺
                                </td>
                            </tr>
                        ))}
                        {accounts.flatMap(a => a.transactions).length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">Henüz bir işlem yok.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* --- MODALLAR --- */}
        
        {/* 1. HESAP EKLEME MODALI */}
        {showAccountModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-md">
                    <h2 className="text-2xl font-bold text-white mb-6">Yeni Hesap Aç</h2>
                    <form onSubmit={handleCreateAccount} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Hesap Adı</label>
                            <input required type="text" placeholder="Örn: Ofis Kasası" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
                                value={accountForm.name} onChange={e => setAccountForm({...accountForm, name: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Tür</label>
                                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none"
                                    value={accountForm.type} onChange={e => setAccountForm({...accountForm, type: e.target.value})}>
                                    <option value="CASH">Nakit Kasa</option>
                                    <option value="BANK">Banka Hesabı</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Para Birimi</label>
                                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none"
                                    value={accountForm.currency} onChange={e => setAccountForm({...accountForm, currency: e.target.value})}>
                                    <option value="TRY">Türk Lirası</option>
                                    <option value="USD">Dolar</option>
                                    <option value="EUR">Euro</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => setShowAccountModal(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-slate-300">Vazgeç</button>
                            <button type="submit" className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white">Oluştur</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* 2. İŞLEM (GELİR/GİDER) MODALI */}
        {showTransModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-md">
                    <h2 className="text-2xl font-bold text-white mb-6">Para Giriş / Çıkış</h2>
                    <form onSubmit={handleTransaction} className="space-y-4">
                        
                        {/* GELİR Mİ GİDER Mİ? */}
                        <div className="flex bg-slate-800 p-1 rounded-xl mb-4">
                            <button type="button" onClick={() => setTransForm({...transForm, type: 'INCOME'})} 
                                className={`flex-1 py-2 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${transForm.type === 'INCOME' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                                <TrendingUp size={16}/> Gelir (Giriş)
                            </button>
                            <button type="button" onClick={() => setTransForm({...transForm, type: 'EXPENSE'})} 
                                className={`flex-1 py-2 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${transForm.type === 'EXPENSE' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                                <TrendingDown size={16}/> Gider (Çıkış)
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Hangi Hesap?</label>
                            <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none"
                                value={transForm.accountId} onChange={e => setTransForm({...transForm, accountId: e.target.value})}>
                                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({Number(acc.balance)} ₺)</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Tutar</label>
                            <input required type="number" step="0.01" placeholder="0.00" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 font-mono text-lg"
                                value={transForm.amount} onChange={e => setTransForm({...transForm, amount: e.target.value})} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Kategori</label>
                                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none"
                                    value={transForm.category} onChange={e => setTransForm({...transForm, category: e.target.value})}>
                                    <option>Satış</option>
                                    <option>Maaş</option>
                                    <option>Kira</option>
                                    <option>Fatura</option>
                                    <option>Yemek</option>
                                    <option>Diğer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Açıklama</label>
                                <input type="text" placeholder="Örn: Ocak Kirası" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none"
                                    value={transForm.description} onChange={e => setTransForm({...transForm, description: e.target.value})} />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => setShowTransModal(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-slate-300">Vazgeç</button>
                            <button type="submit" className={`flex-1 py-3 rounded-xl font-bold text-white ${transForm.type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}`}>
                                {transForm.type === 'INCOME' ? 'Geliri Kaydet' : 'Gideri Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

    </div>
  );
}