'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Receipt, Package, Users, Building2, 
  ShieldCheck, LogOut, Wallet, ShoppingCart, Settings, 
  TrendingDown, FileText, ChevronDown, ChevronRight, Tags 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Yeni eklenen açılır menülerin state'leri
  const [openStokKart, setOpenStokKart] = useState(false);
  const [openStokGrup, setOpenStokGrup] = useState(false);

  const handleLogout = () => {
    if (confirm('Oturumu kapatmak istediğinize emin misiniz?')) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('ownerName');
      router.push('/login');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col text-white fixed left-0 top-0 overflow-y-auto custom-scrollbar">
      {/* 🚀 LOGO ALANI (Orijinal Tasarımın) */}
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          AI Muhasebe
        </h1>
        <p className="text-xs text-slate-500 mt-1">v2.0 Yönetim Paneli</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {/* 🏠 ANA MENÜLER (Senin Eski Listen) */}
        <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/') ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <LayoutDashboard size={20} /> <span>Genel Bakış</span>
        </Link>
        
        <Link href="/offers" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/offers') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <FileText size={20} /> <span>Teklifler</span>
        </Link>

        {/* 📂 1. YENİ: STOK TANITIM KARTLARI (Açılır Menü) */}
        <div className="space-y-1">
          <button 
            onClick={() => setOpenStokKart(!openStokKart)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-slate-400 hover:bg-slate-800 hover:text-white ${openStokKart ? 'text-indigo-400 bg-indigo-500/5' : ''}`}
          >
            <div className="flex items-center gap-3">
              <Package size={20} />
              <span className="font-medium text-sm">Stok Tanıtım Kartları</span>
            </div>
            {openStokKart ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {openStokKart && (
            <div className="ml-9 space-y-1 border-l border-slate-700">
              {[
                { name: 'Stok Kartı (011300)', href: '/products' },
                { name: 'Satış Fiyatları (0101)', href: '/products/prices' },
                { name: 'Alternatifler (0113)', href: '/products/alternatives' },
                { name: 'Kısa Stok Kartı (011350)', href: '/products/quick-add' },
                { name: 'Barkod Tanıtım (011500)', href: '/products/barcodes' },
                { name: 'Depo Detay Kartı', href: '/products/warehouses' },
                { name: 'Parti-Lot Kartı (0119)', href: '/products/lots' },
                { name: 'Seri No Takip', href: '/products/serials' },
                { name: 'Asorti Kartı (011750)', href: '/products/asorti' },
              ].map((item) => (
                <Link key={item.name} href={item.href} className="block py-2 px-4 text-xs text-slate-500 hover:text-indigo-400 transition-colors">
                  • {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 🏷️ 2. YENİ: STOK GRUP TANIMLARI (Açılır Menü) */}
        <div className="space-y-1">
          <button 
            onClick={() => setOpenStokGrup(!openStokGrup)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-slate-400 hover:bg-slate-800 hover:text-white ${openStokGrup ? 'text-emerald-400 bg-emerald-500/5' : ''}`}
          >
            <div className="flex items-center gap-3">
              <Tags size={20} />
              <span className="font-medium text-sm">Stok Grup Tanımları</span>
            </div>
            {openStokGrup ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {openStokGrup && (
            <div className="ml-9 space-y-1 border-l border-slate-700">
              {[
                { name: 'Ana/Alt Grup Kartı', href: '/categories' },
                { name: 'Üretici & Marka', href: '/brands' },
                { name: 'Reyon & Raf Adresleri', href: '/warehouse/shelves' },
                { name: 'Sektör Kartı', href: '/groups/sectors' },
                { name: 'Muhasebe Grup Kodları', href: '/accounting/stock-codes' },
                { name: 'Ambalaj Tanıtım', href: '/groups/packaging' },
                { name: 'Kalite Kontrol', href: '/groups/quality' },
                { name: 'Varyant & Model', href: '/products/variants' },
                { name: 'Renk Kartı', href: '/groups/colors' },
                { name: 'Beden Kartı', href: '/groups/sizes' },
              ].map((item) => (
                <Link key={item.name} href={item.href} className="block py-2 px-4 text-xs text-slate-500 hover:text-emerald-400 transition-colors">
                  • {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 📑 DİĞER ESKİ MENÜLERİN (Indigo Tarzında) */}
        <Link href="/invoices" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/invoices') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <Receipt size={20} /> <span>Satışlar & Faturalar</span>
        </Link>
        <Link href="/purchases/create" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/purchases/create') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <ShoppingCart size={20} /> <span>Satın Alma</span>
        </Link>
        <Link href="/expenses" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/expenses') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <TrendingDown size={20} /> <span>Giderler</span>
        </Link>
        <Link href="/finance" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/finance') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <Wallet size={20} /> <span>Finans & Kasa</span>
        </Link>
        <Link href="/companies" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/companies') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <Building2 size={20} /> <span>Cariler (Müşteri)</span>
        </Link>
        <Link href="/employees" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/employees') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <Users size={20} /> <span>Personeller</span>
        </Link>
        <Link href="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/settings') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <Settings size={20} /> <span>Firma Ayarları</span>
        </Link>
        <Link href="/licenses" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/licenses') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <ShieldCheck size={20} /> <span>Lisans Yönetimi</span>
        </Link>
      </nav>

      {/* 🚪 ÇIKIŞ BUTONU (Orijinal Tasarımın) */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-bold"
        >
          <LogOut size={20} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}