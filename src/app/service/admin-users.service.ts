import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserRequestDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

  private apiUrl = 'http://localhost:8080/user';
  private http = inject(HttpClient);

  constructor() { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getAll`);
  }

  createUser(userReqDto: UserRequestDto): Observable<UserRequestDto> {
    return this.http.post<UserRequestDto>(`${this.apiUrl}/create`, userReqDto);
  }

  deleteUser(userName: string): Observable<any> {
    return this.http.delete(`http://localhost:8080/user/delete/${userName}`, { responseType: 'text' });
  }
}
