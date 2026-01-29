import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { PrismaService } from '../prisma/prisma.service'; // <--- EKLENDİ

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, PrismaService], // <--- EKLENDİ
})
export class CompaniesModule {}