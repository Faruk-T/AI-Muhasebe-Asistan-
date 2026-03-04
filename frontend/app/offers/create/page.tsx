'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, ArrowLeft, User, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function CreateOfferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [selectedCompany, setSelectedCompany] = useState('');
  const [note, setNote] = useState('');
  const [offerItems, setOfferItems] = useState<any[]>([{ productId: '', quantity: 1, price: 0, vatRate: 20 }]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3333/companies').then(res => res.json()),
      fetch('http://localhost:3333/products').then(res => res.json())
    ]).then(([cData, pData]) => {
      setCompanies(cData);
      setProducts(pData);
    });
  }, []);

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    const newItems = [...offerItems];
    newItems[index].productId = productId;
    if (product) {
        newItems[index].price = Number(product.sellPrice);
        newItems[index].vatRate = Number(product.vatRate || 20);
    }
    setOfferItems(newItems);
  };

  const addItem = () => setOfferItems([...offerItems, { productId: '', quantity: 1, price: 0, vatRate: 20 }]);
  const removeItem = (index: number) => setOfferItems(offerItems.filter((_, i) => i !== index));

  const calculateTotal = () => {
    return offerItems.reduce((sum, item) => {
        const lineTotal = item.quantity * item.price;
        return sum + (lineTotal + (lineTotal * (item.vatRate / 100)));
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return toast.error('Müşteri seçin.');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3333/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: selectedCompany, items: offerItems, note }),
      });

      if (res.ok) {
        toast.success('Teklif oluşturuldu! 📄');
        router.push('/offers');
      }
    } catch {
      toast.error('Hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Link href="/offers" className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition"><ArrowLeft size={20}/></Link>
            <h1 className="text-3xl font-black">Yeni Teklif Hazırla</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <label className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><User size={14}/> Müşteri Seçin</label>
                <select required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 focus:border-indigo-500 outline-none" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
                    <option value="">Seçiniz...</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 className="font-bold flex items-center gap-2"><Package size={18}/> Ürünler</h3>
                {offerItems.map((item, index) => (
                    <div key={index} className="flex gap-3">
                        <select required className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-sm focus:border-indigo-500 outline-none" value={item.productId} onChange={e => handleProductChange(index, e.target.value)}>
                            <option value="">Ürün Seç...</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name} (%{p.vatRate})</option>)}
                        </select>
                        <input type="number" className="w-20 bg-slate-800 border border-slate-700 rounded-xl text-center" value={item.quantity} onChange={e => {const n=[...offerItems]; n[index].quantity=e.target.value; setOfferItems(n);}} />
                        <input type="number" className="w-32 bg-slate-800 border border-slate-700 rounded-xl text-right px-3" value={item.price} onChange={e => {const n=[...offerItems]; n[index].price=e.target.value; setOfferItems(n);}} />
                        <button type="button" onClick={() => removeItem(index)} className="text-red-400 p-2"><Trash2 size={18}/></button>
                    </div>
                ))}
                <button type="button" onClick={addItem} className="text-indigo-400 text-sm font-bold flex items-center gap-2"><Plus size={16}/> Satır Ekle</button>
            </div>

            <div className="flex justify-between items-center bg-indigo-600 p-6 rounded-3xl shadow-xl">
                <div>
                    <p className="text-xs text-indigo-200 font-bold uppercase">Toplam Tutar (KDV Dahil)</p>
                    <p className="text-3xl font-black">{calculateTotal().toLocaleString('tr-TR')} ₺</p>
                </div>
                <button type="submit" disabled={loading} className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black hover:bg-indigo-50 transition active:scale-95 flex items-center gap-2">
                    <Save size={20}/> {loading ? 'Kaydediliyor...' : 'Teklifi Kaydet'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}