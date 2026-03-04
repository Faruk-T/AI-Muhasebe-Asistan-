'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Receipt, Package, Users, Building2, 
  ShieldCheck, LogOut, Wallet, ShoppingCart, Settings, TrendingDown, FileText 
} from 'lucide-react';

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Genel Bakış', href: '/' },
  { icon: <FileText size={20} />, label: 'Teklifler', href: '/offers' },
  { icon: <Receipt size={20} />, label: 'Satışlar & Faturalar', href: '/invoices' },
  { icon: <ShoppingCart size={20} />, label: 'Satın Alma', href: '/purchases/create' },
  { icon: <TrendingDown size={20} />, label: 'Giderler', href: '/expenses' },
  { icon: <Wallet size={20} />, label: 'Finans & Kasa', href: '/finance' },
  { icon: <Package size={20} />, label: 'Ürünler & Stok', href: '/products' },
  { icon: <Building2 size={20} />, label: 'Cariler (Müşteri)', href: '/companies' },
  { icon: <Users size={20} />, label: 'Personeller', href: '/employees' },
  { icon: <Settings size={20} />, label: 'Firma Ayarları', href: '/settings' },
  { icon: <ShieldCheck size={20} />, label: 'Lisans Yönetimi', href: '/licenses' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('Oturumu kapatmak istediğinize emin misiniz?')) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('ownerName');
      router.push('/login');
    }
  };

  return (
    <div className="h-full bg-slate-900 border-r border-slate-800 flex flex-col text-white">
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          AI Muhasebe
        </h1>
        <p className="text-xs text-slate-500 mt-1">v2.0 Yönetim Paneli</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

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