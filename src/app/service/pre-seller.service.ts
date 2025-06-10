import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PreSeller, PreSellerDto } from '../models/pre-seller.model';
import { Purchase, PurchaseDto } from '../models/purchase.model';

@Injectable({
  providedIn: 'root'
})
export class PreSellerService {

  private apiUrl = 'http://localhost:8080/preSeller';
  private http = inject(HttpClient);

  //Method to create PreSeller
  createPreSeller(preSellerDto: PreSellerDto): Observable<PreSeller> {
    return this.http.post<PreSeller>(`${this.apiUrl}/create`, preSellerDto);
  }

  //Method to get all paginated preSellers
  getAllPreSellers(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllPaginated?page=${page}&size=${size}&sortBy=preSellerName`);
  }

  //Method to get all preSellers
  getAllPresellers(): Observable<any[]> {
    return this.http.get<PreSeller[]>(`${this.apiUrl}/getAll`);
  }

  //Method to get preSeller by its preSellerName
  getPreSellerByName(preSellerName: string): Observable<PreSeller> {
    return this.http.get<PreSeller>(`${this.apiUrl}/get/${preSellerName}`);
  }


  //Method to get purchase list from preSeller
  getPurchaseListbyPreSellerName(preSellerName: string): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/getPurchases/${preSellerName}`);
  }

  //Method to create Purchase changing date format to Spring
  createPurhase(purchaseDto: PurchaseDto): Observable<Purchase> {
    const formattedDto = {
      ...purchaseDto,
      purchaseDate: this.formatDateForSpring(purchaseDto.purchaseDate)
    };
    return this.http.post<Purchase>(`http://localhost:8080/purchase/create`, formattedDto);
  }

  //Method to change format yyyy-mm-dd to dd-mm-yyyy for send to Spring.
  private formatDateForSpring(inputDate: string): string {
    const [yyyy, mm, dd] = inputDate.split('-');
    return `${dd}-${mm}-${yyyy}`; // Return dd-MM-yyyy format
  }
}
