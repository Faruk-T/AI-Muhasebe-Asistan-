// frontend/app/invoices/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, ShoppingCart, Trash2, Printer, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Faturaları Getir
  const fetchInvoices = async () => {
    try {
      const res = await fetch('http://localhost:3333/invoices');
      const data = await res.json();
      setInvoices(data);
    } catch (error) {
      console.error(error);
      toast.error('Faturalar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // 🗑️ FATURA SİLME FONKSİYONU
  const handleDelete = async (id: string) => {
    if (!confirm('⚠️ DİKKAT: Bu faturayı silmek istediğinize emin misiniz?\n\nBu işlem sonucunda:\n1. Stoklar eski haline dönecek.\n2. Cari bakiye düzeltilecek.\n\nOnaylıyor musunuz?')) {
        return;
    }

    try {
      const res = await fetch(`http://localhost:3333/invoices/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Fatura iptal edildi ve stoklar düzeltildi. ✅');
        // Listeden silineni kaldır
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Silinemedi.');
      }
    } catch {
      toast.error('Sunucu hatası.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* HEADER VE BUTONLAR */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <FileText className="text-blue-500" size={32} /> Faturalar & Satışlar
            </h1>
            <p className="text-slate-400 mt-1">Tüm alım-satım işlemlerini buradan yönet.</p>
          </div>
          
          <div className="flex gap-3">
            {/* Alış Faturası Butonu */}
            <Link 
              href="/purchases/create" 
              className="group bg-slate-900 border border-orange-500/30 hover:border-orange-500 text-orange-400 px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition hover:bg-orange-500/10"
            >
              <div className="p-1 bg-orange-500/20 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition">
                 <ShoppingCart size={18}/>
              </div>
              Yeni Alış Faturası
            </Link>

            {/* Satış Faturası Butonu */}
            <Link 
              href="/invoices/create" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-600/20"
            >
              <Plus size={20}/> Yeni Satış Faturası
            </Link>
          </div>
        </div>

        {/* LİSTE */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          {loading ? (
            <p className="text-center text-slate-500 py-10">Yükleniyor...</p>
          ) : invoices.length === 0 ? (
            <div className="text-center py-20">
               <FileText size={48} className="mx-auto text-slate-700 mb-4"/>
               <p className="text-slate-500 text-lg">Henüz hiç fatura kesilmemiş.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice: any) => (
                <div key={invoice.id} className="flex flex-col md:flex-row items-center justify-between p-5 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-blue-500/50 transition group">
                  
                  {/* Sol Taraf: İkon ve İsim */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${invoice.type === 'PURCHASE' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                       {invoice.type === 'PURCHASE' ? <ShoppingCart size={20}/> : <FileText size={20}/>}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">
                        {invoice.company?.name || 'Bilinmeyen Cari'}
                      </h3>
                      <p className="text-sm text-slate-400 flex items-center gap-2">
                         {invoice.type === 'PURCHASE' ? <span className="text-orange-400 font-bold text-xs">ALIŞ FATURASI</span> : <span className="text-blue-400 font-bold text-xs">SATIŞ FATURASI</span>}
                         • {new Date(invoice.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>

                  {/* Sağ Taraf: Tutar ve Butonlar */}
                  <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                       <p className="text-xs text-slate-500 font-bold uppercase">TOPLAM TUTAR</p>
                       <p className={`text-2xl font-black ${invoice.type === 'PURCHASE' ? 'text-white' : 'text-white'}`}>
                          {Number(invoice.totalAmount).toLocaleString('tr-TR')} ₺
                       </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* DETAY / YAZDIR BUTONU */}
                        <Link 
                        href={`/invoices/${invoice.id}`} 
                        className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition"
                        title="Detay Görüntüle / Yazdır"
                        >
                        <Printer size={20} />
                        </Link>

                        {/* 🗑️ SİLME BUTONU */}
                        <button 
                        onClick={() => handleDelete(invoice.id)}
                        className="p-3 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition border border-red-500/30"
                        title="Faturayı İptal Et ve Sil"
                        >
                        <Trash2 size={20} />
                        </button>
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