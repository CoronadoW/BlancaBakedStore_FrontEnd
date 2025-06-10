import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpirationDto, ExpirationRecived, ResaleProdDto, ResaleProduct, ResaleProductWithNearestExpiration } from '../models/resale-product.model';

@Injectable({
  providedIn: 'root'
})
export class ResaleProductService {
  private apiUrl = 'http://localhost:8080/resaleProduct';

  private http = inject(HttpClient);

  //Method to create a new resaleProduct, angular expects a json, I don´t need to change the way angular expects the response
  createResaleProduct(resaleProdDto: ResaleProdDto): Observable<ResaleProductWithNearestExpiration> {
    const formattedDto: ResaleProdDto = {
      ...resaleProdDto,
      expDto: {
        ...resaleProdDto.expDto,
        buyDate: this.formatDateForSpring(resaleProdDto.expDto.buyDate),
        expireDate: this.formatDateForSpring(resaleProdDto.expDto.expireDate)
      }
    };
    console.log("ResaleProductDto enviado: ", formattedDto);
    return this.http.post<ResaleProductWithNearestExpiration>(`${this.apiUrl}/create`, formattedDto);
  }

  //Method to set format to date, because Spring espects dd-mm-yyyy
  private formatDateForSpring(inputDate: string): string {
    const [yyyy, mm, dd] = inputDate.split('-');
    return `${dd}-${mm}-${yyyy}`; // Return dd-MM-yyyy format
  }

  //Method to create new Expiration, and associte to a ResaleProduct by its productCode
  createNewExpiration(expDto: ExpirationDto): Observable<ExpirationRecived> {
    const formattedDto: ExpirationDto = {
      ...expDto,
      buyDate: this.formatDateForSpring(expDto.buyDate),
      expireDate: this.formatDateForSpring(expDto.expireDate),
    }
    return this.http.post<ExpirationRecived>(`http://localhost:8080/expiration/createAndAssocProd`, formattedDto);
  }

  //Method to get all ResaleProduct with its nearest expiration date, not the complete list of expirations for each ResaleProduct.
  getProductsWithNearestExpiration(): Observable<ResaleProductWithNearestExpiration[]> {
    return this.http.get<ResaleProductWithNearestExpiration[]>(`${this.apiUrl}/getAllWithNearestDate`);
  }

  //Method to get ResaleProduct by productCode with its nearest expiration date
  getResaleProductByCode(productCode: number): Observable<ResaleProductWithNearestExpiration> {
    return this.http.get<ResaleProductWithNearestExpiration>(`${this.apiUrl}/getWithNearestDate/${productCode}`);
  }

  //Method to get ResaleProduct by productName
  getResaleProductByProductName(productName: string): Observable<ResaleProductWithNearestExpiration> {
    return this.http.get<ResaleProductWithNearestExpiration>(`${this.apiUrl}/getWithNearestDateByName/${productName}`);
  }

  //Method to get all ResaleProduct
  getAllResaleProducts(): Observable<ResaleProduct[]> {
    return this.http.get<ResaleProduct[]>(`${this.apiUrl}/getAll`);
  }

  //Delete ResaleProduct by productCode
  deleteResaleProduct(productCode: number): Observable<any> {
    //return this.http.delete<string>(`${this.apiUrl}/delete/${productCode}`); I change the way to take the response of backend, Angular expected a json, now expects a string
    return this.http.delete(`http://localhost:8080/resaleProduct/delete/${productCode}`, { responseType: 'text' });
  }

  //Edit ResaleProduct by ResaleProdDto  ***may be ExpirationDto 
  editResaleProduct(dto: ResaleProdDto): Observable<ResaleProduct> {
    return this.http.put<ResaleProduct>(`${this.apiUrl}/edit`, dto);
  }

  //Update stock  *****may be ExpirationDto 
  updateResaleProductStock(productCode: number, newStock: number): Observable<ResaleProduct> {
    return this.http.put<ResaleProduct>(`${this.apiUrl}/edit-stock/${productCode}?newStock=${newStock}`, {});
  }

  updateStockProduct(expDto: ExpirationDto) {
    return this.http.post<any>(`http://localhost:8080/expiration/updateStock`, expDto);
  }



}
