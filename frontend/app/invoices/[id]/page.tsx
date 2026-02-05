// frontend/app/invoices/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Printer, ArrowLeft, Building2, Phone, Mail, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, settingsRes] = await Promise.all([
          fetch(`http://localhost:3333/invoices/${id}`),
          fetch(`http://localhost:3333/settings`)
        ]);

        const invoiceData = await invoiceRes.json();
        const settingsData = await settingsRes.json();

        setInvoice(invoiceData);
        setSettings(settingsData);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-10 text-white text-center">Fatura yükleniyor...</div>;
  if (!invoice) return <div className="p-10 text-white text-center">Fatura bulunamadı.</div>;

  const companyInfo = {
    name: settings?.companyName || 'FİRMA ADI GİRİLMEMİŞ',
    address: settings?.address || 'Adres bilgisi girilmemiş.',
    phone: settings?.phone || '-',
    email: settings?.email || '-',
    // HEM taxId HEM taxNumber KONTROLÜ (ÇÖZÜM BURADA)
    taxId: settings?.taxId || settings?.taxNumber || '-', 
    iban: settings?.iban || '-',
    terms: settings?.terms || ''
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8 flex flex-col items-center">
      
      <div className="w-full max-w-[210mm] flex justify-between items-center mb-6 print:hidden">
        <Link href="/invoices" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
           <ArrowLeft size={20}/> Listeye Dön
        </Link>
        <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition">
            <Printer size={20} /> Yazdır / PDF İndir
        </button>
      </div>

      <div className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] p-12 shadow-2xl rounded-sm relative print:shadow-none print:w-full print:max-w-none print:min-h-0 print:p-0 print:m-0">
        
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
            <div>
               <div className="text-3xl font-black text-indigo-900 flex items-center gap-2 mb-2 uppercase">
                  <Building2 /> {companyInfo.name}
               </div>
               <p className="text-slate-500 text-sm whitespace-pre-line">{companyInfo.address}</p>
               <div className="flex gap-4 mt-2 text-sm text-slate-600">
                  <span className="flex items-center gap-1"><Phone size={14}/> {companyInfo.phone}</span>
                  <span className="flex items-center gap-1"><Mail size={14}/> {companyInfo.email}</span>
               </div>
            </div>
            <div className="text-right">
               <h2 className="text-4xl font-bold text-slate-200 uppercase tracking-widest">
                {invoice.type === 'PURCHASE' ? 'ALIŞ BELGESİ' : 'FATURA'}
               </h2>
               <div className="mt-4 space-y-1">
                  <p className="text-sm font-bold text-slate-600">NO: <span className="text-black font-mono text-base">#{invoice.id.slice(0,8).toUpperCase()}</span></p>
                  <p className="text-sm font-bold text-slate-600">TARİH: <span className="text-black font-mono text-base">{new Date(invoice.createdAt).toLocaleDateString('tr-TR')}</span></p>
               </div>
            </div>
        </div>

        <div className="mb-10 p-6 bg-slate-50 rounded-xl border border-slate-100">
           <p className="text-xs font-bold text-slate-400 uppercase mb-2">SAYIN (MÜŞTERİ/TEDARİKÇİ)</p>
           <h3 className="text-xl font-bold text-slate-900">{invoice.company?.name}</h3>
           <p className="text-slate-600 mt-1">{invoice.company?.address || 'Adres bilgisi yok.'}</p>
           {/* BURADA DA MÜŞTERİ VERGİ NOSUNU DÜZELTTİK */}
           <p className="text-slate-500 text-sm mt-2">Vergi No / T.C.: <strong>{invoice.company?.taxNumber || invoice.company?.taxId || '-'}</strong></p>
        </div>

        <table className="w-full mb-8 table-fixed border-collapse">
           <thead>
              <tr className="bg-indigo-900 text-white">
                 <th className="py-3 px-4 text-left rounded-l-lg w-[50%] font-bold">Ürün / Hizmet Açıklaması</th>
                 <th className="py-3 px-4 text-center w-[15%] font-bold">Miktar</th>
                 <th className="py-3 px-4 text-right w-[17.5%] font-bold">Birim Fiyat</th>
                 <th className="py-3 px-4 text-right rounded-r-lg w-[17.5%] font-bold">Toplam</th>
              </tr>
           </thead>
           <tbody className="text-sm">
              {invoice.items.map((item: any, index: number) => (
                 <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition">
                    <td className="py-4 px-4 font-bold text-slate-800 whitespace-normal break-words">
                        {item.product?.name || 'Silinmiş Ürün'}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-600">
                        {item.quantity}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-600 font-mono">
                        {Number(item.price).toLocaleString('tr-TR')} ₺
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-slate-900 font-mono">
                        {(Number(item.quantity) * Number(item.price)).toLocaleString('tr-TR')} ₺
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1 space-y-4">
                <div className="p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <h4 className="text-xs font-black text-slate-400 uppercase mb-2 flex items-center gap-1">
                        <CreditCard size={14}/> Ödeme Bilgileri
                    </h4>
                    <p className="text-xs font-bold text-slate-700">IBAN: <span className="font-mono text-sm">{companyInfo.iban}</span></p>
                </div>
                {companyInfo.terms && (
                    <div className="text-xs text-slate-500 italic">
                        <strong>Not:</strong> {companyInfo.terms}
                    </div>
                )}
            </div>

            <div className="w-64 space-y-3">
                <div className="flex justify-between text-slate-600">
                    <span>Ara Toplam:</span>
                    <span className="font-mono font-bold">{Number(invoice.totalAmount).toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between bg-indigo-900 text-white p-4 rounded-xl shadow-lg mt-2">
                    <span className="font-bold">GENEL TOPLAM</span>
                    <span className="font-black text-xl font-mono">{Number(invoice.totalAmount).toLocaleString('tr-TR')} ₺</span>
                </div>
            </div>
        </div>

        <div className="absolute bottom-12 left-12 right-12 text-center border-t border-slate-100 pt-8">
           <p className="text-indigo-900 font-bold mb-1">Bizi tercih ettiğiniz için teşekkür ederiz!</p>
           <p className="text-[10px] text-slate-400 leading-tight uppercase">
            Vergi Kimlik No: {companyInfo.taxId} | {companyInfo.name} <br/>
            Bu belge elektronik ortamda oluşturulmuştur.
           </p>
        </div>

      </div>

      <style jsx global>{`
        @media print {
          @page { margin: 10mm; size: A4; }
          body { background: white; -webkit-print-color-adjust: exact; }
          nav, aside, .print\\:hidden { display: none !important; }
          .min-h-screen { background: white !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}