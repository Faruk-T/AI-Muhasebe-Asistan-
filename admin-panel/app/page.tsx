import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-indigo-600/20 p-6 rounded-full mb-6 animate-pulse">
        <ShieldCheck size={64} className="text-indigo-500" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Admin Paneline Hoşgeldiniz</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Buradan lisansları yönetebilir, yeni müşteri ekleyebilir ve süreleri kontrol edebilirsiniz.
      </p>
      
      <Link 
        href="/licenses" 
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg shadow-indigo-500/20 flex items-center gap-2"
      >
        <ShieldCheck size={20} />
        Lisans Yönetimine Git
      </Link>
    </div>
  );
}