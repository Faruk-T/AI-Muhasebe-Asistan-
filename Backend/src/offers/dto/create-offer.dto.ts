import { IsString, IsArray, IsOptional, IsDateString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOfferDto {
  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  @IsOptional()
  validUntil?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsArray()
  @IsNotEmpty()
  items: OfferItemDto[];
}

class OfferItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  vatRate?: number;
}