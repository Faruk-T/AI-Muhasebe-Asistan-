// backend/src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // 1. YENİ ÜRÜN OLUŞTUR
  async create(createProductDto: any) {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        barcode: createProductDto.barcode,
        unit: createProductDto.unit || 'Adet',
        // Frontend'den string gelse bile Number'a çevirip garantiye alıyoruz
        buyPrice: Number(createProductDto.buyPrice || 0),
        // salePrice veya sellPrice hangisi gelirse onu al
        sellPrice: Number(createProductDto.salePrice || createProductDto.sellPrice || 0),
        stock: Number(createProductDto.stock || 0),
        criticalQty: Number(createProductDto.criticalQty || 10),
        
        // ✅ KDV (Varsayılan %20)
        vatRate: Number(createProductDto.vatRate || 20),
      },
    });
  }

  // 2. TÜM ÜRÜNLERİ GETİR
  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' }, // En yeni eklenen en üstte
    });
  }

  // 3. TEK BİR ÜRÜN GETİR
  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  // 4. ÜRÜN GÜNCELLE
  async update(id: string, updateProductDto: any) {
    // Güncelleme verilerini kopyala
    const data = { ...updateProductDto };

    // 🛠️ KRİTİK DÜZELTME: salePrice gelirse sellPrice'a çevir
    // Prisma şemasında sütun adı 'sellPrice' olduğu için 'salePrice' hata verir.
    if (data.salePrice !== undefined) {
      data.sellPrice = Number(data.salePrice);
      delete data.salePrice; // Prisma'ya göndermeden önce siliyoruz
    }

    // Sayısal alanları dönüştür
    if (data.buyPrice !== undefined) data.buyPrice = Number(data.buyPrice);
    if (data.sellPrice !== undefined) data.sellPrice = Number(data.sellPrice);
    if (data.stock !== undefined) data.stock = Number(data.stock);
    if (data.criticalQty !== undefined) data.criticalQty = Number(data.criticalQty);
    if (data.vatRate !== undefined) data.vatRate = Number(data.vatRate);

    // ID, createdAt, updatedAt gibi alanları veriden çıkaralım (Prisma bazen kızar)
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.invoiceItems; // İlişkisel alanları güncelleme verisinden çıkar
    delete data.licenseKey;   // Değiştirilmesini istemiyorsan çıkar

    return this.prisma.product.update({
      where: { id },
      data: data,
    });
  }

  // 5. ÜRÜN SİL
  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}