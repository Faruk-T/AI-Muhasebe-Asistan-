// 📂 Dosya: frontend/app/licenses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, Calendar, User, Key, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MyLicensePage() {
  const [licenseData, setLicenseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. LocalStorage'dan anahtarı çek
    const savedKey = localStorage.getItem('licenseKey'); 
    
    if (savedKey) {
      checkMyLicense(savedKey);
    } else {
      setLoading(false);
    }
  }, []);

  const checkMyLicense = async (key: string) => {
    try {
      // 👑 LİSANS İÇİN PORT 4000 (Backend değil, License Server)
      const res = await fetch('http://localhost:4000/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      setLicenseData({ ...data, key }); 
    } catch (error) {
      toast.error('Lisans sunucusuna ulaşılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <ShieldCheck className="text-indigo-500" size={32} /> Lisans Bilgilerim
        </h1>
        <p className="text-slate-400">Abonelik durumunuz ve detaylar.</p>
      </div>

      {loading ? (
        <div className="text-slate-500">Yükleniyor...</div>
      ) : licenseData?.valid ? (
        /* ✅ AKTİF */
        <div className="max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-4 bg-indigo-500/10 rounded-bl-2xl">
            <span className="text-indigo-400 font-bold text-sm flex items-center gap-2"><CheckCircle2 size={16}/> AKTİF</span>
          </div>
          <div className="space-y-4">
             <h2 className="text-2xl font-bold text-white">AI Muhasebe Pro</h2>
             <div className="text-lg text-white">Sahibi: <span className="font-bold text-indigo-400">{licenseData.owner}</span></div>
             <div className="text-lg text-white">Bitiş: <span className="font-bold text-indigo-400">{licenseData.expiresAt ? new Date(licenseData.expiresAt).toLocaleDateString('tr-TR') : 'Süresiz'}</span></div>
             <div className="bg-black/30 p-3 rounded-lg font-mono text-sm text-slate-400 mt-4 border border-white/5">{licenseData.key}</div>
          </div>
        </div>
      ) : (
        /* ❌ YOK */
        <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-2xl text-center max-w-md">
          <AlertTriangle className="mx-auto text-red-500 mb-3" size={40} />
          <h3 className="text-xl font-bold text-white">Lisans Bulunamadı</h3>
          <p className="text-slate-400">Giriş anahtarı kaydedilemedi.</p>
        </div>
      )}
    </div>
  );
}