// frontend/app/products/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Save, ArrowLeft, Percent, Ruler } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    buyPrice: '',
    salePrice: '', // Schema'da sellPrice ise burayı ve backend'i kontrol etmelisin
    stock: '',
    unit: 'Adet', // 👈 YENİ: Varsayılan Birim
    criticalQty: '10',
    vatRate: '20'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3333/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Sayısal değerleri string'den number'a çevirerek gönderiyoruz
        body: JSON.stringify({
            ...formData,
            buyPrice: Number(formData.buyPrice),
            salePrice: Number(formData.salePrice), // Veya sellPrice
            stock: Number(formData.stock), // Ondalıklı olabilir
            criticalQty: Number(formData.criticalQty),
            vatRate: Number(formData.vatRate)
        }),
      });

      if (res.ok) {
        toast.success('Ürün başarıyla oluşturuldu! 🎉');
        router.push('/products');
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Bir hata oluştu.');
      }
    } catch {
      toast.error('Sunucu hatası! Bağlantıyı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 flex justify-center items-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse"></div>

      <div className="relative w-full max-w-2xl z-10">
        
        <Link href="/products" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-6 font-bold transition">
          <ArrowLeft size={20} /> Vazgeç
        </Link>

        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
             <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-600/30">
                <Package size={32} className="text-white" />
             </div>
             <h1 className="text-3xl font-black text-white">Yeni Ürün Ekle</h1>
             <p className="text-slate-400">Stok kartı oluştur.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Ürün Adı & Barkod */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Ürün Adı</label>
                  <input required type="text" placeholder="Örn: Kablosuz Mouse" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition" 
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
               </div>
               <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Barkod</label>
                  <input type="text" placeholder="Barkod Okutunuz" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition font-mono" 
                    value={formData.barcode} onChange={(e) => setFormData({...formData, barcode: e.target.value})} />
               </div>
            </div>

            {/* Fiyatlar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Alış Fiyatı (₺)</label>
                  <input required type="number" step="0.01" placeholder="0.00" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition" 
                    value={formData.buyPrice} onChange={(e) => setFormData({...formData, buyPrice: e.target.value})} />
               </div>
               <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Satış Fiyatı (₺)</label>
                  <input required type="number" step="0.01" placeholder="0.00" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-green-500 transition font-bold" 
                    value={formData.salePrice} onChange={(e) => setFormData({...formData, salePrice: e.target.value})} />
               </div>
            </div>

            {/* Stok, Birim, Kritik */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               
               {/* STOK ADEDİ (Ondalıklı) */}
               <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Stok Miktarı</label>
                  <input 
                    required 
                    type="number" 
                    step="0.01" // 👈 1.5 Kg girmek için
                    placeholder="0" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                  />
               </div>

               {/* BİRİM SEÇİMİ (Yeni) */}
               <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 flex items-center gap-1"><Ruler size={14}/> Birim</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition appearance-none cursor-pointer"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  >
                     <option value="Adet">Adet (Tane)</option>
                     <option value="Kg">Kilogram (Kg)</option>
                     <option value="Gr">Gram (Gr)</option>
                     <option value="Lt">Litre (Lt)</option>
                     <option value="Mt">Metre (Mt)</option>
                     <option value="Koli">Koli</option>
                     <option value="Paket">Paket</option>
                  </select>
               </div>

               {/* KRİTİK STOK */}
               <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Kritik Stok</label>
                  <input type="number" placeholder="10" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-red-500 transition" 
                    value={formData.criticalQty} onChange={(e) => setFormData({...formData, criticalQty: e.target.value})} />
               </div>
            </div>

            {/* KDV */}
            <div>
               <label className="text-sm font-bold text-slate-400 mb-2 flex items-center gap-1"><Percent size={14}/> KDV Oranı</label>
               <select 
                 className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition appearance-none cursor-pointer"
                 value={formData.vatRate}
                 onChange={(e) => setFormData({...formData, vatRate: e.target.value})}
               >
                  <option value="0">%0</option>
                  <option value="1">%1</option>
                  <option value="10">%10</option>
                  <option value="20">%20</option>
               </select>
            </div>

            <button disabled={loading} type="submit" className="w-full py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-lg shadow-orange-500/30 transition active:scale-95 flex items-center justify-center gap-2">
               {loading ? 'Kaydediliyor...' : <><Save size={20} /> Ürünü Kaydet</>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}