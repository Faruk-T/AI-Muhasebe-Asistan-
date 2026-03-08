import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // 📦 1. YENİ ÜRÜN OLUŞTUR (Gelişmiş Barkod & Stok Yönetimi)
  async create(dto: any) {
    return this.prisma.product.create({
      data: {
        code: dto.code || null,
        name: dto.name,
        barcode: dto.barcode || null, // 🚀 Ana Barkod Alanı
        unit: dto.unit || 'Adet',
        buyPrice: Number(dto.buyPrice || 0),
        sellPrice: Number(dto.sellPrice || 0),
        stock: Number(dto.stock || 0), // 🚀 Stok Girişi Garantiye Alındı
        vatRate: Number(dto.vatRate || 20),
        criticalQty: Number(dto.criticalQty || 10),
        shelfAddress: dto.shelfAddress || null,
        
        // Gruplama
        categoryId: dto.categoryId || null,
        brandId: dto.brandId || null,

        // Muhasebe Entegrasyonu
        accountStockCode: dto.accountStockCode || '153.01',
        accountSalesCode: dto.accountSalesCode || '600.01',
        accountCostCode: dto.accountCostCode || '621.01',

        // 🏷️ 011500 - Barkod Tanıtım Kartı İçin Otomatik İlk Kayıt
        barcodes: dto.barcode ? {
          create: [{ code: dto.barcode, type: 'Varsayılan' }]
        } : undefined
      },
      include: { barcodes: true, category: true, brand: true }
    });
  }

  // 🔍 2. TÜMÜNÜ GETİR
  async findAll() {
    return this.prisma.product.findMany({
      include: { category: true, brand: true, barcodes: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 🔎 3. TEK ÜRÜN GETİR
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, brand: true, barcodes: true }
    });
    if (!product) throw new NotFoundException('Ürün bulunamadı');
    return product;
  }

  // ⚙️ 4. GÜNCELLE
  async update(id: string, dto: any) {
    const { id: _, createdAt, updatedAt, category, brand, barcodes, ...cleanData } = dto;

    // Sayısal alan dönüşümleri
    const numericFields = ['buyPrice', 'sellPrice', 'stock', 'criticalQty', 'vatRate'];
    numericFields.forEach(field => {
      if (cleanData[field] !== undefined) cleanData[field] = Number(cleanData[field]);
    });

    return this.prisma.product.update({
      where: { id },
      data: {
        ...cleanData,
        // Barkod güncellenirse ana tablo alanını güncelle
        barcode: cleanData.barcode || undefined,
      }
    });
  }

  // 🗑️ 5. SİL
  async remove(id: string) {
    try {
      const exists = await this.prisma.product.findUnique({ where: { id } });
      if (!exists) return { success: false, message: 'Ürün bulunamadı.' };
      await this.prisma.product.delete({ where: { id } });
      return { success: true };
    } catch (e) {
      return { success: false, error: "Silinemedi." };
    }
  }
}