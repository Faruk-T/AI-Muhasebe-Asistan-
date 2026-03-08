'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, Save, ArrowLeft, Percent, Ruler, Tag, 
  FolderTree, Landmark, Truck, CreditCard, Plus, Trash2, Barcode 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('genel');
  
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // 📝 EKSİKSİZ ERP DATA YAPISI (Tüm Etkileşimler Dahil)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    unit: 'Adet',
    stock: '0',
    criticalQty: '10',
    vatRate: '20',
    buyPrice: '',
    sellPrice: '',
    categoryId: '',
    brandId: '',
    sector: '',
    // Muhasebe
    accountStockCode: '153.01',
    accountSalesCode: '600.01',
    accountCostCode: '621.01',
    // Lojistik
    shelfAddress: '',
    weight: '',
    volume: '',
    // 🚀 DİNAMİK LİSTELER (ETKİLEŞİM)
    barcodes: [{ code: '', type: 'Adet' }], // Çoklu Barkod (011500)
    prices: [{ priceName: 'Toptan', amount: '', currency: 'TRY' }] // Çoklu Fiyat (0101)
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axios.get('http://localhost:3333/categories'),
          axios.get('http://localhost:3333/brands')
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (err) { console.error("Veriler çekilemedi"); }
    };
    fetchData();
  }, []);

  // --- DİNAMİK LİSTE YÖNETİMİ ---
  const addBarcode = () => setFormData({...formData, barcodes: [...formData.barcodes, { code: '', type: 'Adet' }]});
  const removeBarcode = (index: number) => setFormData({...formData, barcodes: formData.barcodes.filter((_, i) => i !== index)});
  
  const addPrice = () => setFormData({...formData, prices: [...formData.prices, { priceName: '', amount: '', currency: 'TRY' }]});
  const removePrice = (index: number) => setFormData({...formData, prices: formData.prices.filter((_, i) => i !== index)});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        buyPrice: Number(formData.buyPrice),
        sellPrice: Number(formData.sellPrice),
        stock: Number(formData.stock),
        // Boş olan barkod ve fiyatları temizleyip gönderiyoruz
        barcodes: formData.barcodes.filter(b => b.code !== ''),
        prices: formData.prices.filter(p => p.amount !== '')
      };
      await axios.post('http://localhost:3333/products', payload);
      toast.success('Stok Kartı ve İlişkili Tüm Kayıtlar Oluşturuldu! 🚀');
      router.push('/products');
    } catch (err) { toast.error('Kayıt yapılamadı.'); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 flex justify-center items-start">
      <div className="w-full max-w-5xl">
        <Link href="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 font-bold transition">
          <ArrowLeft size={20} /> Listeye Dön
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800/50 p-8 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20"><Package size={28} className="text-white" /></div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-orange-500">  Master Stok Tanıtım Kartı</h1>
                <p className="text-slate-400 text-sm italic underline">Sistemdeki Tüm İlişkili Kartları Aynı Anda Yönetin</p>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 transition-all active:scale-95 shadow-xl">
              <Save size={20} /> {loading ? 'İŞLENİYOR...' : 'F2 - KAYDET'}
            </button>
          </div>

          {/* 📑 Sekme Navigasyonu */}
          <div className="flex bg-slate-800/30 border-b border-slate-800 p-3 gap-3 overflow-x-auto">
            {[
              { id: 'genel', label: 'Genel & Gruplar', icon: Package },
              { id: 'barkod', label: 'Barkodlar (011500)', icon: Barcode },
              { id: 'fiyat', label: 'Fiyat Yönetimi (0101)', icon: CreditCard },
              { id: 'muhasebe', label: 'Muhasebe Kodları', icon: Landmark },
              { id: 'lojistik', label: 'Depo & Lojistik', icon: Truck },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-orange-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}>
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>

          <form className="p-10">
            {/* --- SEKME: GENEL --- */}
            {activeTab === 'genel' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="space-y-6">
                  <div><label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-2">Stok Kodu</label><input type="text" className="erp-input w-full" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-2">Stok Adı</label><input required type="text" className="erp-input w-full" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-2">Sektör</label>
                    <input type="text" placeholder="Örn: Otomotiv" className="erp-input w-full" value={formData.sector} onChange={(e) => setFormData({...formData, sector: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs uppercase ml-1 block mb-2 text-orange-400 font-black">Stok Grubu (Etkileşimli)</label>
                    <select className="erp-input w-full" value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})}>
                      <option value="">Grup Seçiniz...</option>
                      {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase ml-1 block mb-2 text-orange-400 font-black">Marka / Üretici</label>
                    <select className="erp-input w-full" value={formData.brandId} onChange={(e) => setFormData({...formData, brandId: e.target.value})}>
                      <option value="">Marka Seçiniz...</option>
                      {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-2">Birim</label><select className="erp-input w-full" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}><option value="Adet">Adet</option><option value="Kg">Kg</option><option value="Lt">Lt</option></select></div>
                </div>
              </div>
            )}

            {/* --- SEKME: BARKODLAR (011500) --- */}
            {activeTab === 'barkod' && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold">Çoklu Barkod Tanımları</h3>
                  <button type="button" onClick={addBarcode} className="text-xs bg-orange-600/20 text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-600 hover:text-white transition flex items-center gap-2"><Plus size={14}/> Barkod Ekle</button>
                </div>
                {formData.barcodes.map((bc, idx) => (
                  <div key={idx} className="flex gap-4 items-end bg-slate-800/20 p-4 rounded-2xl border border-slate-800">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Barkod No</label>
                      <input type="text" className="erp-input w-full py-2" value={bc.code} onChange={(e) => {
                        const newBC = [...formData.barcodes];
                        newBC[idx].code = e.target.value;
                        setFormData({...formData, barcodes: newBC});
                      }} />
                    </div>
                    <div className="w-32">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Tip</label>
                      <select className="erp-input w-full py-2" value={bc.type} onChange={(e) => {
                        const newBC = [...formData.barcodes];
                        newBC[idx].type = e.target.value;
                        setFormData({...formData, barcodes: newBC});
                      }}><option value="Adet">Adet</option><option value="Koli">Koli</option></select>
                    </div>
                    {idx > 0 && <button onClick={() => removeBarcode(idx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={18}/></button>}
                  </div>
                ))}
              </div>
            )}

            {/* --- SEKME: FİYATLAR (0101) --- */}
            {activeTab === 'fiyat' && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-slate-500 mb-2 block uppercase">Temel Alış Fiyatı</label><input type="number" className="erp-input w-full" value={formData.buyPrice} onChange={(e) => setFormData({...formData, buyPrice: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-green-500 mb-2 block uppercase">Temel Satış Fiyatı</label><input type="number" className="erp-input w-full font-black text-green-400" value={formData.sellPrice} onChange={(e) => setFormData({...formData, sellPrice: e.target.value})} /></div>
                 </div>
                 <hr className="border-slate-800"/>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center"><h3 className="text-white font-bold">Özel Fiyat Listeleri (VIP, Toptan vb.)</h3><button type="button" onClick={addPrice} className="text-xs bg-indigo-600/20 text-indigo-400 px-4 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition flex items-center gap-2"><Plus size={14}/> Fiyat Ekle</button></div>
                    {formData.prices.map((p, idx) => (
                      <div key={idx} className="flex gap-4 items-end bg-slate-800/20 p-4 rounded-2xl border border-slate-800">
                        <div className="flex-1"><label className="text-[10px] text-slate-500 uppercase mb-1 block">Liste Adı</label><input type="text" placeholder="Örn: VIP Müşteri" className="erp-input w-full py-2" value={p.priceName} onChange={(e) => {
                          const newP = [...formData.prices]; newP[idx].priceName = e.target.value; setFormData({...formData, prices: newP});
                        }} /></div>
                        <div className="w-40"><label className="text-[10px] text-slate-500 uppercase mb-1 block">Fiyat</label><input type="number" className="erp-input w-full py-2" value={p.amount} onChange={(e) => {
                          const newP = [...formData.prices]; newP[idx].amount = e.target.value; setFormData({...formData, prices: newP});
                        }} /></div>
                        {idx > 0 && <button onClick={() => removePrice(idx)} className="p-2 text-red-500"><Trash2 size={18}/></button>}
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {/* --- SEKME: MUHASEBE --- */}
            {activeTab === 'muhasebe' && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-slate-800/40 p-8 rounded-[2rem] border border-slate-800">
                  <h3 className="text-orange-500 font-black mb-6 flex items-center gap-2 text-lg"><Landmark size={22}/> Entegrasyon Hesap Kodları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Stok Hesabı (153)</label><input type="text" className="erp-input w-full font-mono text-center" value={formData.accountStockCode} onChange={(e) => setFormData({...formData, accountStockCode: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Satış Hesabı (600)</label><input type="text" className="erp-input w-full font-mono text-center" value={formData.accountSalesCode} onChange={(e) => setFormData({...formData, accountSalesCode: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Maliyet Hesabı (621)</label><input type="text" className="erp-input w-full font-mono text-center" value={formData.accountCostCode} onChange={(e) => setFormData({...formData, accountCostCode: e.target.value})} /></div>
                  </div>
                </div>
              </div>
            )}

            {/* --- SEKME: LOJİSTİK --- */}
            {activeTab === 'lojistik' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="space-y-6">
                  <div><label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-2">Raf / Depo Adresi</label><input type="text" placeholder="A-12-04" className="erp-input w-full" value={formData.shelfAddress} onChange={(e) => setFormData({...formData, shelfAddress: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-slate-500 uppercase block mb-2">Ağırlık (Kg)</label><input type="number" className="erp-input w-full" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase block mb-2">Hacim (m3)</label><input type="number" className="erp-input w-full" value={formData.volume} onChange={(e) => setFormData({...formData, volume: e.target.value})} /></div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <style jsx>{`
        .erp-input {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 1rem;
          padding: 1rem;
          color: white;
          outline: none;
          transition: all 0.2s;
        }
        .erp-input:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.1);
        }
      `}</style>
    </div>
  );
}