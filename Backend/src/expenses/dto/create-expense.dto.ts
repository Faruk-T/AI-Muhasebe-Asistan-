export class CreateExpenseDto {
  description: string;
  amount: number | string; // Frontend'den bazen string gelebilir
  categoryId: string;
  accountId: string;
  date?: string | Date; // Tarih opsiyonel olabilir
}