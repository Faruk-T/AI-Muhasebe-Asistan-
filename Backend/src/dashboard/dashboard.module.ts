// backend/src/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 👈 Burası önemli!

@Module({
  imports: [PrismaModule], // 👈 Eklemeyi unutma
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}