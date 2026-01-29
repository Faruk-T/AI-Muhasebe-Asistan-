import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from '../prisma/prisma.service'; // <--- EKLENDİ

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService], // <--- EKLENDİ
})
export class TransactionsModule {}