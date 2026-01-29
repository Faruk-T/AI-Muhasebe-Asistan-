// backend/src/finance/finance.controller.ts
import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // Kasa Oluştur
  @Post('accounts') 
  createAccount(@Body() body: any) {
    return this.financeService.createAccount(body);
  }

  // Tüm Hesapları Gör
  @Get('accounts')
  findAllAccounts() {
    return this.financeService.findAllAccounts();
  }

  // Hesap Detayı ve Geçmişi Gör
  @Get('accounts/:id')
  findOneAccount(@Param('id') id: string) {
    return this.financeService.findOneAccount(id);
  }

  // Para Hareketi Ekle (Gelir/Gider)
  @Post('transactions')
  addTransaction(@Body() body: any) {
    return this.financeService.addTransaction(body);
  }
}