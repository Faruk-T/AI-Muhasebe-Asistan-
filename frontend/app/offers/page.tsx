'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, Trash2, Printer, CheckCircle, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      const res = await fetch('http://localhost:3333/offers');
      const data = await res.json();
      setOffers(data);
    } catch {
      toast.error('Teklifler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  // 🔄 TEKLİFİ FATURAYA DÖNÜŞTÜR (Convert)
  const handleConvert = async (id: string) => {
    if (!confirm('Bu teklifi onaylayıp satış faturasına dönüştürmek istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`http://localhost:3333/offers/${id}/convert`, { method: 'POST' });
      if (res.ok) {
        toast.success('Teklif başarıyla faturalandırıldı! 🧾');
        fetchOffers(); // Listeyi güncelle
      } else {
        const err = await res.json();
        toast.error(err.message || 'Dönüştürme başarısız.');
      }
    } catch {
      toast.error('Sunucu hatası.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white relative">
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <FileText className="text-indigo-500" size={32} /> Teklif Yönetimi
            </h1>
            <p className="text-slate-400 mt-1">Müşterilerinize verdiğiniz teklifleri takip edin.</p>
          </div>
          <Link href="/offers/create" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-600/20">
            <Plus size={20}/> Yeni Teklif Hazırla
          </Link>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          {loading ? (
            <p className="text-center text-slate-500 py-10">Yükleniyor...</p>
          ) : offers.length === 0 ? (
            <div className="text-center py-20 text-slate-500">Henüz teklif bulunmuyor.</div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer: any) => (
                <div key={offer.id} className="flex items-center justify-between p-5 bg-slate-800/40 border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${offer.status === 'CONVERTED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                       {offer.status === 'CONVERTED' ? <CheckCircle size={20}/> : <FileText size={20}/>}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{offer.company?.name || offer.customer?.name || 'Bilinmeyen Müşteri'}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span>{new Date(offer.createdAt).toLocaleDateString('tr-TR')}</span>
                        <span>•</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${offer.status === 'CONVERTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {offer.status === 'CONVERTED' ? 'Faturalandı' : 'Beklemede'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                       <p className="text-xs text-slate-500 font-bold">TEKLİF TUTARI</p>
                       <p className="text-xl font-black text-white">{offer.totalAmount.toLocaleString('tr-TR')} {offer.currency}</p>
                    </div>
                    
                    <div className="flex gap-2">
                        {offer.status !== 'CONVERTED' && (
                            <button onClick={() => handleConvert(offer.id)} className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition flex items-center gap-2 px-4 text-sm font-bold" title="Onayla ve Faturalandır">
                                <ArrowRightLeft size={18}/> Faturalandır
                            </button>
                        )}
                        <Link href={`/offers/${offer.id}`} className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition"><Printer size={20} /></Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}