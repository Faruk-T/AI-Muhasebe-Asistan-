import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  // 💸 YENİ GİDER KAYDET (Kasa Bakiyesini Düşürür)
  async create(createExpenseDto: any) {
    const { description, amount, categoryId, accountId, date } = createExpenseDto;

    return this.prisma.$transaction(async (prisma) => {
      const account = await prisma.financialAccount.findUnique({ 
        where: { id: accountId } 
      });

      if (!account) {
        throw new BadRequestException('Ödeme yapılacak kasa/banka bulunamadı.');
      }

      const expense = await prisma.expense.create({
        data: {
          description,
          amount: Number(amount),
          categoryId,
          accountId,
          date: date ? new Date(date) : new Date(),
        },
      });

      await prisma.financialAccount.update({
        where: { id: accountId },
        data: { balance: { decrement: Number(amount) } },
      });

      return expense;
    });
  }

  async findAll() {
    return this.prisma.expense.findMany({
      include: { 
        category: true, 
        account: true 
      },
      orderBy: { date: 'desc' },
    });
  }

  // 🛠️ EKSİK OLAN METOD
  async findOne(id: string) {
    return this.prisma.expense.findUnique({
      where: { id },
      include: { category: true, account: true }
    });
  }

  // 🛠️ EKSİK OLAN METOD (Güncelleme biraz risklidir, şimdilik sadece metinleri güncelletelim)
  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    // Bakiyeyi etkileyecek güncellemeler (Tutar değişimi gibi) karmaşık olduğu için
    // şimdilik sadece basit alanları güncelleyelim.
    return this.prisma.expense.update({
      where: { id },
      data: {
        description: updateExpenseDto.description,
        // Tarih ve Kategori güncellenebilir
        date: updateExpenseDto.date ? new Date(updateExpenseDto.date) : undefined,
      }
    });
  }

  async remove(id: string) {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    
    if (!expense) {
      throw new BadRequestException('Gider bulunamadı.');
    }

    return this.prisma.$transaction(async (prisma) => {
      await prisma.financialAccount.update({
        where: { id: expense.accountId },
        data: { balance: { increment: expense.amount } },
      });

      return prisma.expense.delete({ where: { id } });
    });
  }
}