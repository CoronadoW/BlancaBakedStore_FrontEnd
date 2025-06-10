import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CashBalanceDto, CashBalance } from '../models/cash-balance.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CashBalanceService {
  private apiUrl = 'http://localhost:8080/cashBalance';

  private http = inject(HttpClient);



  //Method to create CashBalance
  createCashBalance(cashBalanceDto: CashBalanceDto): Observable<CashBalance> {
    const formattedDto = {
      ...cashBalanceDto,
      date: this.formatDateForSpring(cashBalanceDto.date)
    };
    return this.http.post<CashBalance>(`${this.apiUrl}/create`, formattedDto)
  }

  //Method to get all CashBalance
  getAllCashBalance(): Observable<CashBalance[]> {
    return this.http.get<CashBalance[]>(`${this.apiUrl}/getAll`);
  }

  // Method to delete a CashBalance by id
  deleteCashBalance(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' });
  }

  getByDateAndShift(date: string, shift: string): Observable<CashBalance> {
    const formattedDate = this.formatDateForSpring(date); // Convert yyyy-MM-dd → dd-MM-yyyy
    const params = new HttpParams()
      .set('date', formattedDate)
      .set('shift', shift);
    return this.http.get<CashBalance>(`${this.apiUrl}/getByDateAndShift`, { params });
  }

  private formatDateForSpring(inputDate: string): string {
    const [yyyy, mm, dd] = inputDate.split('-');
    return `${dd}-${mm}-${yyyy}`; // Return dd-MM-yyyy format
  }

  getByDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getByDate/${date}`);
  }

  getByShift(shift: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getByShift/${shift}`);
  }

}
