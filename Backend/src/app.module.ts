// 📄 src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { CustomersModule } from './customers/customers.module';
import { CompaniesModule } from './companies/companies.module';
import { EmployeesModule } from './employees/employees.module';
import { ProductsModule } from './products/products.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PrismaService } from './prisma/prisma.service';
import { TransactionsModule } from './transactions/transactions.module';
import { FinanceModule } from './finance/finance.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SettingsModule } from './settings/settings.module';
import { ExpenseCategoriesModule } from './expense-categories/expense-categories.module';
import { ExpensesModule } from './expenses/expenses.module';
import { OffersModule } from './offers/offers.module';

@Module({
  imports: [
    PrismaModule,     // Veritabanı (Global)
    CustomersModule,  // Müşteriler
    CompaniesModule, EmployeesModule, ProductsModule, InvoicesModule, TransactionsModule, FinanceModule, DashboardModule, SettingsModule, ExpenseCategoriesModule, ExpensesModule, OffersModule,  // Şirketler (Sadece 1 kere yazılmalı!)
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}