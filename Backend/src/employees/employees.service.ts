import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmployeesService {
  private readonly dbPath = path.join(process.cwd(), 'data.json');

  private readData() {
    try {
      if (!fs.existsSync(this.dbPath)) {
        fs.writeFileSync(this.dbPath, JSON.stringify({ companies: [], employees: [], products: [], invoices: [] }));
        return { employees: [] };
      }
      const fileData = fs.readFileSync(this.dbPath, 'utf-8');
      return JSON.parse(fileData);
    } catch (error) {
      return { employees: [] };
    }
  }

  private writeData(data: any) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new InternalServerErrorException('Veri kaydedilemedi');
    }
  }

  findAll() {
    const data = this.readData();
    return data.employees || [];
  }

  create(createEmployeeDto: any) {
    const data = this.readData();
    const newEmployee = {
      id: Date.now().toString(),
      ...createEmployeeDto,
      createdAt: new Date().toISOString(),
    };

    if (!data.employees) data.employees = [];
    data.employees.push(newEmployee);
    this.writeData(data);

    return newEmployee;
  }

  findOne(id: string) {
    const data = this.readData();
    const employee = data.employees?.find((e: any) => e.id === id);
    if (!employee) throw new NotFoundException('Personel bulunamadı');
    return employee;
  }

  update(id: string, updateEmployeeDto: any) {
    const data = this.readData();
    if (!data.employees) return null;
    
    const index = data.employees.findIndex((e: any) => e.id === id);
    if (index === -1) throw new NotFoundException('Personel bulunamadı');

    data.employees[index] = { ...data.employees[index], ...updateEmployeeDto };
    this.writeData(data);
    return data.employees[index];
  }

  remove(id: string) {
    const data = this.readData();
    if (!data.employees) return { success: false };
    
    const initialLength = data.employees.length;
    data.employees = data.employees.filter((e: any) => e.id !== id);
    
    if (data.employees.length === initialLength) {
        throw new NotFoundException('Silinecek personel bulunamadı');
    }

    this.writeData(data);
    return { success: true };
  }
}