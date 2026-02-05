// Backend/src/dashboard/dashboard.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    console.log("--- DASHBOARD ANALİZİ BAŞLIYOR ---");
    console.log("Tarih Başlangıcı:", startOfMonth);

    // 1. TOPLAM KASA VARLIĞI
    const accounts = await this.prisma.financialAccount.findMany();
    const totalAsset = accounts.reduce((acc, item) => acc + Number(item.balance), 0);
    
    console.log(`Bulunan Kasa Sayısı: ${accounts.length}`);
    console.log("Kasalar:", accounts); // Kasaların içinde para var mı görelim
    console.log(`Hesaplanan Toplam Varlık: ${totalAsset}`);

    // 2. BU AYKİ SATIŞLAR (FATURALAR)
    const monthlySales = await this.prisma.invoice.aggregate({
      where: {
        type: 'SALES',
        createdAt: { gte: startOfMonth },
      },
      _sum: { totalAmount: true },
    });
    console.log("Bu ayki Satış Toplamı:", monthlySales._sum.totalAmount);

    // 3. BU AYKİ GİDERLER
    const monthlyExpenses = await this.prisma.expense.aggregate({
      where: {
        date: { gte: startOfMonth },
      },
      _sum: { amount: true },
    });
    
    // 4. BU AYKİ ALIMLAR
    const monthlyPurchases = await this.prisma.invoice.aggregate({
      where: {
        type: 'PURCHASE',
        createdAt: { gte: startOfMonth },
      },
      _sum: { totalAmount: true },
    });

    // 5. ALACAK & BORÇ HESAPLAMA
    const companies = await this.prisma.company.findMany();
    let totalReceivables = 0; 
    let totalPayables = 0;    

    companies.forEach(comp => {
        const bal = Number(comp.balance);
        if (bal > 0) {
            totalReceivables += bal; 
        } else {
            totalPayables += Math.abs(bal);
        }
    });

    console.log(`Toplam Cari Sayısı: ${companies.length}`);
    console.log(`Hesaplanan Alacak: ${totalReceivables}, Hesaplanan Borç: ${totalPayables}`);

    // 6. KRİTİK STOK
    const criticalStock = await this.prisma.product.findMany({
        where: { stock: { lte: 10 } },
        take: 5,
        orderBy: { stock: 'asc' }
    });

    // 7. SON İŞLEMLER
    const recentTransactions = await this.prisma.transaction.findMany({
        take: 5,
        orderBy: { date: 'desc' },
        include: { company: true, account: true }
    });

    const income = Number(monthlySales._sum.totalAmount || 0);
    const expense = Number(monthlyExpenses._sum.amount || 0);
    const cost = Number(monthlyPurchases._sum.totalAmount || 0);
    const netProfit = income - (expense + cost);

    return {
      totalAsset,
      monthlySales: income,
      monthlyExpenses: expense + cost,
      netProfit,
      totalReceivables,
      totalPayables,
      criticalStock: criticalStock || [],
      recentTransactions: recentTransactions || []
    };
  }
}