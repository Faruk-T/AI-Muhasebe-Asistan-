// 📄 src/invoices/dto/create-invoice.dto.ts

// Önce Fatura Kalemi (Satır) için ufak bir sınıf tanımlıyoruz
export class InvoiceItemDto {
  productId: string; // Hangi ürün?
  quantity: number;  // Kaç tane?
  price: number;     // Birim fiyatı ne?
}

// Şimdi Ana Fatura DTO'su
export class CreateInvoiceDto {
  type: string;        // 'SALES' (Satış) veya 'PURCHASE' (Alış)
  companyId: string;   // Faturayı kesen şirket
  customerId: string;  // Faturanın kesildiği müşteri
  date?: string;       // Tarih (Opsiyonel, boşsa şimdi olur)
  
  // İşte sihirli kısım: Faturanın içindeki ürünler listesi!
  items: InvoiceItemDto[]; 
}