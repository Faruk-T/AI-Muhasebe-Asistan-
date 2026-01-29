// backend/src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 👈 Bu modülü Global yapıyoruz ki her yerde import etmek zorunda kalmayalım (Opsiyonel ama iyidir)
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 👈 Service'i dışarıya açıyoruz
})
export class PrismaModule {}