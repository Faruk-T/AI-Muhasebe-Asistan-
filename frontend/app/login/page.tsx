// 📂 Dosya: frontend/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, ArrowRight, ShieldCheck, Server } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 👑 Port 4000 (Lisans Sunucusu) ile konuş
      const res = await fetch('http://localhost:4000/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: licenseKey }), 
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        // Giriş Başarılı
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('ownerName', data.owner);
        
        // 👇 BU ÇOK ÖNEMLİ: Anahtarı hafızaya atıyoruz!
        localStorage.setItem('licenseKey', licenseKey); 

        toast.success(data.message);
        router.push('/');
      } else {
        toast.error(data.message || 'Giriş başarısız.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Lisans sunucusuna ulaşılamadı! (Port 4000 açık mı?)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      
      {/* Efektler */}
      <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>

      {/* Login Kartı */}
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
            <KeyRound size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">AI Muhasebe</h1>
          <p className="text-slate-400 mt-2">Bulut Lisans Doğrulama</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Lisans Anahtarı</label>
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition" size={20} />
              <input 
                type="text" 
                placeholder="XXXX-XXXX-XXXX"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:bg-slate-800 focus:ring-1 focus:ring-indigo-500/50 transition outline-none font-mono tracking-widest uppercase"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full group relative py-4 rounded-xl font-bold text-white overflow-hidden transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient"></div>
            <div className="relative flex items-center justify-center gap-2">
              {loading ? 'Sunucuya Soruluyor...' : <>Giriş Yap <ArrowRight size={18} className="group-hover:translate-x-1 transition" /></>}
            </div>
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
           <Server size={14} /> <span>Lisans Sunucusu: v1.0 (Online)</span>
        </div>
      </div>
       <style jsx>{`@keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } } .animate-gradient { animation: gradient 3s ease infinite; }`}</style>
    </div>
  );
}