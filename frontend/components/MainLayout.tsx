// frontend/components/MainLayout.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  // Bu sayfalarda Sidebar gözükmesin (Login sayfasında menü olmamalı)
  const hideSidebar = pathname === '/login';

  useEffect(() => {
    // Şimdilik basitçe localStorage kontrolü yapıyoruz
    // Eğer giriş yapılmamışsa ve login sayfasında değilsek -> Login'e at
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn && pathname !== '/login') {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  // Yetki kontrolü bitene kadar beyaz ekran göster (Kırpışmayı önler)
  if (!authorized && pathname !== '/login') {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Yükleniyor...</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Eğer login sayfasında değilsek Sidebar'ı göster */}
      {!hideSidebar && (
        <aside className="w-64 hidden md:block fixed h-full z-50">
          <Sidebar />
        </aside>
      )}

      {/* İçerik (Eğer sidebar varsa sağa kaydır) */}
      <main className={`flex-1 ${!hideSidebar ? 'md:ml-64' : ''} min-h-screen`}>
        {children}
      </main>
    </div>
  );
}