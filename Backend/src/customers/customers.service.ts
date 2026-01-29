import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  // 1. YENİ MÜŞTERİ EKLE
  async create(createCustomerDto: any) {
    return this.prisma.company.create({
      data: {
        ...createCustomerDto,
        type: 'CUSTOMER', // Otomatik olarak "Müşteri" etiketi basıyoruz
      },
    });
  }

  // 2. SADECE MÜŞTERİLERİ GETİR
  async findAll() {
    return this.prisma.company.findMany({
      where: {
        type: 'CUSTOMER', // Sadece müşterileri filtrele (Tedarikçiler gelmesin)
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 3. TEK BİR MÜŞTERİ BUL
  async findOne(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
    });
  }

  // 4. GÜNCELLE
  async update(id: string, updateCustomerDto: any) {
    return this.prisma.company.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  // 5. SİL
  async remove(id: string) {
    return this.prisma.company.delete({
      where: { id },
    });
  }
}