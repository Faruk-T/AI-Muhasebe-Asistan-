// frontend/components/LicenseGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function LicenseGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 1. Herkese açık sayfalarda kontrolü atla
    if (['/login', '/licenses'].includes(pathname)) {
      setAuthorized(true);
      return;
    }

    const verifyLicense = async () => {
      const key = localStorage.getItem('licenseKey');

      // Anahtar hiç yoksa -> KOV
      if (!key) {
        router.push('/login');
        return;
      }

      try {
        // Anahtar var, peki geçerli mi? Merkeze sor.
        const res = await fetch('http://localhost:4000/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key }),
        });

        const data = await res.json();

        // ŞİMDİ SIKI YÖNETİM ZAMANI 👮‍♂️
        const isExpired = data.expiresAt && new Date(data.expiresAt) < new Date();

        if (!data.valid || isExpired) {
          // Lisans geçersiz veya süresi dolmuş -> KOV
          toast.error('Lisans süreniz doldu! Lütfen yenileyin.');
          localStorage.removeItem('isLoggedIn'); // Oturumu düşür
          router.push('/login');
        } else {
          // Her şey temiz -> İÇERİ AL
          setAuthorized(true);
        }

      } catch (error) {
        // Sunucuya ulaşamazsak güvenlik gereği içeri almıyoruz
        console.error("Lisans sunucusu hatası:", error);
        toast.error('Güvenlik kontrolü yapılamadı (Lisans sunucusu kapalı olabilir).');
        setAuthorized(false); 
      }
    };

    verifyLicense();

  }, [pathname, router]);

  // Kontrol bitene kadar hiçbir şey gösterme (Beyaz ekran yerine Loading dönebilirsin)
  if (!authorized) return <div className="h-screen bg-slate-950 flex items-center justify-center text-slate-500">Güvenlik Kontrolü...</div>;

  return <>{children}</>;
}