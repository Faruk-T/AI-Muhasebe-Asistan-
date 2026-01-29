// 📄 src/employees/dto/create-employee.dto.ts
export class CreateEmployeeDto {
  firstName:  string;
  lastName:   string;
  phone?:     string; // ? işareti opsiyonel demek
  email?:     string;
  department: string;
  position:   string;
  salary:     number; // Decimal veritabanında sayı olarak tutulur
  companyId:  string; // Hangi şirketin personeli?
}