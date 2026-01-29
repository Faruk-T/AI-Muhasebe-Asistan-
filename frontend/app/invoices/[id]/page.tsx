'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FileText, Printer, ArrowLeft, Building, Calendar, Phone, MapPin, Hash, Package } from 'lucide-react';
import Link from 'next/link';

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3333/invoices/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInvoice(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Yazdırma Fonksiyonu
  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="text-center py-20 text-indigo-300 animate-pulse">Fatura Detayları Getiriliyor...</div>;
  if (!invoice) return <div className="text-center py-20 text-red-400">Fatura bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 flex justify-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-4xl z-10 space-y-6">
        
        {/* Üst Bar (Geri Dön & Yazdır) */}
        <div className="flex justify-between items-center print:hidden">
          <Link href="/invoices" className="flex items-center gap-2 text-slate-400 hover:text-white transition font-bold">
            <ArrowLeft size={20} /> Listeye Dön
          </Link>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition transform active:scale-95"
          >
            <Printer size={18} /> Yazdır / PDF
          </button>
        </div>

        {/* FATURA KAĞIDI (KART) */}
        <div className="bg-white text-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden print:shadow-none print:rounded-none">
          
          {/* Fatura Başlığı */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b-2 border-slate-100 pb-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <FileText size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-800 uppercase tracking-wide">Fatura</h1>
                <p className="text-slate-500 font-mono text-sm mt-1">#{invoice.id.substring(0, 8).toUpperCase()}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 font-bold uppercase mb-1">Durum</div>
              <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full font-bold text-sm">
                ✅ ÖDENDİ / KESİLDİ
              </span>
            </div>
          </div>

          {/* Cari & Tarih Bilgileri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            
            {/* Müşteri Bilgisi */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Building size={14} /> Sayın / Firma
              </h3>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-xl font-bold text-slate-800 mb-2">{invoice.company?.name}</p>
                <div className="space-y-1 text-sm text-slate-500">
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-indigo-400"/> {invoice.company?.address || 'Adres Girilmemiş'}</p>
                  <p className="flex items-center gap-2"><Phone size={14} className="text-indigo-400"/> {invoice.company?.phone || 'Telefon Yok'}</p>
                  <p className="flex items-center gap-2"><Hash size={14} className="text-indigo-400"/> Vergi No: {invoice.company?.taxNumber || '-'}</p>
                </div>
              </div>
            </div>

            {/* Tarih & Detay */}
            <div className="flex flex-col justify-between">
               <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar size={14} /> Fatura Tarihi
                  </h3>
                  <p className="text-xl font-bold text-slate-800">{new Date(invoice.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-slate-400 text-sm mt-1">{new Date(invoice.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
               </div>
            </div>
          </div>

          {/* Ürünler Tablosu */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package size={14} /> Hizmet & Ürün Detayı
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-4 font-bold text-slate-600 text-sm">Ürün Adı</th>
                  <th className="py-4 font-bold text-slate-600 text-sm text-center">Adet</th>
                  <th className="py-4 font-bold text-slate-600 text-sm text-right">Birim Fiyat</th>
                  <th className="py-4 font-bold text-slate-600 text-sm text-right">Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-4 font-medium text-slate-800">{item.product?.name || 'Silinmiş Ürün'}</td>
                    <td className="py-4 text-slate-500 text-center">{item.quantity}</td>
                    <td className="py-4 text-slate-500 text-right font-mono">{Number(item.price).toLocaleString('tr-TR')} ₺</td>
                    <td className="py-4 text-slate-800 font-bold text-right font-mono">{Number(item.total).toLocaleString('tr-TR')} ₺</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Toplam Alanı */}
          <div className="flex justify-end">
            <div className="bg-slate-900 text-white p-6 rounded-2xl w-full md:w-64 text-right shadow-xl">
              <p className="text-slate-400 text-xs uppercase font-bold mb-1">Genel Toplam</p>
              <p className="text-3xl font-black">{Number(invoice.totalAmount).toLocaleString('tr-TR')} ₺</p>
            </div>
          </div>

          {/* Alt Bilgi */}
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs font-medium">Bu belge bilgisayar ortamında oluşturulmuştur, ıslak imza gerektirmez.</p>
            <p className="text-slate-300 text-[10px] mt-1">AI Muhasebe Asistanı © 2026</p>
          </div>

        </div>
      </div>
    </div>
  );
}