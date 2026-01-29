// backend/src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    // 1. TOPLAM KASA VARLIĞI (Tüm hesaplardaki paraların toplamı)
    const totalCash = await this.prisma.financialAccount.aggregate({
      _sum: { balance: true },
    });

    // 2. TOPLAM ALACAK (Müşterilerin bize borcu)
    const totalReceivables = await this.prisma.company.aggregate({
      where: { type: 'CUSTOMER', balance: { gt: 0 } }, // Bakiyesi 0'dan büyük olan müşteriler
      _sum: { balance: true },
    });

    // 3. TOPLAM BORÇ (Tedarikçilere borcumuz - Opsiyonel)
    const totalPayables = await this.prisma.company.aggregate({
      where: { type: 'SUPPLIER', balance: { lt: 0 } }, // Bakiyesi 0'dan küçük olanlar (Biz borçluyuz)
      _sum: { balance: true },
    });

    // 4. 👷‍♂️ AYLIK PERSONEL GİDERİ (Maaş Yükü)
    const totalSalaries = await this.prisma.employee.aggregate({
      _sum: { salary: true },
    });

    // 5. KRİTİK STOK UYARILARI (Stok < Kritik Miktar olanlar)
    const allProducts = await this.prisma.product.findMany({
      select: { id: true, name: true, stock: true, criticalQty: true, unit: true },
    });
    
    const lowStockProducts = allProducts.filter(p => p.stock <= p.criticalQty);

    // 6. SON 5 İŞLEM (Hızlı Bakış)
    const recentTransactions = await this.prisma.transaction.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: { account: true }, // Hangi hesaptan olduğunu görelim
    });

    // Hepsini tek bir obje olarak döndür
    return {
      totalCash: totalCash._sum.balance || 0,
      totalReceivables: totalReceivables._sum.balance || 0,
      totalPayables: Math.abs(Number(totalPayables._sum.balance || 0)), // Eksiyi artı gösterelim
      
      // 👇 DÜZELTME BURADA: Decimal'i Number'a çevirdik
      monthlyEmployeeCost: Number(totalSalaries._sum.salary) || 0, 
      
      lowStockCount: lowStockProducts.length,
      lowStockItems: lowStockProducts.slice(0, 5), // Sadece ilk 5 tanesini gösterelim
      recentTransactions,
    };
  }
}