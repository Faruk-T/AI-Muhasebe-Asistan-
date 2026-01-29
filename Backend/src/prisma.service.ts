// 📄 src/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Constructor yazmamıza bile gerek yok, v5 otomatik halleder.

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ SİSTEM HAZIR: Veritabanı bağlantısı başarıyla kuruldu!');
    } catch (error) {
      console.error('❌ BAĞLANTI HATASI:', error);
    }
  }
}