import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Tip güvenliği için kalem yapısını tanımlıyoruz
interface CalculatedItem {
  productId: string;
  quantity: number;
  price: number;
  vatRate: number;
  total: number;
}

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  // 🚀 TEKLİF OLUŞTURMA
  async create(createOfferDto: any) {
    const { companyId, customerId, items, validUntil, note, currency } = createOfferDto;

    if (!companyId && !customerId) {
      throw new BadRequestException('Teklif için bir şirket veya müşteri seçilmelidir.');
    }

    let totalAmount = 0;

    return this.prisma.$transaction(async (prisma) => {
      const calculatedItems: CalculatedItem[] = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new BadRequestException(`Ürün bulunamadı: ${item.productId}`);
        }

        const quantity = Number(item.quantity);
        const price = item.price ? Number(item.price) : Number(product.sellPrice);
        const vatRate = Number(item.vatRate || product.vatRate || 20);

        const lineSubTotal = quantity * price;
        const taxAmount = lineSubTotal * (vatRate / 100);
        const lineTotal = lineSubTotal + taxAmount;

        totalAmount += lineTotal;

        calculatedItems.push({
          productId: item.productId,
          quantity: quantity,
          price: price,
          vatRate: vatRate,
          total: lineTotal,
        });
      }

      const offer = await prisma.offer.create({
        data: {
          companyId,
          customerId,
          totalAmount,
          currency: currency || 'TRY',
          status: 'DRAFT',
          validUntil: validUntil ? new Date(validUntil) : null,
          note,
          items: {
            create: calculatedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              vatRate: item.vatRate,
              total: item.total,
            })),
          },
        },
        include: {
          items: true,
          company: true,
          customer: true,
        },
      });

      return offer;
    });
  }

  // 🔄 TEKLİFİ FATURAYA DÖNÜŞTÜR (Mikro/Logo Mantığı)
  async convertToInvoice(id: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!offer) throw new NotFoundException('Dönüştürülecek teklif bulunamadı.');
    if (offer.status === 'CONVERTED') throw new BadRequestException('Bu teklif zaten faturalandırılmış.');

    return this.prisma.$transaction(async (prisma) => {
      
      // 1. Faturayı Oluştur
      const invoice = await prisma.invoice.create({
        data: {
          type: 'SALES',
          companyId: offer.companyId,
          customerId: offer.customerId,
          totalAmount: offer.totalAmount,
          status: 'PENDING',
          items: {
            create: offer.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            })),
          },
        },
      });

      // 2. Stokları Düş (Teklif kabul edildi ve ürünler çıkıyor)
      for (const item of offer.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 3. Şirket/Cari Bakiyeyi Güncelle (Müşteri borçlandırılıyor)
      if (offer.companyId) {
        await prisma.company.update({
          where: { id: offer.companyId },
          data: { balance: { increment: offer.totalAmount } },
        });
      }

      // 4. Teklif Durumunu Kapat
      await prisma.offer.update({
        where: { id },
        data: { status: 'CONVERTED' },
      });

      return invoice;
    });
  }

  // TÜM TEKLİFLERİ LİSTELE
  async findAll() {
    return this.prisma.offer.findMany({
      include: { company: true, customer: true, items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // TEK TEKLİF GETİR
  async findOne(id: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      include: { 
        company: true, 
        customer: true, 
        items: { include: { product: true } } 
      },
    });
    if (!offer) throw new NotFoundException('Teklif bulunamadı.');
    return offer;
  }

  // DURUM GÜNCELLE
  async updateStatus(id: string, status: string) {
    return this.prisma.offer.update({
      where: { id },
      data: { status },
    });
  }

  // SİL
  async remove(id: string) {
    return this.prisma.offer.delete({ where: { id } });
  }
}