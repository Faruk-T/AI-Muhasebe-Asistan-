// frontend/app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Save, Building, Phone, MapPin, CreditCard, Mail, FileText, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    companyName: '',
    address: '',
    phone: '',
    email: '',
    taxId: '',
    iban: '',
    terms: ''
  });

  // Mevcut Ayarları Getir
  useEffect(() => {
    fetch('http://localhost:3333/settings')
      .then((res) => res.json())
      .then((data) => {
        // Eğer veri geldiyse formu doldur, gelmediyse (ilk açılış) boş kalsın
        if (data && Object.keys(data).length > 0) {
            setForm({
                companyName: data.companyName || '',
                address: data.address || '',
                phone: data.phone || '',
                email: data.email || '',
                taxId: data.taxId || '',
                iban: data.iban || '',
                terms: data.terms || ''
            });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ayarlar yüklenemedi.');
        setLoading(false);
      });
  }, []);

  // Kaydetme İşlemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('http://localhost:3333/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success('Firma bilgileri güncellendi! ✅');
      } else {
        toast.error('Kaydedilemedi.');
      }
    } catch {
      toast.error('Sunucu hatası.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-white relative overflow-hidden flex justify-center">
      
      {/* Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl">
        
        <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
                <Building size={32} className="text-white"/>
            </div>
            <div>
                <h1 className="text-3xl font-black text-white">Firma Ayarları</h1>
                <p className="text-slate-400">Faturalarda görünecek şirket bilgilerinizi düzenleyin.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
            
            {/* ŞİRKET KİMLİĞİ */}
            <div>
                <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2">
                    <FileText size={20}/> Şirket Kimliği
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Firma Adı / Ünvanı</label>
                        <input required type="text" placeholder="Örn: AI Teknoloji A.Ş." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition"
                            value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Vergi Dairesi / No</label>
                        <input type="text" placeholder="Örn: Beyoğlu VD - 1234567890" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition"
                            value={form.taxId} onChange={e => setForm({...form, taxId: e.target.value})} />
                    </div>
                </div>
            </div>

            <hr className="border-slate-800"/>

            {/* İLETİŞİM BİLGİLERİ */}
            <div>
                <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2">
                    <Phone size={20}/> İletişim Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><Phone size={12}/> Telefon</label>
                        <input type="text" placeholder="0212 000 00 00" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition"
                            value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><Mail size={12}/> E-Posta</label>
                        <input type="email" placeholder="info@sirketiniz.com" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition"
                            value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><MapPin size={12}/> Açık Adres</label>
                        <textarea rows={3} placeholder="Şirketinizin tam adresi..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition resize-none"
                            value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                    </div>
                </div>
            </div>

            <hr className="border-slate-800"/>

            {/* FİNANSAL BİLGİLER */}
            <div>
                <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2">
                    <CreditCard size={20}/> Finansal Bilgiler
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">IBAN (Banka Hesap Bilgisi)</label>
                        <input type="text" placeholder="TR00 0000 0000 0000 0000 0000 00" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition font-mono"
                            value={form.iban} onChange={e => setForm({...form, iban: e.target.value})} />
                        <p className="text-xs text-slate-500 flex items-center gap-1"><Info size={12}/> Bu bilgi faturanın en altına eklenecektir.</p>
                    </div>

                    <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase">Fatura Altı Notu (Şartlar)</label>
                         <input type="text" placeholder="Örn: 7 gün içinde iade edilebilir." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition"
                            value={form.terms} onChange={e => setForm({...form, terms: e.target.value})} />
                    </div>
                </div>
            </div>

            {/* KAYDET BUTONU */}
            <div className="pt-4">
                <button type="submit" disabled={saving} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ml-auto">
                    {saving ? 'Kaydediliyor...' : <><Save size={20}/> Ayarları Kaydet</>}
                </button>
            </div>

        </form>
      </div>
    </div>
  );
}