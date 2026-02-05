import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// 1. Diziye girecek verilerin şablonunu (Interface) oluşturuyoruz
interface CalculatedItem {
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  // 🚀 AKILLI FATURA (KDV Hesaplamalı + Peşin Ödeme Desteği)
  async create(createInvoiceDto: any) {
    const { companyId, items, type, isPaid, accountId } = createInvoiceDto; 

    let totalAmount = 0; // Genel Toplam (KDV Dahil)

    return this.prisma.$transaction(async (prisma) => {
      
      // 2. ÜRÜNLERİ VE KDV'LERİ HESAPLA
      // BURADAKİ DEĞİŞİKLİK: Dizinin tipini 'CalculatedItem[]' olarak belirttik.
      // Artık TypeScript bu dizinin içinde productId, quantity vb. olacağını biliyor.
      const calculatedItems: CalculatedItem[] = [];

      for (const item of items) {
        // Veritabanından güncel ürün bilgisini (fiyat ve KDV oranı için) çekiyoruz
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new BadRequestException(`Ürün bulunamadı: ${item.productId}`);

        const quantity = Number(item.quantity);
        const price = Number(item.price); // Faturadaki birim fiyat
        const vatRate = Number(product.vatRate || 0); // Ürünün kayıtlı KDV oranı (%1, %10, %20 vb.)
        
        // Ara Toplam = Miktar * Birim Fiyat
        const lineTotal = quantity * price;
        // Satır KDV Tutarı = Ara Toplam * (KDV Oranı / 100)
        const taxAmount = lineTotal * (vatRate / 100);
        // Satır Genel Toplamı (KDV Dahil)
        const lineGrandTotal = lineTotal + taxAmount;

        totalAmount += lineGrandTotal;

        // Artık .push işlemi hata vermeyecek
        calculatedItems.push({
          productId: item.productId,
          quantity: quantity,
          price: price,
          total: lineGrandTotal // Fatura satırına KDV dahil toplamı yazıyoruz
        });
      }

      // 3. FATURAYI KAYDET
      const invoice = await prisma.invoice.create({
        data: {
          companyId,
          totalAmount, // KDV Dahil Genel Toplam
          type: type || 'SALES',
          status: isPaid ? 'PAID' : 'PENDING',
          items: {
            create: calculatedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            })),
          },
        },
      });

      // 4. STOK HAREKETLERİ
      // calculatedItems artık tipli olduğu için döngüde hata almazsın
      for (const item of calculatedItems) {
        const stockOperation = type === 'PURCHASE' 
            ? { increment: Number(item.quantity) } 
            : { decrement: Number(item.quantity) };

        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: stockOperation },
        });
      }

      // 5. CARİ BAKİYE GÜNCELLEME (KDV Dahil Tutar Üzerinden)
      const balanceOperation = type === 'PURCHASE' 
          ? { decrement: totalAmount } 
          : { increment: totalAmount };

      await prisma.company.update({
        where: { id: companyId },
        data: { balance: balanceOperation },
      });

      // 6. 💰 PEŞİN ÖDEME İŞLEMLERİ
      if (isPaid && accountId) {
        const account = await prisma.financialAccount.findUnique({ where: { id: accountId } });
        if (!account) throw new BadRequestException('Seçilen kasa/banka bulunamadı!');

        const transactionType = type === 'PURCHASE' ? 'EXPENSE' : 'INCOME';

        // Finansal Hareketi Kaydet
        await prisma.transaction.create({
          data: {
            amount: totalAmount,
            type: transactionType,
            description: `Fatura #${invoice.id.substring(0,6)} Peşin Ödemesi (KDV Dahil)`,
            category: type === 'PURCHASE' ? 'Satın Alma' : 'Satış',
            accountId: accountId,
            companyId: companyId,
            date: new Date(),
          }
        });

        // Kasa Bakiyesini Güncelle
        const accountUpdate = transactionType === 'INCOME'
            ? { increment: totalAmount }
            : { decrement: totalAmount };
            
        await prisma.financialAccount.update({
            where: { id: accountId },
            data: { balance: accountUpdate }
        });

        // Cari Bakiyeyi Kapat (Ödeme yapıldığı için dengele)
        const companyBalanceCorrection = type === 'PURCHASE'
            ? { increment: totalAmount }
            : { decrement: totalAmount };

        await prisma.company.update({
            where: { id: companyId },
            data: { balance: companyBalanceCorrection }
        });
      }

      return invoice;
    });
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      include: { company: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { company: true, items: { include: { product: true } } },
    });
  }
    
  async remove(id: string) {
      return this.prisma.invoice.delete({ where: { id } });
  }

  async updateStatus(id: string, status: string) {
      return this.prisma.invoice.update({ where: { id }, data: { status } });
  }
}