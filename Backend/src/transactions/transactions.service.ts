import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  // 1. YENİ İŞLEM EKLE (VE BAKİYEYİ GÜNCELLE!)
  async create(createTransactionDto: any) {
    const { companyId, type, amount, description } = createTransactionDto;

    return this.prisma.$transaction(async (prisma) => {
      // A. Hareketi Kaydet
      const transaction = await prisma.transaction.create({
        data: {
          companyId,
          type, // INCOME (Tahsilat) veya EXPENSE (Ödeme)
          amount: Number(amount),
          description,
        },
      });

      // B. Cari Bakiyeyi Güncelle (İŞTE SİHİR BURADA ✨)
      // Tahsilat (INCOME) ise adamın borcu AZALIR (decrement)
      // Ödeme (EXPENSE) ise (biz ödediysek) borcumuz varsa düşer veya alacağımız artar.
      // Basit mantık: INCOME -> Eksi, EXPENSE -> Artı
      
      if (type === 'INCOME') {
        // Tahsilat yaptık, adamın borcunu düşür
        await prisma.company.update({
          where: { id: companyId },
          data: { balance: { decrement: Number(amount) } },
        });
      } else {
        // Ödeme yaptık, adama borç verdik veya borcumuzu ödedik (Bakiye artar/düzelir)
        await prisma.company.update({
          where: { id: companyId },
          data: { balance: { increment: Number(amount) } },
        });
      }

      return transaction;
    });
  }

  // 2. TÜM HAREKETLERİ GETİR
  async findAll() {
    const transactions = await this.prisma.transaction.findMany({
      include: { company: true },
      orderBy: { date: 'desc' },
    });
    return transactions.map((t) => ({ ...t, amount: Number(t.amount) }));
  }

  // 3. TEKİL SİLME (Silince bakiyeyi düzeltmek gerekir ama şimdilik basit tutalım)
  async remove(id: string) {
    return this.prisma.transaction.delete({ where: { id } });
  }
}