// frontend/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3333/dashboard')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard Veri Hatası:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-white animate-pulse">Analizler yükleniyor...</div>;

  // Grafik Demo Verisi
  const chartData = [
    { name: 'Pzt', satis: 4000, gider: 2400 },
    { name: 'Sal', satis: 3000, gider: 1398 },
    { name: 'Çar', satis: 2000, gider: 9800 },
    { name: 'Per', satis: 2780, gider: 3908 },
    { name: 'Cum', satis: 1890, gider: 4800 },
    { name: 'Cmt', satis: 2390, gider: 3800 },
    { name: 'Paz', satis: 3490, gider: 4300 },
  ];

  // Güvenli Sayı Formatlama Fonksiyonu
  const formatCurrency = (val: any) => {
    return Number(val || 0).toLocaleString('tr-TR');
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      
      {/* BAŞLIK */}
      <div className="mb-8">
        <h1 className="text-3xl font-black">Genel Bakış</h1>
        <p className="text-slate-400">İşletmenizin finansal sağlığı ve stok durumu.</p>
      </div>

      {/* 1. ÜST KARTLAR (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* KASA VARLIĞI */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-emerald-500/50 transition">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <Wallet size={100} className="text-emerald-500"/>
           </div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Wallet size={20}/></div>
              <span className="text-sm font-bold text-slate-400">Toplam Varlık</span>
           </div>
           <h2 className="text-3xl font-black text-white">{formatCurrency(data?.totalAsset)} ₺</h2>
           <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
             <ArrowUpRight size={12}/> Nakit ve Banka Hesapları
           </p>
        </div>

        {/* BU AYKİ NET KÂR */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/50 transition">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <TrendingUp size={100} className="text-blue-500"/>
           </div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><DollarSign size={20}/></div>
              <span className="text-sm font-bold text-slate-400">Bu Ay Net Kâr</span>
           </div>
           <h2 className={`text-3xl font-black ${(data?.netProfit || 0) >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
              {formatCurrency(data?.netProfit)} ₺
           </h2>
           <p className="text-xs text-slate-500 mt-2">
             Satışlar - (Giderler + Maliyet)
           </p>
        </div>

        {/* ALACAKLAR */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-orange-500/50 transition">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <TrendingUp size={100} className="text-orange-500"/>
           </div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400"><TrendingUp size={20}/></div>
              <span className="text-sm font-bold text-slate-400">Alacaklar</span>
           </div>
           <h2 className="text-3xl font-black text-white">{formatCurrency(data?.totalReceivables)} ₺</h2>
           <p className="text-xs text-orange-400 mt-2">Bekleyen Müşteri Ödemeleri</p>
        </div>

        {/* BORÇLAR */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-red-500/50 transition">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <TrendingDown size={100} className="text-red-500"/>
           </div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><TrendingDown size={20}/></div>
              <span className="text-sm font-bold text-slate-400">Borçlar</span>
           </div>
           <h2 className="text-3xl font-black text-white">{formatCurrency(data?.totalPayables)} ₺</h2>
           <p className="text-xs text-red-400 mt-2">Tedarikçi Ödemeleri</p>
        </div>

      </div>

      {/* 2. GRAFİK VE LİSTELER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SOL: GRAFİK (CSS Düzeltmesi ile) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl min-w-0">
              <h3 className="text-lg font-bold mb-6">Haftalık Gelir / Gider Analizi</h3>
              <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
                        <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff'}}
                            itemStyle={{color: '#fff'}}
                        />
                        <Bar dataKey="satis" name="Satışlar" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="gider" name="Giderler" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* SAĞ: KRİTİK STOK VE SON İŞLEMLER */}
          <div className="space-y-6">
              
              {/* Kritik Stok */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold flex items-center gap-2">
                          <AlertCircle size={18} className="text-red-500"/> Kritik Stok
                      </h3>
                      {/* GÜVENLİ KONTROL: data?.criticalStock?.length */}
                      <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full font-bold">
                          {data?.criticalStock?.length || 0} Ürün
                      </span>
                  </div>
                  
                  <div className="space-y-3">
                      {(!data?.criticalStock || data.criticalStock.length === 0) ? (
                          <div className="text-center py-6 text-slate-500">
                             <Package size={32} className="mx-auto mb-2 opacity-20"/>
                             <p className="text-sm">Stoklar güvende! 👍</p>
                          </div>
                      ) : (
                          data.criticalStock.map((prod: any) => (
                              <div key={prod.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                  <div>
                                      <p className="font-bold text-sm">{prod.name}</p>
                                      <p className="text-xs text-slate-400">Stok: <span className="text-red-400 font-bold">{prod.stock}</span> {prod.unit}</p>
                                  </div>
                                  <div className="h-2 w-16 bg-slate-700 rounded-full overflow-hidden">
                                      <div className="h-full bg-red-500 w-[20%]"></div>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </div>

              {/* Son Hareketler */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                  <h3 className="font-bold mb-4">Son İşlemler</h3>
                  <div className="space-y-3">
                      {/* GÜVENLİ KONTROL: data?.recentTransactions */}
                      {data?.recentTransactions?.map((trx: any) => (
                          <div key={trx.id} className="flex justify-between items-center text-sm group">
                              <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${trx.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                      {trx.type === 'INCOME' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                                  </div>
                                  <div>
                                      <p className="font-bold text-slate-200">{trx.description || 'İşlem'}</p>
                                      <p className="text-[10px] text-slate-500">{new Date(trx.date).toLocaleDateString('tr-TR')}</p>
                                  </div>
                              </div>
                              <span className={`font-mono font-bold ${trx.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {trx.type === 'INCOME' ? '+' : '-'} {Number(trx.amount).toLocaleString('tr-TR')}
                              </span>
                          </div>
                      ))}
                      
                      {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
                          <p className="text-center text-slate-500 text-sm py-4">Henüz işlem yok.</p>
                      )}
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
}