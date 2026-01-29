import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  // 1. TÜMÜNÜ GETİR
  async findAll() {
    // Veritabanından tüm şirketleri getir, en yeni eklenen en üstte olsun
    return this.prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // 2. YENİ EKLE
  async create(createCompanyDto: any) {
    // Veritabanına yeni kayıt aç
    // DTO'dan gelen verileri (name, taxNumber vb.) direkt tabloya yazıyoruz
    return this.prisma.company.create({
      data: createCompanyDto,
    });
  }

  // 3. TEK BİR TANESİNİ BUL
  // TEK BİR ŞİRKETİ GETİR (Faturaları ve Hareketleriyle)
  async findOne(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        invoices: { orderBy: { date: 'desc' } },     // Faturalarını getir
        transactions: { orderBy: { date: 'desc' } }, // Ödemelerini getir
      },
    });
  }

  // 4. GÜNCELLE
  async update(id: string, updateCompanyDto: any) {
    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  // 5. SİL
  async remove(id: string) {
    return this.prisma.company.delete({
      where: { id },
    });
  }
}