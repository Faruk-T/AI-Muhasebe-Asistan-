// frontend/app/companies/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Building2, Save, ArrowLeft, CheckCircle2, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    taxNumber: '',
    address: '',
    phone: '',
    email: '',
    type: 'CUSTOMER'
  });

  // Verileri Çek
  useEffect(() => {
    fetch(`http://localhost:3333/companies/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Şirket bulunamadı');
        return res.json();
      })
      .then(data => {
        setFormData(data);
        setLoading(false);
      })
      .catch(() => router.push('/companies'));
  }, [id, router]);

  // Güncelleme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`http://localhost:3333/companies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/companies/${id}`); // Düzenleme bitince detay sayfasına geri dön
        }, 1500);
      } else {
        alert('Hata oluştu!');
      }
    } catch {
      alert('Sunucu hatası.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-white">Veriler yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 flex justify-center items-center relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>

      <div className="relative w-full max-w-3xl z-10">
        
        <Link href={`/companies/${id}`} className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 font-bold transition">
          <ArrowLeft size={20} /> Detaya Dön
        </Link>

        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
          
          <div className="flex items-center gap-5 mb-10 border-b border-white/10 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Şirketi Düzenle</h1>
              <p className="text-slate-400 mt-1">Cari bilgilerini güncelle.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-purple-400">Şirket Adı</label>
              <input required type="text" className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Vergi No</label>
                <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-white outline-none transition"
                  value={formData.taxNumber} onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Telefon</label>
                <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-white outline-none transition"
                  value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">E-Posta</label>
              <input type="email" className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-white outline-none transition"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">Adres</label>
              <textarea rows={3} className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-white outline-none transition resize-none"
                value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>

            <button disabled={saving || success} type="submit" className="w-full mt-8 group relative py-4 rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_auto] animate-gradient"></div>
              <div className="relative flex items-center justify-center gap-2">
                {success ? <><CheckCircle2 /> Güncellendi!</> : saving ? 'Kaydediliyor...' : <><Save /> Değişiklikleri Kaydet</>}
              </div>
            </button>

          </form>
        </div>
      </div>
       <style jsx>{`@keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } } .animate-gradient { animation: gradient 3s ease infinite; }`}</style>
    </div>
  );
}