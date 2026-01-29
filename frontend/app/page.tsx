// frontend/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Wallet, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  CreditCard,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Backend'deki Dashboard servisine bağlan
    fetch('http://localhost:3333/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Veri gelmediyse boş göster
  if (!stats) return <div className="p-8 text-white">Veri yüklenemedi.</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-8 overflow-x-hidden relative">
      
      {/* Arka Plan Efekti */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* BAŞLIK */}
        <div>
          <h1 className="text-3xl font-black text-white">Genel Bakış</h1>
          <p className="text-slate-400 mt-1">İşletmenizin finansal sağlığı ve stok durumu.</p>
        </div>

        {/* 1. ÖZET KARTLARI (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Kasa Varlığı */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-3xl hover:border-emerald-500/50 transition group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition">
                <Wallet size={24} />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} className="mr-1"/> Nakit
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Toplam Kasa Varlığı</p>
            <h3 className="text-3xl font-black text-white mt-1">{Number(stats.totalCash).toLocaleString('tr-TR')} ₺</h3>
          </div>

          {/* Alacaklar (Müşteri Borcu) */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-3xl hover:border-blue-500/50 transition group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition">
                <CreditCard size={24} />
              </div>
              <span className="flex items-center text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
                Bekleyen
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Toplam Alacak (Borçlu Müşteriler)</p>
            <h3 className="text-3xl font-black text-white mt-1">{Number(stats.totalReceivables).toLocaleString('tr-TR')} ₺</h3>
          </div>

          {/* Personel Gideri */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-3xl hover:border-purple-500/50 transition group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition">
                <Users size={24} />
              </div>
              <span className="flex items-center text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
                Aylık Yük
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Toplam Personel Maaşları</p>
            <h3 className="text-3xl font-black text-white mt-1">{Number(stats.monthlyEmployeeCost).toLocaleString('tr-TR')} ₺</h3>
          </div>

          {/* Kritik Stok */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-3xl hover:border-red-500/50 transition group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-500/10 rounded-2xl text-red-400 group-hover:bg-red-500 group-hover:text-white transition">
                <AlertTriangle size={24} />
              </div>
              <span className="flex items-center text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                Acil Durum
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Kritik Stok Seviyesi</p>
            <h3 className="text-3xl font-black text-white mt-1">{stats.lowStockCount} Ürün</h3>
          </div>

        </div>

        {/* 2. ALT BÖLÜM: DETAYLAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SOL: SON İŞLEMLER */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="text-indigo-400" /> Son Finansal Hareketler
              </h3>
              <Link href="/finance" className="text-sm text-slate-500 hover:text-white transition">Tümünü Gör</Link>
            </div>
            
            <div className="space-y-4">
              {stats.recentTransactions.length === 0 ? (
                <p className="text-slate-500">Henüz işlem yok.</p>
              ) : (
                stats.recentTransactions.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl hover:bg-slate-800 transition border border-transparent hover:border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${t.type === 'INCOME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {t.type === 'INCOME' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <p className="text-white font-bold">{t.description || (t.type === 'INCOME' ? 'Gelir' : 'Gider')}</p>
                        <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString('tr-TR')} • {t.account?.name}</p>
                      </div>
                    </div>
                    <p className={`font-black text-lg ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.type === 'INCOME' ? '+' : '-'} {Number(t.amount).toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SAĞ: KRİTİK STOK LİSTESİ */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="text-red-400" /> Stok Uyarısı
              </h3>
              <Link href="/products" className="text-sm text-slate-500 hover:text-white transition">Yönet</Link>
            </div>

            <div className="space-y-3">
              {stats.lowStockItems.length === 0 ? (
                <div className="text-center py-10">
                  <Package size={40} className="text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Stoklar güvende! 👍</p>
                </div>
              ) : (
                stats.lowStockItems.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <div>
                        <p className="text-red-200 font-bold text-sm">{p.name}</p>
                        <p className="text-xs text-red-300/60">Kritik: {p.criticalQty}</p>
                      </div>
                    </div>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold">
                      {p.stock} {p.unit}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}