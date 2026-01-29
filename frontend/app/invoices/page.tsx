// frontend/app/invoices/page.tsx
'use client';

import { FileText, Plus, Calendar, Eye, FileCheck, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { useState, useEffect } from 'react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Verileri Çek
  const fetchInvoices = async () => {
    try {
      const res = await fetch('http://localhost:3333/invoices', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Durum Değiştirme Fonksiyonu (Toggle)
  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PAID' ? 'PENDING' : 'PAID';
    
    // UI'da hemen güncelle (Hızlı hissettirmek için)
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));

    try {
      await fetch(`http://localhost:3333/invoices/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      alert("Durum güncellenemedi!");
      fetchInvoices(); // Hata olursa eski veriyi geri çek
    }
  };

  const totalInvoiceAmount = invoices.reduce((acc, inv) => acc + Number(inv.totalAmount), 0);
  const pendingAmount = invoices.filter(i => i.status !== 'PAID').reduce((acc, inv) => acc + Number(inv.totalAmount), 0);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6 overflow-hidden">
      
      {/* Arka Plan Efektleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[130px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-80 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-2xl">
                <FileText size={32} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-200 via-indigo-200 to-white bg-clip-text text-transparent drop-shadow-lg">
                Fatura Geçmişi
              </h1>
              <p className="text-blue-200/70 text-sm font-semibold mt-1">Kesilen faturalar ve tahsilat durumu</p>
            </div>
          </div>

          <Link 
            href="/invoices/create" 
            className="group relative px-7 py-3.5 font-bold text-white rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 transition duration-300"></div>
            <div className="relative flex items-center gap-2">
              <Plus size={20} />
              <span>Yeni Fatura Kes</span>
            </div>
          </Link>
        </div>

        {loading ? (
           <div className="text-center py-20 text-indigo-200 animate-pulse">
             <Sparkles className="mx-auto mb-4 animate-spin" size={40}/>
             <p className="text-xl font-bold">Faturalar Yükleniyor...</p>
           </div>
        ) : (
          <>
            {/* ÖZET KARTLARI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative overflow-hidden rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-br from-indigo-900/40 to-blue-900/40 backdrop-blur-xl p-8">
                   <p className="text-indigo-300 font-bold mb-1">Toplam Kesilen Fatura</p>
                   <p className="text-4xl font-black text-white drop-shadow-lg">{totalInvoiceAmount.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="relative overflow-hidden rounded-2xl border-2 border-orange-500/40 bg-gradient-to-br from-orange-900/40 to-red-900/40 backdrop-blur-xl p-8">
                   <p className="text-orange-300 font-bold mb-1">Bekleyen Tahsilat</p>
                   <p className="text-4xl font-black text-orange-200 drop-shadow-lg">{pendingAmount.toLocaleString('tr-TR')} ₺</p>
                </div>
            </div>

            {/* FATURA LİSTESİ */}
            {invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.map((inv: any) => (
                  <div key={inv.id} className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${inv.status === 'PAID' ? 'border-emerald-500/30 bg-emerald-900/10' : 'border-slate-700/60 bg-slate-900/60'}`}>
                    
                    {/* Sol Kenar Çizgisi */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all ${inv.status === 'PAID' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>

                    <div className="p-5 pl-8 flex flex-col md:flex-row items-center justify-between gap-6">
                      
                      {/* Sol: Fatura No & Cari */}
                      <div className="flex-1 flex items-center gap-6">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${inv.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                            {inv.status === 'PAID' ? <CheckCircle2 size={20}/> : <Clock size={20}/>}
                         </div>
                         <div>
                            <h3 className="text-lg font-bold text-white transition flex items-center gap-2">
                               {inv.company?.name || 'Bilinmiyor'}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                               <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-xs">#{inv.id.substring(0, 8)}</span>
                               <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(inv.date).toLocaleDateString('tr-TR')}</span>
                            </div>
                         </div>
                      </div>

                      {/* Orta: Durum Butonu */}
                      <div className="flex flex-col items-center">
                          <button 
                            onClick={() => toggleStatus(inv.id, inv.status || 'PENDING')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition hover:scale-105 active:scale-95 flex items-center gap-2 ${
                                inv.status === 'PAID' 
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30' 
                                : 'bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30'
                            }`}
                          >
                             {inv.status === 'PAID' ? <><CheckCircle2 size={12}/> ÖDENDİ</> : <><Clock size={12}/> BEKLİYOR</>}
                          </button>
                      </div>

                      {/* Sağ: Tutar & İşlemler */}
                      <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                         <div className="text-right">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">Toplam Tutar</p>
                            <p className="text-xl font-black text-white">{Number(inv.totalAmount).toLocaleString('tr-TR')} ₺</p>
                         </div>
                         
                         <div className="flex items-center gap-3">
                            <Link 
                              href={`/invoices/${inv.id}`} 
                              className="p-2.5 bg-slate-800 hover:bg-indigo-500 rounded-xl text-indigo-400 hover:text-white transition border border-slate-700 hover:border-indigo-400"
                            >
                               <Eye size={18} />
                            </Link>
                            
                            <DeleteButton id={inv.id} endpoint="invoices" />
                         </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-indigo-500/30 bg-slate-900/50 backdrop-blur-sm py-20 text-center">
                 <FileText size={64} className="mx-auto mb-4 text-indigo-500/20" />
                 <h3 className="text-2xl font-bold text-white mb-2">Henüz Fatura Yok</h3>
                 <p className="text-slate-400 mb-6">İlk satışını yap ve faturanı kes.</p>
                 <Link href="/invoices/create" className="text-indigo-400 font-bold hover:underline">
                    + Fatura Oluştur
                 </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}