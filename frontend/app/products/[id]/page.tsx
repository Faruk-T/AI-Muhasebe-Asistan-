'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Package, Save, ArrowLeft, CheckCircle2, Percent } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // 📝 Form Verisi - Başlangıç değerlerini boş string yaparak 'uncontrolled' hatasını önledik
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    barcode: '',
    buyPrice: '',
    sellPrice: '',
    stock: '',
    criticalQty: '',
    vatRate: '20'
  });

  // 🔄 Mevcut Ürün Verilerini Çek
  useEffect(() => {
    fetch(`http://localhost:3333/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Ürün bulunamadı');
        return res.json();
      })
      .then(data => {
        // null veya undefined gelen verileri boş stringe çekiyoruz (React uyarısını çözen kısım)
        setFormData({
          code: data.code || '',
          name: data.name || '',
          barcode: data.barcode || '',
          buyPrice: String(data.buyPrice || ''),
          sellPrice: String(data.sellPrice || ''),
          stock: String(data.stock || '0'),
          criticalQty: String(data.criticalQty || ''),
          vatRate: String(data.vatRate || '20')
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Ürün yüklenemedi!");
        router.push('/products');
      });
  }, [id, router]);

  // 💾 Kaydetme İşlemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Verileri backend'e gönderirken sayıya çeviriyoruz
      const payload = {
        ...formData,
        buyPrice: Number(formData.buyPrice),
        sellPrice: Number(formData.sellPrice),
        stock: Number(formData.stock),
        criticalQty: Number(formData.criticalQty),
        vatRate: Number(formData.vatRate)
      };

      const res = await fetch(`http://localhost:3333/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        toast.success("Ürün başarıyla güncellendi! 🎉");
        setTimeout(() => {
          router.push('/products');
          router.refresh();
        }, 1500);
      } else {
        toast.error('Güncelleme sırasında bir hata oluştu!');
      }
    } catch (err) {
      toast.error('Sunucu hatası! Bağlantıyı kontrol edin.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-orange-200 bg-slate-950 min-h-screen font-bold italic">Ürün verileri getiriliyor...</div>;

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 flex justify-center items-center relative overflow-hidden">
      
      {/* Arka Plan Süslemeleri */}
      <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse"></div>

      <div className="relative w-full max-w-2xl z-10">
        
        <Link href="/products" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-6 font-bold transition">
          <ArrowLeft size={20} /> Vazgeç
        </Link>

        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/30">
                <Package size={28} className="text-white" />
             </div>
             <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight">Ürünü Düzenle</h1>
                <p className="text-slate-400 text-sm">Ürün ID: <span className="font-mono text-xs">{id}</span></p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Ürün Adı & Barkod */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Ürün Adı</label>
                  <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition" 
                    value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Barkod</label>
                  <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition font-mono" 
                    value={formData.barcode || ''} onChange={(e) => setFormData({...formData, barcode: e.target.value})} />
               </div>
            </div>

            {/* Fiyatlar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Alış Fiyatı (₺)</label>
                  <input required type="number" step="0.01" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition" 
                    value={formData.buyPrice || ''} onChange={(e) => setFormData({...formData, buyPrice: e.target.value})} />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Satış Fiyatı (₺)</label>
                  <input required type="number" step="0.01" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-green-500 transition font-bold" 
                    value={formData.sellPrice || ''} onChange={(e) => setFormData({...formData, sellPrice: e.target.value})} />
               </div>
            </div>

            {/* Stok & KDV */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Güncel Stok</label>
                  <input required type="number" step="0.01" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition" 
                    value={formData.stock || ''} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Kritik Stok</label>
                  <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-red-500 transition" 
                    value={formData.criticalQty || ''} onChange={(e) => setFormData({...formData, criticalQty: e.target.value})} />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1 ml-1"><Percent size={14}/> KDV</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-orange-500 transition cursor-pointer"
                    value={formData.vatRate || '20'}
                    onChange={(e) => setFormData({...formData, vatRate: e.target.value})}
                  >
                     <option value="0">%0</option>
                     <option value="1">%1</option>
                     <option value="10">%10</option>
                     <option value="20">%20</option>
                  </select>
               </div>
            </div>

            <button disabled={saving || success} type="submit" className="w-full mt-4 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-lg shadow-orange-500/30 transition active:scale-95 flex items-center justify-center gap-2">
               {success ? <><CheckCircle2 /> Güncellendi!</> : saving ? 'Kaydediliyor...' : <><Save size={20} /> Değişiklikleri Kaydet</>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}