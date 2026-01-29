export class CreateCustomerDto {
  name: string;
  type: string; // "CUSTOMER" veya "SUPPLIER"
  companyId: string;
}