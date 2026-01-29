// frontend/app/transactions/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateTransactionPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form Verileri
  const [formData, setFormData] = useState({
    companyId: '',
    type: 'INCOME', // Varsayılan Tahsilat
    amount: '',
    description: ''
  });

  // Carileri Çek
  useEffect(() => {
    fetch('http://localhost:3333/companies')
      .then(res => res.json())
      .then(setCompanies)
      .catch(err => console.error(err));
  }, []);

  // Kaydetme İşlemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3333/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/transactions');
        router.refresh();
      } else {
        alert('Bir hata oluştu!');
      }
    } catch (error) {
      alert('Sunucu hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 flex justify-center items-center relative overflow-hidden">
      
      {/* Arka Plan Rengi (Seçime göre değişir) */}
      <div className={`absolute inset-0 transition-colors duration-700 opacity-20 ${formData.type === 'INCOME' ? 'bg-emerald-900' : 'bg-red-900'}`}></div>
      <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]"></div>

      <div className="relative w-full max-w-2xl z-10">
        <Link href="/transactions" className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 font-bold transition">
          <ArrowLeft size={20}/> Vazgeç
        </Link>
        
        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
             <h1 className="text-3xl font-black text-white">Yeni Kasa Hareketi</h1>
             <p className="text-slate-400">Nakit giriş veya çıkışı yapın.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* İŞLEM TÜRÜ SEÇİMİ (BUTONLAR) */}
            <div className="grid grid-cols-2 gap-4 p-1 bg-slate-800 rounded-2xl">
               <button 
                 type="button" 
                 onClick={() => setFormData({...formData, type: 'INCOME'})} 
                 className={`py-4 rounded-xl flex items-center justify-center gap-2 font-black transition ${
                   formData.type === 'INCOME' 
                     ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' 
                     : 'text-slate-400 hover:text-white'
                 }`}
               >
                  <TrendingUp /> TAHSİLAT
               </button>
               <button 
                 type="button" 
                 onClick={() => setFormData({...formData, type: 'EXPENSE'})} 
                 className={`py-4 rounded-xl flex items-center justify-center gap-2 font-black transition ${
                   formData.type === 'EXPENSE' 
                     ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' 
                     : 'text-slate-400 hover:text-white'
                 }`}
               >
                  <TrendingDown /> ÖDEME
               </button>
            </div>

            {/* CARİ SEÇİMİ */}
            <div>
               <label className="text-sm font-bold text-slate-400 mb-2 block">Cari Hesap</label>
               <select 
                 required 
                 value={formData.companyId} 
                 onChange={(e) => setFormData({...formData, companyId: e.target.value})} 
                 className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-white transition appearance-none"
               >
                  <option value="">-- Müşteri veya Tedarikçi Seçiniz --</option>
                  {companies.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
               </select>
            </div>

            {/* TUTAR */}
            <div>
               <label className="text-sm font-bold text-slate-400 mb-2 block">Tutar (₺)</label>
               <input 
                 required 
                 type="number" 
                 placeholder="0.00" 
                 className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white text-2xl font-black outline-none focus:border-white transition" 
                 value={formData.amount} 
                 onChange={(e) => setFormData({...formData, amount: e.target.value})} 
               />
            </div>

            {/* AÇIKLAMA */}
            <div>
               <label className="text-sm font-bold text-slate-400 mb-2 block">Açıklama</label>
               <input 
                 type="text" 
                 placeholder="Örn: Fatura ödemesi" 
                 className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-white transition" 
                 value={formData.description} 
                 onChange={(e) => setFormData({...formData, description: e.target.value})} 
               />
            </div>

            {/* KAYDET BUTONU (ARTIK RENKLİ VE GÖRÜNÜR) */}
            <button
              disabled={loading}
              type="submit"
              className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2 ${
                formData.type === 'INCOME'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 shadow-red-500/30'
              }`}
            >
               {loading ? (
                 <span className="flex items-center gap-2">
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   İşleniyor...
                 </span>
               ) : (
                 <>
                   <CheckCircle2 size={20} />
                   {formData.type === 'INCOME' ? 'Tahsilatı Onayla' : 'Ödemeyi Onayla'}
                 </>
               )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}