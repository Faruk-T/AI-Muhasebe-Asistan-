import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import MainLayout from '../components/MainLayout';
import LicenseGuard from '@/components/LicenseGuard'; // 👈 1. Kalkanı İçe Aktardık

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Muhasebe',
  description: 'Geleceğin Ön Muhasebe Yazılımı',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-slate-950 text-slate-100`}>
        
        {/* Bildirimler her yerde çalışsın */}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        
        {/* 🛡️ 2. GÜVENLİK KALKANI: Tüm sistemi korumaya aldık */}
        <LicenseGuard>
            <MainLayout>
              {children}
            </MainLayout>
        </LicenseGuard>

      </body>
    </html>
  );
}