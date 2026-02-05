// frontend/app/companies/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Building2, ArrowLeft, Phone, Mail, MapPin, FileText, Wallet, TrendingUp, TrendingDown, Edit, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    accountId: '',
    description: '',
    type: 'INCOME'
  });

  const fetchCompany = async () => {
    try {
      const res = await fetch(`http://localhost:3333/companies/${id}`);
      const data = await res.json();
      setCompany(data);
      setLoading(false);
      
      if(data) {
          setPaymentForm(prev => ({
              ...prev, 
              type: data.type === 'CUSTOMER' ? 'INCOME' : 'EXPENSE'
          }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAccounts = async () => {
    const res = await fetch('http://localhost:3333/finance/accounts');
    const data = await res.json();
    setAccounts(data);
    if (data.length > 0) {
      setPaymentForm(prev => ({ ...prev, accountId: data[0].id }));
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchAccounts();
  }, [id]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!paymentForm.accountId) {
        toast.error("Lütfen bir kasa/banka seçin!");
        return;
    }

    try {
      const res = await fetch('http://localhost:3333/finance/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...paymentForm,
          companyId: id,
          category: paymentForm.type === 'INCOME' ? 'Tahsilat' : 'Ödeme'
        }),
      });

      if (res.ok) {
        toast.success(paymentForm.type === 'INCOME' ? 'Tahsilat başarıyla alındı!' : 'Ödeme başarıyla yapıldı!');
        setShowPaymentModal(false);
        setPaymentForm({ ...paymentForm, amount: '', description: '' });
        fetchCompany();
      } else {
        toast.error("Bir hata oluştu.");
      }
    } catch {
      toast.error("Sunucu hatası.");
    }
  };

  if (loading) return <div className="text-center py-20 text-white animate-pulse">Hesap Hareketleri İnceleniyor...</div>;
  if (!company) return <div className="text-center py-20 text-white">Cari bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        <div className="flex justify-between items-center">
          <Link href="/companies" className="flex items-center gap-2 text-slate-400 hover:text-white transition font-bold">
            <ArrowLeft size={20} /> Listeye Dön
          </Link>
          
          {/* DÜZENLE BUTONU - PATH KONTROLÜ YAPILDI */}
          <Link 
            href={`/companies/${id}/edit`} 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20 font-bold"
          >
            <Edit size={18} /> Bilgileri Düzenle
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-slate-900/80 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Building2 size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">{company.name}</h1>
                <div className="flex gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${company.type === 'CUSTOMER' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-orange-500/20 text-orange-300 border-orange-500/30'}`}>
                    {company.type === 'CUSTOMER' ? 'Müşteri' : 'Tedarikçi'}
                    </span>
                    {/* VERGİ NOYU BURAYA DA EKLEDİK Kİ GÖRÜNSÜN */}
                    <span className="px-3 py-1 rounded-full text-xs font-bold border bg-slate-800 text-slate-300 border-white/10">
                        VKN: {company.taxNumber || company.taxId || 'Girilmedi'}
                    </span>
                </div>
                <div className="mt-4 space-y-2 text-slate-400 text-sm">
                  <p className="flex items-center gap-2"><Phone size={14} className="text-purple-400"/> {company.phone || 'Telefon Yok'}</p>
                  <p className="flex items-center gap-2"><Mail size={14} className="text-purple-400"/> {company.email || 'E-posta Yok'}</p>
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-purple-400"/> {company.address || 'Adres Girilmemiş'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`relative overflow-hidden rounded-3xl p-8 border flex flex-col justify-center items-center text-center ${Number(company.balance) > 0 ? 'bg-red-900/20 border-red-500/30' : 'bg-emerald-900/20 border-emerald-500/30'}`}>
             <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">GÜNCEL BAKİYE</p>
             <h2 className={`text-5xl font-black mb-2 ${Number(company.balance) > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {Number(company.balance).toLocaleString('tr-TR')} ₺
             </h2>
             <p className="text-white/60 text-sm mb-6">
               {Number(company.balance) > 0 ? '⚠️ Ödeme Bekliyor' : '✅ Borç Yok'}
             </p>
             <button onClick={() => setShowPaymentModal(true)} className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black hover:scale-105 active:scale-95 transition shadow-xl flex items-center gap-2">
                <Wallet size={20} className="text-emerald-600"/> 
                {company.type === 'CUSTOMER' ? 'Tahsilat Yap' : 'Ödeme Yap'}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="text-blue-400" /> Kesilen Faturalar
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {company.invoices?.length === 0 ? <p className="text-slate-500 text-sm">Fatura kaydı yok.</p> : 
                company.invoices?.map((inv: any) => (
                  <div key={inv.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition">
                    <div>
                      <p className="text-white font-bold text-sm">Fatura #{inv.id.substring(0,6).toUpperCase()}</p>
                      <p className="text-slate-500 text-xs">{new Date(inv.createdAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400 font-black">+ {Number(inv.totalAmount).toLocaleString('tr-TR')} ₺</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Wallet className="text-emerald-400" /> Hesap Hareketleri
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {company.transactions?.length === 0 ? <p className="text-slate-500 text-sm">Ödeme/Tahsilat kaydı yok.</p> : 
                company.transactions?.map((trs: any) => (
                  <div key={trs.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${trs.type === 'INCOME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {trs.type === 'INCOME' ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{trs.description || (trs.type === 'INCOME' ? 'Tahsilat' : 'Ödeme')}</p>
                        <p className="text-slate-500 text-xs">{new Date(trs.date).toLocaleDateString('tr-TR')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black ${trs.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trs.type === 'INCOME' ? '-' : '+'} {Number(trs.amount).toLocaleString('tr-TR')} ₺
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl w-full max-w-md relative shadow-2xl">
                <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24} /></button>
                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2"><Wallet className="text-emerald-500"/> {paymentForm.type === 'INCOME' ? 'Tahsilat Al' : 'Ödeme Yap'}</h2>
                <p className="text-slate-400 text-sm mb-6">{paymentForm.type === 'INCOME' ? `${company.name} hesabından para girişi.` : `${company.name} hesabına para çıkışı.`}</p>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div className="flex bg-slate-800 p-1 rounded-xl mb-4">
                        <button type="button" onClick={() => setPaymentForm({...paymentForm, type: 'INCOME'})} className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${paymentForm.type === 'INCOME' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Tahsilat (Giriş)</button>
                        <button type="button" onClick={() => setPaymentForm({...paymentForm, type: 'EXPENSE'})} className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${paymentForm.type === 'EXPENSE' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Ödeme (Çıkış)</button>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1 font-bold">Tutar (₺)</label>
                        <input required type="number" step="0.01" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-emerald-500 font-mono text-xl font-bold" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1 font-bold">Kasa/Banka</label>
                        <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500" value={paymentForm.accountId} onChange={e => setPaymentForm({...paymentForm, accountId: e.target.value})}>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name} ({Number(acc.balance).toLocaleString('tr-TR')} ₺)</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1 font-bold">Açıklama</label>
                        <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500" value={paymentForm.description} onChange={e => setPaymentForm({...paymentForm, description: e.target.value})} />
                    </div>
                    <button type="submit" className={`w-full py-4 rounded-xl font-bold text-white text-lg mt-4 shadow-lg active:scale-95 transition flex items-center justify-center gap-2 ${paymentForm.type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}`}><CheckCircle2 /> İşlemi Onayla</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}