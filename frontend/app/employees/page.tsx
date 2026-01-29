// frontend/app/employees/page.tsx
'use client';

import { Users, Plus, Briefcase, DollarSign, Mail, Phone, UserCircle, Sparkles, TrendingUp, Edit, Search } from 'lucide-react';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { useState, useEffect } from 'react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:3333/employees', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setEmployees(data);
        }
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // FİLTRELEME
  const filteredEmployees = employees.filter(emp => 
     emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (emp.title && emp.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalSalary = employees.reduce((acc, curr) => acc + Number(curr.salary), 0);
  const avgSalary = employees.length > 0 ? totalSalary / employees.length : 0;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6 overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full blur-[130px] opacity-20 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-purple-600 to-pink-600 rounded-full blur-[120px] opacity-20 animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-lg opacity-80 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-emerald-500 to-cyan-600 p-3 rounded-2xl">
                <Users size={32} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-200 via-cyan-200 to-white bg-clip-text text-transparent drop-shadow-lg">
                Personel Yönetimi
              </h1>
              <p className="text-cyan-200/70 text-sm font-semibold mt-1">İnsan kaynakları ve maaş takibi</p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {/* ARAMA */}
            <div className="relative group flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-slate-400 group-focus-within:text-emerald-400 transition" />
                </div>
                <input 
                  type="text" 
                  placeholder="Personel Ara..." 
                  className="w-full bg-slate-900/50 border border-slate-700/50 text-white rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* EKLE BUTONU (DÜZELTİLDİ: YAZI GERİ GELDİ) */}
            <Link 
              href="/employees/create" 
              className="group relative px-6 py-3.5 font-bold text-white rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap min-w-fit"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 transition duration-300"></div>
              <div className="relative flex items-center gap-2">
                <Plus size={20} />
                <span>Personel Ekle</span>
              </div>
            </Link>
          </div>
        </div>

        {loading ? (
           <div className="text-center py-20 text-emerald-200 animate-pulse">
             <Sparkles className="mx-auto mb-4 animate-spin" size={40}/>
             <p className="text-xl font-bold">Ekip Yükleniyor...</p>
           </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: 'Toplam Personel', value: employees.length, icon: <Users />, color: 'from-blue-600/20 to-cyan-600/20', border: 'border-blue-500/40' },
                { label: 'Aylık Maaş Yükü', value: `${totalSalary.toLocaleString('tr-TR')} ₺`, icon: <DollarSign />, color: 'from-emerald-600/20 to-teal-600/20', border: 'border-emerald-500/40' },
                { label: 'Ortalama Maaş', value: `${avgSalary.toLocaleString('tr-TR')} ₺`, icon: <TrendingUp />, color: 'from-purple-600/20 to-pink-600/20', border: 'border-purple-500/40' },
              ].map((stat, idx) => (
                <div key={idx} className={`relative overflow-hidden rounded-2xl border-2 ${stat.border} bg-gradient-to-br ${stat.color} backdrop-blur-xl p-5 hover:scale-105 transition duration-300`}>
                  <div className="relative">
                    <p className="text-white/70 text-sm font-bold flex items-center gap-2 mb-2">
                      <span className="p-1.5 bg-white/10 rounded-lg">{stat.icon}</span> {stat.label}
                    </p>
                    <p className="text-3xl font-black text-white drop-shadow-md">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.length > 0 ? filteredEmployees.map((emp: any) => (
                <div key={emp.id} className="group relative overflow-hidden rounded-2xl border-2 border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 transform hover:-translate-y-1">
                  
                  <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500"></div>

                  <div className="p-6">
                    
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <Link href={`/employees/${emp.id}`} className="p-2 bg-slate-800 hover:bg-emerald-500 rounded-lg text-slate-400 hover:text-white transition shadow-lg border border-slate-700 hover:border-emerald-400">
                        <Edit size={16} />
                      </Link>
                      <DeleteButton id={emp.id} endpoint="employees" />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600 group-hover:border-emerald-400 transition">
                        <UserCircle size={36} className="text-slate-300 group-hover:text-emerald-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">{emp.firstName} {emp.lastName}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Briefcase size={12} className="text-emerald-400" />
                          <span className="text-xs font-semibold text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-700">
                            {emp.title || 'Belirtilmedi'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="my-5 border-t border-slate-700/50"></div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 group-hover:border-slate-600 transition">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <DollarSign size={16} className="text-emerald-500" />
                          <span>Maaş</span>
                        </div>
                        <span className="text-emerald-300 font-bold">{Number(emp.salary).toLocaleString('tr-TR')} ₺</span>
                      </div>

                      <div className="space-y-2 text-sm">
                        {emp.email && (
                          <div className="flex items-center gap-3 text-slate-400 hover:text-white transition">
                            <Mail size={14} className="text-cyan-500" /> <span>{emp.email}</span>
                          </div>
                        )}
                        {emp.phone && (
                          <div className="flex items-center gap-3 text-slate-400 hover:text-white transition">
                            <Phone size={14} className="text-purple-500" /> <span>{emp.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )) : (
                 <div className="col-span-full text-center py-20 text-slate-500">
                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Personel bulunamadı.</p>
                 </div>
              )}
            </div>
          </>
        )}
      </div>
      <style jsx>{`@keyframes float { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(-20px, 20px); } } .animate-float { animation: float 8s ease-in-out infinite; }`}</style>
    </div>
  );
}