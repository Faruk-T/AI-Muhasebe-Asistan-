// components/DeleteButton.tsx
'use client'; // Tıklama işlemi olduğu için Client Component olmak zorunda

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteButtonProps {
  id: string;
  endpoint: string; // 'companies', 'products' vb.
}

export default function DeleteButton({ id, endpoint }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    // 1. Kullanıcıya sor (Yanlışlıkla silmesin)
    const confirmed = window.confirm('Bu kaydı silmek istediğinize emin misiniz?');
    if (!confirmed) return;

    setLoading(true);

    try {
      // 2. Backend'e SİL komutu gönder
      const res = await fetch(`http://localhost:3333/${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // 3. Başarılıysa sayfayı yenile (veri kaybolsun)
        router.refresh();
      } else {
        alert('Silinemedi! Bir hata oluştu.');
      }
    } catch (error) {
      alert('Sunucu hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
      title="Sil"
    >
      <Trash2 size={18} />
    </button>
  );
}
