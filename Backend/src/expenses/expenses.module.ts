import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 👈 Eklemeyi unutma

@Module({
  imports: [PrismaModule], // 👈 Buraya ekle
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}