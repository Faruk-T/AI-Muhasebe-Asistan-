// frontend/app/transactions/page.tsx
'use client';

import { Wallet, ArrowUpCircle, ArrowDownCircle, Plus, Search, TrendingUp, TrendingDown, DollarSign, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('http://localhost:3333/transactions', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        }
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + Number(t.amount), 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 overflow-hidden">
      
      {/* Background FX */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[130px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[size:50px_50px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Wallet size={32} className="text-white" />
            </div>
            <div>
               <h1 className="text-4xl font-black text-white tracking-tight">Kasa & Hareketler</h1>
               <p className="text-slate-400 font-medium">Nakit akışını kontrol et.</p>
            </div>
          </div>
          
          <Link href="/transactions/create" className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-400 hover:text-white transition shadow-lg hover:shadow-emerald-500/30 active:scale-95">
             <Plus size={20} /> Yeni İşlem Ekle
          </Link>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Gelir */}
           <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 group hover:border-emerald-500/50 transition">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition"><TrendingUp size={80} /></div>
              <p className="text-slate-400 text-sm font-bold mb-2 flex items-center gap-2"><ArrowDownCircle size={16} className="text-emerald-500"/> Toplam Tahsilat</p>
              <p className="text-3xl font-black text-emerald-400">+{totalIncome.toLocaleString('tr-TR')} ₺</p>
           </div>
           
           {/* Gider */}
           <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 group hover:border-red-500/50 transition">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition"><TrendingDown size={80} /></div>
              <p className="text-slate-400 text-sm font-bold mb-2 flex items-center gap-2"><ArrowUpCircle size={16} className="text-red-500"/> Toplam Ödeme</p>
              <p className="text-3xl font-black text-red-400">-{totalExpense.toLocaleString('tr-TR')} ₺</p>
           </div>

           {/* Net */}
           <div className={`relative overflow-hidden rounded-2xl p-6 border transition ${netBalance >= 0 ? 'bg-emerald-900/30 border-emerald-500/30' : 'bg-red-900/30 border-red-500/30'}`}>
              <p className="text-white/70 text-sm font-bold mb-2 flex items-center gap-2"><DollarSign size={16}/> Net Kasa Durumu</p>
              <p className={`text-4xl font-black ${netBalance >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                 {netBalance.toLocaleString('tr-TR')} ₺
              </p>
           </div>
        </div>

        {/* Transactions List */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md">
           {transactions.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                 <Wallet size={48} className="mx-auto mb-3 opacity-20" />
                 <p>Henüz kayıt yok.</p>
              </div>
           ) : (
              <div className="divide-y divide-slate-800">
                 {transactions.map((t) => (
                    <div key={t.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition group">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'INCOME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                             {t.type === 'INCOME' ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                          </div>
                          <div>
                             <p className="text-white font-bold">{t.company?.name || 'Bilinmiyor'}</p>
                             <p className="text-slate-500 text-sm">{t.description || 'Açıklama yok'}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className={`font-black text-lg ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                             {t.type === 'INCOME' ? '+' : '-'}{Number(t.amount).toLocaleString('tr-TR')} ₺
                          </p>
                          <p className="text-slate-600 text-xs">{new Date(t.date).toLocaleDateString('tr-TR')}</p>
                       </div>
                    </div>
                 ))}
              </div>
           )}
        </div>

      </div>
    </div>
  );
}