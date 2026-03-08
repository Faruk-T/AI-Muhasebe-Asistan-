"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Trash2, Plus, Loader2 } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      // 🚀 Port 3001 idi, 3333 yaptık:
      const res = await axios.get('http://localhost:3333/brands');
      setBrands(res.data);
    } catch (error) {
      console.error("Markalar yüklenemedi", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleAdd = async () => {
    if (!newName) return;
    try {
      // 🚀 Burayı da 3333 yapıyoruz:
      await axios.post('http://localhost:3333/brands', { name: newName });
      setNewName("");
      fetchBrands();
    } catch (error) {
      alert("Marka eklenirken hata oluştu.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu markayı silmek istediğinize emin misiniz?")) return;
    // 🚀 Ve burayı da 3333 yapıyoruz:
    await axios.delete(`http://localhost:3333/brands/${id}`);
    fetchBrands();
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Award className="text-indigo-600" size={32} /> 
            Üretici & Marka Tanıtım Kartı
          </h1>
          <p className="text-slate-500 mt-2">Ürünlerinizin marka ve üretici bilgilerini buradan yönetin.</p>
        </header>

        {/* Ekleme Formu */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex gap-4 items-center">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Marka Adı</label>
            <input 
              type="text" 
              placeholder="Örn: Apple, Samsung, Ülker..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 transition-all"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAdd}
            className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-indigo-200"
          >
            <Plus size={20} /> Ekle
          </button>
        </div>

        {/* Liste */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider">Marka Adı</th>
                <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right px-8">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={2} className="p-12 text-center text-slate-400">
                    <Loader2 className="animate-spin inline mr-2" /> Yükleniyor...
                  </td>
                </tr>
              ) : brands.map((brand) => (
                <tr key={brand.id} className="border-b border-slate-100 hover:bg-indigo-50/30 transition-colors group">
                  <td className="p-4 text-slate-700 font-bold text-lg">{brand.name}</td>
                  <td className="p-4 text-right px-8">
                    <button 
                      onClick={() => handleDelete(brand.id)}
                      className="text-slate-300 hover:text-red-500 p-2 rounded-lg transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}