// admin-panel/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔐 PATRON ŞİFRESİ: Buraya istediğin şifreyi yaz
    const ADMIN_PASSWORD = "F.aruk27antep"; 

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuth', 'true'); // Giriş yapıldığını kaydet
      toast.success('Hoşgeldin Patron!');
      router.push('/licenses'); // Panele yönlendir
    } else {
      toast.error('Hatalı Şifre!');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Toaster />
      <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/50">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Yönetici Girişi</h1>
          <p className="text-gray-500">Devam etmek için şifreyi girin.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="password" 
            placeholder="Şifre"
            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-4 px-5 text-white outline-none focus:border-indigo-600 transition text-center text-lg tracking-widest"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
            Giriş Yap <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}