// backend/src/finance/finance.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Yolu '../' ile garantiye aldım

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // 1. YENİ KASA / BANKA HESABI OLUŞTUR
  async createAccount(data: any) {
    return this.prisma.financialAccount.create({
      data: {
        name: data.name,
        type: data.type, // CASH, BANK, POS
        currency: data.currency || 'TRY',
        iban: data.iban,
        balance: 0, // Yeni hesap 0 TL ile başlar
      },
    });
  }

  // 2. TÜM HESAPLARI VE BAKİYELERİ GETİR
  async findAllAccounts() {
    return this.prisma.financialAccount.findMany({
      include: { transactions: true }, // Hareketleri de getirir
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. PARA HAREKETİ EKLE (Gelir/Gider)
  // Bu fonksiyon hem hareketi kaydeder, hem kasanın bakiyesini, hem de müşterinin bakiyesini günceller!
  async addTransaction(data: any) {
    const { accountId, amount, type, description, category, companyId } = data;

    // Prisma Transaction ile işlemleri atomik yapıyoruz (Ya hepsi olur ya hiçbiri)
    return this.prisma.$transaction(async (prisma) => {
      
      // A) Hareketi Kaydet
      const transaction = await prisma.transaction.create({
        data: {
          amount: Number(amount),
          type, // INCOME veya EXPENSE
          description,
          category,
          accountId,
          companyId, // Eğer bir cariye bağlıysa ID buraya gelir
        },
      });

      // B) Kasa/Banka Bakiyesini Güncelle
      // Eğer GELİR ise kasa artar (+), GİDER ise kasa azalır (-)
      const accountOperation = type === 'INCOME' ? { increment: Number(amount) } : { decrement: Number(amount) };

      await prisma.financialAccount.update({
        where: { id: accountId },
        data: {
          balance: accountOperation,
        },
      });

      // C) ✨ KRİTİK EKLENTİ: Eğer bir MÜŞTERİ (Company) seçildiyse Bakiyesini Güncelle!
      if (companyId) {
        // Müşteriden para aldıysak (INCOME) -> Müşterinin borcu (balance) AZALIR.
        // Müşteriye ödeme yaptıysak (EXPENSE) -> Müşterinin borcu ARTAR (veya alacağı azalır).
        const companyOperation = type === 'INCOME' ? { decrement: Number(amount) } : { increment: Number(amount) };

        await prisma.company.update({
          where: { id: companyId },
          data: { balance: companyOperation }
        });
      }

      return transaction;
    });
  }

  // 4. HESAP DETAYINI VE GEÇMİŞİNİ GETİR
  async findOneAccount(id: string) {
    return this.prisma.financialAccount.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: { date: 'desc' }, // En son işlemler üstte
          take: 50, // Son 50 işlem
        },
      },
    });
  }
}