"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FolderPlus, Trash2, FolderTree, Loader2 } from 'lucide-react';

// 🏷️ TypeScript için Kategori Tipini Tanımlayalım (Hataları çözen kısım)
interface Category {
  id: string;
  name: string;
}

export default function CategoriesPage() {
  // useState'i <Category[]> tipiyle tanımlıyoruz ki 'never' hatası gitsin
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  // Kategorileri Getir
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3333/categories');
      setCategories(res.data);
    } catch (error) {
      console.error("Kategoriler yüklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Yeni Grup Ekle
  const handleAdd = async () => {
    if (!newName) return;
    try {
      await axios.post('http://localhost:3333/categories', { name: newName });
      setNewName("");
      fetchCategories();
    } catch (error) {
      alert("Kategori eklenemedi. Backend'in çalıştığından emin olun.");
    }
  };

  // Silme İşlemi
  const handleDelete = async (id: string) => {
    if (!confirm("Bu grubu silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`http://localhost:3333/categories/${id}`);
      fetchCategories();
    } catch (error) {
      alert("Silme işlemi başarısız.");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <FolderTree className="text-indigo-600" size={32} /> 
            Stok Ana/Alt Grup Tanımları
          </h1>
          <p className="text-slate-500 mt-2">Ürünlerinizi gruplandırmak için ana ve alt kategorileri buradan yönetin.</p>
        </header>

        {/* Ekleme Formu */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex gap-4 items-center">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Yeni Grup Adı</label>
            <input 
              type="text" 
              placeholder="Örn: Elektronik, Gıda, Yedek Parça..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 transition-all"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAdd}
            className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-indigo-200"
          >
            <FolderPlus size={20} /> Kaydet
          </button>
        </div>

        {/* Liste */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider text-center w-16">#</th>
                <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider">Grup Adı</th>
                <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right px-8">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-slate-400 font-medium text-sm">
                    <Loader2 className="animate-spin inline mr-2 text-indigo-600" /> Veriler yükleniyor...
                  </td>
                </tr>
              ) : categories.map((cat, index) => (
                <tr key={cat.id} className="border-b border-slate-100 hover:bg-indigo-50/30 transition-colors group">
                  <td className="p-4 text-slate-400 text-sm font-bold text-center">{index + 1}</td>
                  <td className="p-4 text-slate-700 font-bold text-lg">{cat.name}</td>
                  <td className="p-4 text-right px-8">
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="text-slate-300 hover:text-red-500 p-2 rounded-lg transition-all hover:bg-red-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-slate-400 italic">
                    Henüz bir stok grubu tanımlanmamış. İlk grubu yukarıdan ekleyin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}