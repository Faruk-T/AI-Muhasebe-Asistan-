import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // 1. YENİ İŞLEM EKLE
  @Post()
  create(@Body() createTransactionDto: any) {
    return this.transactionsService.create(createTransactionDto);
  }

  // 2. TÜMÜNÜ GETİR
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  // 3. SİL (DİKKAT: '+id' yerine sadece 'id' kullanıyoruz çünkü UUID bir stringdir)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
}