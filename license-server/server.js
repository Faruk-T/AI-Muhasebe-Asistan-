// license-server/server.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 4000; // Bu sunucu 4000 portunda çalışacak!

app.use(cors());
app.use(express.json());

// 1. LİSANS KONTROL (Müşteri Programı Buraya Soracak)
app.post('/verify', async (req, res) => {
  const { key } = req.body;
  
  try {
    const license = await prisma.license.findUnique({ where: { key } });

    if (!license) {
      return res.status(401).json({ valid: false, message: 'Geçersiz Lisans Anahtarı!' });
    }

    if (!license.isActive) {
      return res.status(403).json({ valid: false, message: 'Lisansınız iptal edilmiştir.' });
    }

    if (license.expiresAt && new Date() > new Date(license.expiresAt)) {
      return res.status(402).json({ valid: false, message: 'Lisans süreniz doldu! Yenileyin.' });
    }

    // Her şey yolunda
    res.json({ 
      valid: true, 
      owner: license.owner, 
      expiresAt: license.expiresAt, 
      message: 'Giriş Başarılı' 
    });

  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// 2. LİSANS OLUŞTUR (Senin Yönetim Panelin İçin)
app.post('/create', async (req, res) => {
  const { key, owner, expiresAt } = req.body;
  try {
    const newLicense = await prisma.license.create({
      data: {
        key,
        owner,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });
    res.json(newLicense);
  } catch (error) {
    res.status(400).json({ error: 'Anahtar zaten var veya hata oluştu.' });
  }
});

// 3. TÜM LİSANSLARI GÖR
app.get('/list', async (req, res) => {
  const licenses = await prisma.license.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(licenses);
});

// ---------------------------------------------------------
// 👇 YENİ EKLENEN BÖLÜMLER (Patron Yetkileri) 👇
// ---------------------------------------------------------

// 4. LİSANS DURUMUNU DEĞİŞTİR (Aktif/Pasif Yap)
app.post('/toggle/:id', async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body; // Frontend'den true veya false gelecek
  
  try {
    const updated = await prisma.license.update({
      where: { id },
      data: { isActive },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Güncellenemedi' });
  }
});

// 5. LİSANSI SİL (Veritabanından Tamamen Uçur)
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.license.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Silinemedi' });
  }
});
app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { expiresAt, owner } = req.body; // Yeni tarih ve isim gelecek
  
  try {
    const updated = await prisma.license.update({
      where: { id },
      data: { 
        expiresAt: expiresAt ? new Date(expiresAt) : null, // Tarih varsa güncelle, yoksa elleme
        owner: owner // İsmi de değiştirebilirsin
      },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Güncellenemedi' });
  }
});

// ---------------------------------------------------------

app.listen(PORT, () => {
  console.log(`👑 LİSANS MERKEZİ ÇALIŞIYOR: http://localhost:${PORT}`);
});