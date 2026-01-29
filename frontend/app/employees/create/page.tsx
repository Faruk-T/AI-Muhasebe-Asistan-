// frontend/app/employees/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast'; // ✨ YENİ

export default function CreateEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    phone: '',
    email: '',
    salary: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3333/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Personel takıma eklendi! 🎉'); // ✨ YENİ
        router.push('/employees');
        router.refresh();
      } else {
        toast.error('Hata oluştu.');
      }
    } catch {
      toast.error('Sunucu hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 flex justify-center items-center relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse"></div>

      <div className="relative w-full max-w-2xl z-10">
        
        <Link href="/employees" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 font-bold transition">
          <ArrowLeft size={20} /> Vazgeç
        </Link>

        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
             <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/30">
                <UserPlus size={32} className="text-white" />
             </div>
             <h1 className="text-3xl font-black text-white">Yeni Personel</h1>
             <p className="text-slate-400">Ekip arkadaşı ekle.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Ad</label>
                  <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-emerald-500 transition" 
                    value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
               </div>
               <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Soyad</label>
                  <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-emerald-500 transition" 
                    value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Ünvan / Pozisyon</label>
                  <input type="text" placeholder="Örn: Satış Müdürü" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-emerald-500 transition" 
                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
               </div>
               <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Maaş (₺)</label>
                  <input type="number" placeholder="0" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-emerald-500 transition font-bold" 
                    value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Telefon</label>
                  <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-emerald-500 transition" 
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
               </div>
               <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">E-Posta</label>
                  <input type="email" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-emerald-500 transition" 
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
               </div>
            </div>

            <button disabled={loading} type="submit" className="w-full py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/30 transition active:scale-95 flex items-center justify-center gap-2">
               {loading ? 'Kaydediliyor...' : <><Save size={20} /> Kaydet</>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}