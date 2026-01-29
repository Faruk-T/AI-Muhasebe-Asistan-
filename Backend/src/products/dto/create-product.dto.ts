// 📄 src/products/dto/create-product.dto.ts
export class CreateProductDto {
  name: string;      // Ürün Adı
  stock: number;     // Stok Adedi
  buyPrice: number;  // Alış Fiyatı
  sellPrice: number; // Satış Fiyatı
  companyId: string; // Hangi şirketin ürünü?
}