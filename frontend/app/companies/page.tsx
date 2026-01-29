// frontend/app/companies/page.tsx
'use client';

import { Building2, Plus, Phone, Mail, MapPin, Search, Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { useState, useEffect } from 'react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // 🔍

  useEffect(() => {
    fetch('http://localhost:3333/companies', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // 🔍 FİLTRELEME
  const filteredCompanies = companies.filter(c => 
     c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (c.phone && c.phone.includes(searchTerm)) ||
     (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalBalance = companies.reduce((acc, c) => acc + Number(c.balance), 0);
  const receivable = companies.filter(c => Number(c.balance) > 0).reduce((acc, c) => acc + Number(c.balance), 0);
  const payable = companies.filter(c => Number(c.balance) < 0).reduce((acc, c) => acc + Math.abs(Number(c.balance)), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Building2 size={32} className="text-white" />
             </div>
             <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                   Şirketler & Cariler
                </h1>
                <p className="text-purple-300/60 text-sm font-bold">Tüm müşteri ve tedarikçi hesaplarını yönet</p>
             </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
             {/* 🔍 ARAMA KUTUSU */}
             <div className="relative group flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-slate-400 group-focus-within:text-purple-400 transition" />
                </div>
                <input 
                  type="text" 
                  placeholder="Şirket Ara..." 
                  className="w-full bg-slate-900/50 border border-slate-700/50 text-white rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

             <Link href="/companies/create" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition transform hover:scale-105 active:scale-95 whitespace-nowrap">
                <Plus size={20} /> <span className="hidden sm:inline">Cari Ekle</span>
             </Link>
          </div>
        </div>

        {loading ? (
           <div className="text-center py-20 text-purple-200">Yükleniyor...</div>
        ) : (
          <>
             {/* İSTATİSTİK KARTLARI */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 backdrop-blur-sm">
                   <p className="text-slate-400 text-xs font-bold uppercase mb-2">Toplam Cari</p>
                   <p className="text-3xl font-black text-white">{companies.length}</p>
                </div>
                <div className="bg-gradient-to-br from-red-900/40 to-slate-900/50 border border-red-500/20 rounded-2xl p-5 backdrop-blur-sm">
                   <p className="text-red-300 text-xs font-bold uppercase mb-2 flex items-center gap-2">Alacak (Borçlu)</p>
                   <p className="text-3xl font-black text-white">{receivable.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/50 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur-sm">
                   <p className="text-emerald-300 text-xs font-bold uppercase mb-2 flex items-center gap-2">Borç (Alacaklı)</p>
                   <p className="text-3xl font-black text-white">{payable.toLocaleString('tr-TR')} ₺</p>
                </div>
             </div>

             {/* ŞİRKET KARTLARI (Filtrelenmiş) */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.length > 0 ? filteredCompanies.map((company) => (
                   <div key={company.id} className="group relative bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
                      
                      {/* Üst Kısım */}
                      <div className="flex items-start gap-4 mb-6">
                         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                            {company.name.substring(0, 1).toUpperCase()}
                         </div>
                         <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">{company.name}</h3>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-400 uppercase tracking-wide">
                               {company.type === 'CUSTOMER' ? 'Müşteri' : 'Tedarikçi'}
                            </span>
                         </div>
                      </div>

                      <div className="space-y-3 mb-6">
                         <div className="flex items-center gap-3 text-sm text-slate-400">
                            <Phone size={14} className="text-purple-500" />
                            <span>{company.phone || 'Telefon yok'}</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-slate-400">
                            <MapPin size={14} className="text-pink-500" />
                            <span className="line-clamp-1">{company.address || 'Adres yok'}</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-slate-400">
                            <Mail size={14} className="text-blue-500" />
                            <span className="truncate">{company.email || 'Mail yok'}</span>
                         </div>
                      </div>

                      {/* Bakiye */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700 mb-6">
                         <span className="text-xs font-bold text-slate-500">Bakiye</span>
                         <span className={`text-lg font-black ${Number(company.balance) > 0 ? 'text-red-400' : Number(company.balance) < 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {Number(company.balance) > 0 ? '↝ ' : ''}
                            {Number(company.balance).toLocaleString('tr-TR')} ₺
                         </span>
                      </div>

                      {/* Butonlar */}
                      <div className="flex gap-2">
                         <Link href={`/companies/${company.id}`} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/20">
                            <Eye size={16} /> Detay
                         </Link>
                         <DeleteButton id={company.id} endpoint="companies" />
                      </div>
                   </div>
                )) : (
                    <div className="col-span-full text-center py-20 text-slate-500">
                       <Search size={48} className="mx-auto mb-4 opacity-20" />
                       <p>Cari bulunamadı.</p>
                    </div>
                )}
             </div>
          </>
        )}
      </div>
    </div>
  );
}