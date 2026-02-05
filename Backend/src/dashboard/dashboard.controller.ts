// Backend/src/dashboard/dashboard.controller.ts
import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getSummary() {
    // BURASI DÜZELTİLDİ: getStats() yerine getSummary() çağırıyoruz
    return this.dashboardService.getSummary(); 
  }
}