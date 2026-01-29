// backend/src/finance/finance.module.ts
import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // 👈 DÜZELTME: 'src' yerine '..'

@Module({
  imports: [PrismaModule],
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}