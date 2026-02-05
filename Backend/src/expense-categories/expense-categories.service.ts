import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';

@Injectable()
export class ExpenseCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateExpenseCategoryDto) {
    return this.prisma.expenseCategory.create({ data });
  }

  async findAll() {
    return this.prisma.expenseCategory.findMany({
      include: { _count: { select: { expenses: true } } },
      orderBy: { name: 'asc' },
    });
  }

  // 🛠️ EKSİK OLAN METOD:
  async findOne(id: string) {
    return this.prisma.expenseCategory.findUnique({ where: { id } });
  }

  // 🛠️ EKSİK OLAN METOD:
  async update(id: string, data: UpdateExpenseCategoryDto) {
    return this.prisma.expenseCategory.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.expenseCategory.delete({ where: { id } });
  }
}