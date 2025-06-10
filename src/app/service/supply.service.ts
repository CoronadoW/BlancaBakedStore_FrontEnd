import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Supply } from '../models/supply.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplyService {
  //constructor() { }

  private apiUrl = 'http://localhost:8080/supply';

  private http = inject(HttpClient);

  //Method to get all Supplies
  getAllSupplies(): Observable<Supply[]> {
    return this.http.get<Supply[]>(`${this.apiUrl}/getAll`);
  }

  getSupplyByName(supplyName: string): Observable<Supply> {
    return this.http.get<Supply>(`${this.apiUrl}/getSupplyBySupplyName/${supplyName}`);
  }

  createSupply(supply: Supply): Observable<Supply> {
    const formatedBuyDate = this.formatDateForSpring(supply.buyDate);
    const formatedExpDate = this.formatDateForSpring(supply.expireDate);

    const supplyDto = {
      ...supply,
      buyDate: formatedBuyDate,
      expireDate: formatedExpDate
    };
    return this.http.post<Supply>(`${this.apiUrl}/create`, supplyDto);
  }

  private formatDateForSpring(inputDate: string): string {
    const [yyyy, mm, dd] = inputDate.split('-');
    return `${dd}-${mm}-${yyyy}`; // Return dd-MM-yyyy format
  }
}
