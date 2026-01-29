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
        // Frontend'den string gelse bile Number'a çevirip garantiye alıyoruz
        buyPrice: Number(createProductDto.buyPrice),
        sellPrice: Number(createProductDto.salePrice),
        stock: Number(createProductDto.stock),
        criticalQty: Number(createProductDto.criticalQty || 10),
        
        // ✅ İŞTE KDV BURADA (Varsayılan %20)
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
    // Güncelleme verilerini hazırla ve sayısal alanları kontrol et
    const data: any = { ...updateProductDto };

    if (data.buyPrice) data.buyPrice = Number(data.buyPrice);
    if (data.salePrice) data.salePrice = Number(data.salePrice);
    if (data.stock) data.stock = Number(data.stock);
    if (data.criticalQty) data.criticalQty = Number(data.criticalQty);
    if (data.vatRate) data.vatRate = Number(data.vatRate);

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