// frontend/app/purchases/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Plus, Trash2, Building, Package, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function CreatePurchasePage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [companyId, setCompanyId] = useState('');
  const [items, setItems] = useState([
    { productId: '', quantity: 1, price: 0 } 
  ]);

  useEffect(() => {
    // Verileri çek
    fetch('http://localhost:3333/companies').then(res => res.json()).then(setCompanies);
    fetch('http://localhost:3333/products').then(res => res.json()).then(setProducts);
  }, []);

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p: any) => p.id === productId);
    const newItems = [...items];
    newItems[index].productId = productId;
    // Alışta genelde 'buyPrice' (Alış Fiyatı) gelir
    newItems[index].price = product ? Number(product.buyPrice || 0) : 0;
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    // @ts-ignore
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { productId: '', quantity: 1, price: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const grandTotal = items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3333/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            companyId, 
            items,
            type: 'PURCHASE' // 👈 Backend'e bunun Alış Faturası olduğunu söylüyoruz
        }),
      });

      if (res.ok) {
        toast.success('Alış Faturası Kaydedildi! Stoklar Güncellendi. 📦');
        router.push('/products'); 
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Hata oluştu!');
      }
    } catch {
      toast.error('Sunucu hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 relative overflow-hidden flex justify-center">
      
      {/* Background - Turuncu tema */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-4xl space-y-6">
        
        <Link href="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-bold transition">
          <ArrowLeft size={20} /> Ürün Listesine Dön
        </Link>

        <form onSubmit={handleSubmit} className="relative bg-slate-900/80 backdrop-blur-2xl border border-orange-500/20 rounded-3xl p-8 shadow-2xl space-y-8">
          
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-white/10 pb-6">
            <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/30">
              <ShoppingCart size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Yeni Alış Faturası</h1>
              <p className="text-slate-400">Tedarikçiden alınan ürünleri stoğa ekle.</p>
            </div>
          </div>

          {/* Cari Seçimi */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-orange-300 flex items-center gap-2">
               <Building size={16} /> Tedarikçi Seçimi
            </label>
            <select
              required
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-white focus:border-orange-500 outline-none transition appearance-none"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
            >
              <option value="">-- Tedarikçi Seçiniz --</option>
              {companies.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name} ({c.type === 'SUPPLIER' ? 'Tedarikçi' : 'Müşteri'})</option>
              ))}
            </select>
          </div>

          {/* Fatura Kalemleri */}
          <div className="space-y-4">
             <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-orange-300 flex items-center gap-2"><Package size={16}/> Alınan Ürünler</label>
                <button type="button" onClick={addItem} className="text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                   <Plus size={14} /> Satır Ekle
                </button>
             </div>

             <div className="space-y-3">
               {items.map((item, index) => (
                 <div key={index} className="flex flex-col md:flex-row gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-xl group hover:border-orange-500/50 transition">
                   <div className="flex-1">
                      <select required className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm outline-none focus:border-orange-500"
                        value={item.productId} onChange={(e) => handleProductChange(index, e.target.value)} >
                        <option value="">-- Ürün Seç --</option>
                        {products.map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name} (Mevcut Stok: {p.stock})</option>
                        ))}
                      </select>
                   </div>
                   <div className="w-full md:w-24">
                      <input type="number" min="0.01" step="0.01" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm outline-none focus:border-orange-500 text-center"
                        value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))} />
                   </div>
                   <div className="w-full md:w-32">
                      <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm outline-none focus:border-orange-500 text-right font-mono"
                        value={item.price} onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))} />
                   </div>
                   <div className="flex items-center gap-4 justify-between md:justify-end w-full md:w-auto min-w-[120px]">
                      <span className="font-bold text-orange-300 font-mono">
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
             <div className="bg-orange-900/20 p-6 rounded-2xl border border-orange-500/30 text-right min-w-[250px]">
                <p className="text-orange-300 text-sm font-bold mb-1">ÖDENECEK TOPLAM</p>
                <p className="text-4xl font-black text-white">{grandTotal.toLocaleString('tr-TR')} ₺</p>
             </div>
          </div>

          {/* Kaydet Butonu */}
          <button disabled={loading} type="submit" className="w-full group relative py-4 rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 bg-orange-600 hover:bg-orange-500 shadow-xl shadow-orange-600/20">
            <div className="relative flex items-center justify-center gap-2">
               {loading ? 'Kaydediliyor...' : <><Save /> Alış Faturasını Kaydet</>}
            </div>
          </button>

        </form>
      </div>
    </div>
  );
}