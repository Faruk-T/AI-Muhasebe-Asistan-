// 📄 src/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <--- İşte sihirli kelime! Artık her yerden erişilebilir.
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Dışarıya açıyoruz
})
export class PrismaModule {}