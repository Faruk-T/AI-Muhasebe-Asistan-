// Backend/src/settings/settings.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  // 1. AYARLARI GETİR (Varsa getir, yoksa boş obje dön)
  async getSettings() {
    const settings = await this.prisma.settings.findFirst();
    return settings || {}; 
  }

  // 2. AYARLARI KAYDET / GÜNCELLE (Upsert Mantığı)
  async updateSettings(data: any) {
    const existing = await this.prisma.settings.findFirst();

    if (existing) {
      // Varsa güncelle
      return this.prisma.settings.update({
        where: { id: existing.id },
        data: data,
      });
    } else {
      // Yoksa sıfırdan oluştur
      return this.prisma.settings.create({
        data: {
          companyName: data.companyName || 'Şirket Adı Girilmedi',
          ...data
        },
      });
    }
  }
}