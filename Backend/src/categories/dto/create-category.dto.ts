export class CreateCategoryDto {
  name: string;
  parentId?: string; // İleride alt kategori eklemek istersen lazım olur
}