// backend/src/invoices/invoices.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  // 1. YENİ FATURA OLUŞTUR
  async create(createInvoiceDto: any) {
    const { companyId, items } = createInvoiceDto;

    let totalAmount = 0;
    const invoiceItems = items.map((item: any) => {
      const lineTotal = item.quantity * item.price;
      totalAmount += lineTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: lineTotal,
      };
    });

    return this.prisma.$transaction(async (prisma) => {
      const invoice = await prisma.invoice.create({
        data: {
          companyId,
          totalAmount,
          status: 'PENDING', // İlk oluşurken Bekliyor olsun
          items: {
            create: invoiceItems,
          },
        },
        include: { items: true },
      });

      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await prisma.company.update({
        where: { id: companyId },
        data: { balance: { increment: totalAmount } },
      });

      return invoice;
    });
  }

  // 2. TÜM FATURALARI GETİR
  async findAll() {
    return this.prisma.invoice.findMany({
      include: { company: true },
      orderBy: { date: 'desc' },
    });
  }

  // 3. TEK FATURA GETİR
  async findOne(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: {
        company: true,
        items: { include: { product: true } },
      },
    });
  }

  // 4. DURUM GÜNCELLE (YENİ ÖZELLİK ✨)
  async updateStatus(id: string, status: string) {
    return this.prisma.invoice.update({
      where: { id },
      data: { status },
    });
  }

  // 5. SİL
  async remove(id: string) {
    return this.prisma.invoice.delete({
      where: { id },
    });
  }
}