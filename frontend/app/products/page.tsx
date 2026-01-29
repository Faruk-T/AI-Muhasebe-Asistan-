// frontend/app/products/page.tsx
'use client';

import { Package, Plus, AlertTriangle, TrendingUp, Barcode, Layers, Sparkles, Edit, Search, Ruler } from 'lucide-react';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3333/products', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ARAMA FİLTRESİ
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.barcode && p.barcode.includes(searchTerm))
  );

  // 🧮 HESAPLAMALAR (DÜZELTİLDİ: sellPrice || salePrice kontrolü eklendi)
  const totalStockValue = products.reduce((acc, p) => acc + (Number(p.stock || 0) * Number(p.buyPrice || 0)), 0);
  
  // NaN Hatasını Çözen Satır 👇
  const potentialRevenue = products.reduce((acc, p) => acc + (Number(p.stock || 0) * Number(p.sellPrice || p.salePrice || 0)), 0);
  
  const criticalProducts = products.filter(p => Number(p.stock) <= Number(p.criticalQty || 10));

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6 overflow-hidden">
      
      {/* Arka Plan Efektleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-orange-600 to-amber-600 rounded-full blur-[130px] opacity-20 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-red-600 to-pink-600 rounded-full blur-[120px] opacity-20 animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur-lg opacity-80 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-2xl">
                <Package size={32} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-orange-200 via-amber-200 to-white bg-clip-text text-transparent drop-shadow-lg">
                Ürün & Stok
              </h1>
              <p className="text-amber-200/70 text-sm font-semibold mt-1">Depo durumu ve fiyat yönetimi</p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {/* ARAMA */}
            <div className="relative group flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-slate-400 group-focus-within:text-orange-400 transition" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ürün Ara..." 
                  className="w-full bg-slate-900/50 border border-slate-700/50 text-white rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* EKLE BUTONU */}
            <Link 
              href="/products/create" 
              className="group relative px-6 py-3.5 font-bold text-white rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap min-w-fit"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 transition duration-300"></div>
              <div className="relative flex items-center gap-2">
                <Plus size={20} />
                <span>Ürün Ekle</span>
              </div>
            </Link>
          </div>
        </div>

        {loading ? (
           <div className="text-center py-20 text-orange-200 animate-pulse">
             <Sparkles className="mx-auto mb-4 animate-spin" size={40}/>
             <p className="text-xl font-bold">Raflar Kontrol Ediliyor...</p>
           </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: 'Toplam Stok Değeri', value: `${totalStockValue.toLocaleString('tr-TR')} ₺`, icon: <Layers />, color: 'from-blue-600/20 to-indigo-600/20', border: 'border-blue-500/40' },
                { label: 'Kritik Seviye', value: criticalProducts.length, icon: <AlertTriangle />, color: 'from-red-600/20 to-orange-600/20', border: criticalProducts.length > 0 ? 'border-red-500 animate-pulse' : 'border-red-500/40' },
                // NaN sorunu burada çözüldü 👇
                { label: 'Ciro Potansiyeli', value: `${potentialRevenue.toLocaleString('tr-TR')} ₺`, icon: <TrendingUp />, color: 'from-emerald-600/20 to-teal-600/20', border: 'border-emerald-500/40' },
              ].map((stat, idx) => (
                <div key={idx} className={`relative overflow-hidden rounded-2xl border-2 ${stat.border} bg-gradient-to-br ${stat.color} backdrop-blur-xl p-5 hover:scale-105 transition duration-300`}>
                  <div className="relative">
                    <p className="text-white/70 text-sm font-bold flex items-center gap-2 mb-2">
                      <span className="p-1.5 bg-white/10 rounded-lg">{stat.icon}</span> {stat.label}
                    </p>
                    <p className="text-3xl font-black text-white drop-shadow-md">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? filteredProducts.map((p: any) => {
                const isCritical = Number(p.stock) <= Number(p.criticalQty || 10);
                const stockPercentage = Math.min(100, Math.max(0, (Number(p.stock) / 100) * 100));

                return (
                  <div key={p.id} className="group relative overflow-hidden rounded-2xl border-2 border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 transform hover:-translate-y-1">
                    
                    <div className={`h-1.5 w-full bg-gradient-to-r ${isCritical ? 'from-red-500 via-orange-500 to-red-500' : 'from-orange-500 via-amber-500 to-yellow-500'}`}></div>

                    <div className="p-6">
                      
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <Link href={`/products/${p.id}`} className="p-2 bg-slate-800 hover:bg-orange-500 rounded-lg text-slate-400 hover:text-white transition shadow-lg border border-slate-700 hover:border-orange-400">
                          <Edit size={16} />
                        </Link>
                        <DeleteButton id={p.id} endpoint="products" />
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-slate-600 group-hover:border-orange-400 transition">
                           <Package size={28} className={isCritical ? 'text-red-400' : 'text-orange-300'} />
                        </div>
                        <div>
                           <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition line-clamp-1">{p.name}</h3>
                           <div className="flex items-center gap-1.5 mt-1">
                             <Barcode size={12} className="text-slate-500" />
                             <span className="text-xs font-mono text-slate-400">{p.barcode || '---'}</span>
                           </div>
                        </div>
                      </div>

                      <div className="my-5 border-t border-slate-700/50"></div>

                      <div className="mb-4">
                          <div className="flex justify-between text-xs font-bold mb-1">
                              <span className={isCritical ? 'text-red-400 animate-pulse' : 'text-slate-400'}>
                                  {isCritical ? '⚠️ KRİTİK STOK' : 'Mevcut Stok'}
                              </span>
                              {/* BİRİM GÖSTERİMİ */}
                              <span className="text-white flex items-center gap-1">
                                {Number(p.stock).toLocaleString('tr-TR')} 
                                <span className="text-orange-400 px-1.5 py-0.5 bg-orange-500/10 rounded text-[10px] uppercase border border-orange-500/20">{p.unit || 'ADET'}</span>
                              </span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                              <div className={`h-full rounded-full ${isCritical ? 'bg-red-500' : 'bg-gradient-to-r from-orange-500 to-amber-400'}`} style={{ width: `${isCritical ? '100%' : stockPercentage + '%'}` }}></div>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                          <div className="text-xs text-slate-500 mb-1">Alış</div>
                          <div className="text-slate-300 font-bold">{Number(p.buyPrice).toLocaleString('tr-TR')} ₺</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center group-hover:border-orange-500/30 transition">
                          <div className="text-xs text-orange-400/80 mb-1">Satış</div>
                          {/* Satış fiyatını garantiye aldık 👇 */}
                          <div className="text-white font-bold">{Number(p.sellPrice || p.salePrice || 0).toLocaleString('tr-TR')} ₺</div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              }) : (
                 <div className="col-span-full text-center py-20 text-slate-500">
                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Aradığınız kriterde ürün bulunamadı.</p>
                 </div>
              )}
            </div>
          </>
        )}
      </div>

      <style jsx>{`@keyframes float { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(-20px, 20px); } } .animate-float { animation: float 8s ease-in-out infinite; }`}</style>
    </div>
  );
}