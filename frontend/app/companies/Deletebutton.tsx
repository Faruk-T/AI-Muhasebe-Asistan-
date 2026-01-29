// frontend/components/DeleteButton.tsx
'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast'; // ✨ YENİ

interface DeleteButtonProps {
  id: string;
  endpoint: string;
}

export default function DeleteButton({ id, endpoint }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    // Tarayıcının standart onayı kalsın (Güvenlik için)
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3333/${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Kayıt başarıyla silindi! 🗑️'); // ✨ YENİ
        router.refresh();
      } else {
        toast.error('Silinirken hata oluştu.');
      }
    } catch {
      toast.error('Sunucu hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      className="p-2 bg-slate-800 hover:bg-red-500 rounded-lg text-slate-400 hover:text-white transition shadow-lg border border-slate-700 hover:border-red-500 disabled:opacity-50"
    >
      <Trash2 size={16} className={loading ? 'animate-pulse' : ''} />
    </button>
  );
}