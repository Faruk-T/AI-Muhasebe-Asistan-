import { Controller, Get, Post, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  // 1. BACKEND ÇALIŞIYOR MU KONTROLÜ
  @Get()
  getHello(): string {
    return 'Backend Çalışıyor! 🚀';
  }

  // 🛡️ 2. LİSANS KONTROL (Giriş Yaparken Kullanılır)
  @Post('check-license')
  async checkLicense(@Body('licenseKey') key: string) {
    // Veritabanında anahtarı bul
    const license = await this.prisma.license.findUnique({
      where: { key: key },
    });

    // Anahtar yoksa?
    if (!license) {
      throw new HttpException('Geçersiz Lisans Anahtarı!', HttpStatus.UNAUTHORIZED);
    }

    // Pasif edilmiş mi?
    if (!license.isActive) {
      throw new HttpException('Bu lisans iptal edilmiştir. Satıcı ile görüşün.', HttpStatus.FORBIDDEN);
    }

    // ⏳ Süresi dolmuş mu?
    if (license.expiresAt && new Date() > new Date(license.expiresAt)) {
      const dateStr = new Date(license.expiresAt).toLocaleDateString('tr-TR');
      throw new HttpException(`Lisans süreniz ${dateStr} tarihinde doldu! Yenilemek için ödeme yapınız.`, HttpStatus.PAYMENT_REQUIRED);
    }

    // Her şey yolundaysa onayı ver
    return { 
      success: true, 
      owner: license.owner, 
      message: `Hoşgeldin ${license.owner}! Lisansın Aktif.` 
    };
  }

  // 📋 3. TÜM LİSANSLARI GETİR (Yönetim Paneli İçin)
  @Get('licenses')
  async getLicenses() {
    return this.prisma.license.findMany({
      orderBy: { createdAt: 'desc' } // En yeni eklenen en üstte
    });
  }

  // ➕ 4. YENİ LİSANS OLUŞTUR
  @Post('licenses')
  async createLicense(@Body() data: any) {
    // Aynı anahtar var mı diye kontrol etmeye gerek yok, Prisma hata verir zaten.
    return this.prisma.license.create({
      data: {
        key: data.key,
        owner: data.owner,
        isActive: true,
        // Eğer tarih seçilmediyse null yap (Süresiz olur)
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      }
    });
  }

  // 🗑️ 5. LİSANS SİL
  @Delete('licenses/:id')
  async deleteLicense(@Param('id') id: string) {
    return this.prisma.license.delete({
      where: { id },
    });
  }
}