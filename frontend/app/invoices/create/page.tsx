// frontend/app/invoices/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, ArrowLeft, User, Wallet, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function CreateInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Veriler
  const [companies, setCompanies] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]); 

  // Form State
  const [selectedCompany, setSelectedCompany] = useState('');
  
  // SATIRLARDA ARTIK KDV ORANINI DA TUTUYORUZ (vatRate)
  const [invoiceItems, setInvoiceItems] = useState<any[]>([
    { productId: '', quantity: 1, price: 0, vatRate: 0 } 
  ]);
  
  const [isPaid, setIsPaid] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');

  // Verileri Çek
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3333/companies').then(res => res.json()),
      fetch('http://localhost:3333/products').then(res => res.json()),
      fetch('http://localhost:3333/finance/accounts').then(res => res.json())
    ]).then(([compData, prodData, accData]) => {
      setCompanies(compData);
      setProducts(prodData);
      setAccounts(accData);
      if(accData.length > 0) setSelectedAccount(accData[0].id);
    });
  }, []);

  // Ürün Seçilince Fiyat ve KDV'yi Getir
  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    const newItems = [...invoiceItems];
    newItems[index].productId = productId;
    
    if (product) {
        newItems[index].price = Number(product.sellPrice);
        newItems[index].vatRate = Number(product.vatRate || 0); // KDV Oranını Al
    } else {
        newItems[index].price = 0;
        newItems[index].vatRate = 0;
    }
    
    setInvoiceItems(newItems);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...invoiceItems];
    newItems[index][field] = value;
    setInvoiceItems(newItems);
  };

  const addItem = () => setInvoiceItems([...invoiceItems, { productId: '', quantity: 1, price: 0, vatRate: 0 }]);
  const removeItem = (index: number) => setInvoiceItems(invoiceItems.filter((_, i) => i !== index));

  // GELİŞMİŞ HESAPLAMA (Ara Toplam, KDV, Genel Toplam)
  const calculateTotals = () => {
    let subTotal = 0; // KDV Hariç
    let totalTax = 0; // Toplam KDV Tutarı
    
    invoiceItems.forEach(item => {
        const qty = Number(item.quantity);
        const prc = Number(item.price);
        const vat = Number(item.vatRate);

        const lineTotal = qty * prc; // KDV'siz Tutar
        const tax = lineTotal * (vat / 100); // KDV Tutarı

        subTotal += lineTotal;
        totalTax += tax;
    });

    return {
        subTotal,
        totalTax,
        grandTotal: subTotal + totalTax
    };
  };

  const { subTotal, totalTax, grandTotal } = calculateTotals();

  // KAYDET
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return toast.error('Lütfen bir müşteri seçin.');
    if (invoiceItems.some(i => !i.productId)) return toast.error('Lütfen tüm satırlarda ürün seçin.');
    if (isPaid && !selectedAccount) return toast.error('Ödeme alındıysa kasa seçmelisiniz.');

    setLoading(true);

    try {
      const res = await fetch('http://localhost:3333/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: selectedCompany,
          items: invoiceItems,
          type: 'SALES',
          isPaid: isPaid,
          accountId: isPaid ? selectedAccount : null
        }),
      });

      if (res.ok) {
        toast.success('Fatura başarıyla oluşturuldu! 🎉');
        router.push('/invoices');
      } else {
        const err = await res.json();
        toast.error(err.message || 'Hata oluştu.');
      }
    } catch {
      toast.error('Sunucu hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white relative">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
            <Link href="/invoices" className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition">
                <ArrowLeft size={20}/>
            </Link>
            <h1 className="text-3xl font-black">Yeni Satış Faturası</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* SOL KOLON */}
            <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                    <label className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <User size={14}/> Müşteri Seçin
                    </label>
                    <select 
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-indigo-500 outline-none"
                        value={selectedCompany}
                        onChange={e => setSelectedCompany(e.target.value)}
                    >
                        <option value="">Müşteri Seçiniz...</option>
                        {companies.filter(c => c.type === 'CUSTOMER').map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Ürünler & Hizmetler</h3>
                    </div>

                    <div className="space-y-3">
                        {invoiceItems.map((item, index) => (
                            <div key={index} className="flex gap-3 items-start">
                                <div className="flex-1">
                                    <select 
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-sm focus:border-indigo-500 outline-none"
                                        value={item.productId}
                                        onChange={e => handleProductChange(index, e.target.value)}
                                    >
                                        <option value="">Ürün Seç...</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock}, KDV: %{p.vatRate})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-24">
                                    <input 
                                        type="number" min="1" required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-sm text-center focus:border-indigo-500 outline-none"
                                        value={item.quantity}
                                        onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                                    />
                                </div>

                                <div className="w-32">
                                    <div className="relative">
                                        <input 
                                            type="number" min="0" step="0.01" required
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-sm text-right focus:border-indigo-500 outline-none"
                                            value={item.price}
                                            onChange={e => handleItemChange(index, 'price', e.target.value)}
                                        />
                                        <span className="absolute right-8 top-3 text-slate-500 text-xs">₺</span>
                                    </div>
                                </div>

                                {invoiceItems.length > 1 && (
                                    <button type="button" onClick={() => removeItem(index)} className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition">
                                        <Trash2 size={18}/>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button type="button" onClick={addItem} className="mt-4 flex items-center gap-2 text-indigo-400 font-bold text-sm hover:text-indigo-300 transition">
                        <Plus size={16}/> Başka Satır Ekle
                    </button>
                </div>

            </div>

            {/* SAĞ KOLON: Özet */}
            <div className="space-y-6">
                
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                    <label className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                        <Wallet size={14}/> Ödeme Durumu
                    </label>
                    
                    <div className="flex bg-slate-800 p-1 rounded-xl mb-4">
                        <button type="button" onClick={() => setIsPaid(false)} className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${!isPaid ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                            Veresiye
                        </button>
                        <button type="button" onClick={() => setIsPaid(true)} className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${isPaid ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                            Peşin
                        </button>
                    </div>

                    {isPaid && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Kasa Seçimi</label>
                            <select 
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                                value={selectedAccount}
                                onChange={e => setSelectedAccount(e.target.value)}
                            >
                                {accounts.map(a => (
                                    <option key={a.id} value={a.id}>{a.name} ({Number(a.balance).toLocaleString('tr-TR')} ₺)</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                    <div className="flex justify-between items-center mb-2 text-slate-400">
                        <span>Ara Toplam (KDV Hariç)</span>
                        <span>{subTotal.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    {/* ARTIK KDV DOĞRU HESAPLANIYOR */}
                    <div className="flex justify-between items-center mb-6 text-emerald-400 font-bold">
                        <span>Toplam KDV</span>
                        <span>+ {totalTax.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                    </div>
                    <div className="border-t border-slate-800 pt-4 flex justify-between items-center mb-6">
                        <span className="font-bold text-xl">GENEL TOPLAM</span>
                        <span className="font-black text-2xl text-indigo-400">{grandTotal.toLocaleString('tr-TR')} ₺</span>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? 'İşleniyor...' : <><Save size={20}/> Faturayı Oluştur</>}
                    </button>
                </div>

            </div>
        </form>
      </div>
    </div>
  );
}