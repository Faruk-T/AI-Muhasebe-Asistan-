// frontend/app/invoices/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Save, ArrowLeft, Plus, Trash2, Building, Package } from 'lucide-react';
import Link from 'next/link';

export default function CreateInvoicePage() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form Ana Verisi
  const [companyId, setCompanyId] = useState('');
  
  // Kalemler (Satırlar)
  const [items, setItems] = useState([
    { productId: '', quantity: 1, price: 0 } 
  ]);

  // Verileri Çek
  useEffect(() => {
    fetch('http://localhost:3333/companies').then(res => res.json()).then(setCompanies);
    fetch('http://localhost:3333/products').then(res => res.json()).then(setProducts);
  }, []);

  // Ürün seçince fiyatı otomatik getir
  const handleProductChange = (index: number, productId: string) => {
    const product: any = products.find((p: any) => p.id === productId);
    const newItems = [...items];
    newItems[index].productId = productId;
    
    // 🛠️ DÜZELTME BURADA: salePrice yerine sellPrice yaptık
    // Artık backend'den gelen doğru fiyatı alacak ve NaN hatası vermeyecek.
    newItems[index].price = product ? Number(product.sellPrice || product.salePrice || 0) : 0;
    
    setItems(newItems);
  };

  // Miktar veya Fiyat değişince güncelle
  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    // @ts-ignore
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Satır Ekle / Sil
  const addItem = () => setItems([...items, { productId: '', quantity: 1, price: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  // Toplam Hesaplama
  const grandTotal = items.reduce((acc, item) => acc + (Number(item.quantity || 0) * Number(item.price || 0)), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3333/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, items }),
      });

      if (res.ok) {
        router.push('/invoices');
        router.refresh();
      } else {
        alert('Hata oluştu!');
      }
    } catch {
      alert('Sunucu hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-12 px-4 relative overflow-hidden flex justify-center">
      
      {/* Background */}
      <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] pointer-events-none"></div>

      <div className="relative w-full max-w-4xl space-y-6">
        
        <Link href="/invoices" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold transition">
          <ArrowLeft size={20} /> Listeye Dön
        </Link>

        <form onSubmit={handleSubmit} className="relative bg-slate-900/80 backdrop-blur-2xl border border-indigo-500/20 rounded-3xl p-8 shadow-2xl space-y-8">
          
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-white/10 pb-6">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <FileText size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Yeni Fatura</h1>
              <p className="text-slate-400">Müşteriyi seç ve ürünleri ekle.</p>
            </div>
          </div>

          {/* Cari Seçimi */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-indigo-300 flex items-center gap-2">
               <Building size={16} /> Müşteri / Cari Seçimi
            </label>
            <select
              required
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-white focus:border-indigo-500 outline-none transition appearance-none"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
            >
              <option value="">-- Müşteri Seçiniz --</option>
              {companies.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Fatura Kalemleri */}
          <div className="space-y-4">
             <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-indigo-300 flex items-center gap-2"><Package size={16}/> Ürünler & Hizmetler</label>
                <button type="button" onClick={addItem} className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                   <Plus size={14} /> Satır Ekle
                </button>
             </div>

             <div className="space-y-3">
               {items.map((item, index) => (
                 <div key={index} className="flex flex-col md:flex-row gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-xl group hover:border-indigo-500/50 transition">
                   {/* Ürün Seç */}
                   <div className="flex-1">
                      <select
                        required
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm outline-none focus:border-indigo-500"
                        value={item.productId}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                      >
                        <option value="">-- Ürün Seç --</option>
                        {products.map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock} {p.unit})</option>
                        ))}
                      </select>
                   </div>

                   {/* Adet (Buçuklu giriş için step eklendi) */}
                   <div className="w-full md:w-24">
                      <input
                        type="number" min="0" step="0.01"
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm outline-none focus:border-indigo-500 text-center"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                      />
                   </div>

                   {/* Fiyat */}
                   <div className="w-full md:w-32">
                      <input
                        type="number"
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm outline-none focus:border-indigo-500 text-right font-mono"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                      />
                   </div>

                   {/* Toplam & Sil */}
                   <div className="flex items-center gap-4 justify-between md:justify-end w-full md:w-auto min-w-[120px]">
                      <span className="font-bold text-indigo-300 font-mono">
                        {(Number(item.quantity) * Number(item.price)).toLocaleString('tr-TR')} ₺
                      </span>
                      {items.length > 1 && (
                        <button type="button" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition">
                           <Trash2 size={18} />
                        </button>
                      )}
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Genel Toplam */}
          <div className="flex justify-end pt-6 border-t border-white/10">
             <div className="bg-indigo-900/40 p-6 rounded-2xl border border-indigo-500/30 text-right min-w-[250px]">
                <p className="text-indigo-300 text-sm font-bold mb-1">GENEL TOPLAM</p>
                <p className="text-4xl font-black text-white">{grandTotal.toLocaleString('tr-TR')} ₺</p>
             </div>
          </div>

          {/* Kaydet Butonu */}
          <button
            disabled={loading}
            type="submit"
            className="w-full group relative py-4 rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] animate-gradient"></div>
            <div className="relative flex items-center justify-center gap-2">
               {loading ? 'Kaydediliyor...' : <><Save /> Faturayı Onayla ve Kaydet</>}
            </div>
          </button>

        </form>
      </div>
      
      <style jsx>{`
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient { animation: gradient 3s ease infinite; }
      `}</style>
    </div>
  );
}