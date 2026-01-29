import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PrismaService } from '../prisma/prisma.service'; // <--- EKLENDİ

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, PrismaService], // <--- EKLENDİ
})
export class CustomersModule {}