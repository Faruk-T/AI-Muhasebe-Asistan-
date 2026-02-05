// Backend/src/settings/settings.module.ts
import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 👈 Eklendi

@Module({
  imports: [PrismaModule], // 👈 Import dizisine ekle
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}