// frontend/app/companies/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Save, ArrowLeft, CheckCircle2, MapPin, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast'; // ✨ YENİ

export default function CreateCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    taxNumber: '',
    address: '',
    phone: '',
    email: '',
    type: 'CUSTOMER'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3333/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Cari başarıyla oluşturuldu! 🤝'); // ✨ YENİ
        router.push('/companies');
        router.refresh();
      } else {
        toast.error('Hata oluştu, eklenemedi.');
      }
    } catch {
      toast.error('Sunucu hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 flex justify-center items-center relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>

      <div className="relative w-full max-w-3xl z-10">
        
        <Link href="/companies" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 font-bold transition">
          <ArrowLeft size={20} /> Vazgeç
        </Link>

        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 sm:p-12 shadow-2xl">
          
          <div className="flex items-center gap-5 mb-10 border-b border-slate-800 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Yeni Cari Ekle</h1>
              <p className="text-slate-400 mt-1">Müşteri veya Tedarikçi hesabı oluştur.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-purple-400">Cari Türü</label>
              <div className="grid grid-cols-2 gap-4">
                 <button type="button" onClick={() => setFormData({...formData, type: 'CUSTOMER'})} className={`p-4 rounded-xl border font-bold transition flex items-center justify-center gap-2 ${formData.type === 'CUSTOMER' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'}`}>
                    MÜŞTERİ (Alıcı)
                 </button>
                 <button type="button" onClick={() => setFormData({...formData, type: 'SUPPLIER'})} className={`p-4 rounded-xl border font-bold transition flex items-center justify-center gap-2 ${formData.type === 'SUPPLIER' ? 'bg-pink-600/20 border-pink-500 text-pink-400' : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'}`}>
                    TEDARİKÇİ (Satıcı)
                 </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">Şirket / Kişi Adı</label>
              <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Vergi No / TC</label>
                <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-white outline-none transition"
                  value={formData.taxNumber} onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Telefon</label>
                <div className="relative">
                   <Phone size={18} className="absolute left-4 top-3.5 text-slate-500" />
                   <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-white outline-none transition"
                     value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">E-Posta</label>
              <div className="relative">
                 <Mail size={18} className="absolute left-4 top-3.5 text-slate-500" />
                 <input type="email" className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-white outline-none transition"
                   value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-bold text-slate-400">Adres</label>
               <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-3.5 text-slate-500" />
                  <textarea rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-white outline-none transition resize-none"
                    value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
               </div>
            </div>

            <button disabled={loading} type="submit" className="w-full mt-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20">
              {loading ? 'Kaydediliyor...' : <><Save /> Cariyi Kaydet</>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}