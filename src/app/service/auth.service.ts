import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/user/login';

  constructor(private router: Router, private http: HttpClient) { }

  // Iniciar sesión y guardar usuario en localStorage
  login(userData: { userName: string, password: string }): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  // Guardar usuario en localStorage después del login exitoso
  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', user.jwtToken); // Guardar el token en localStorage
  }

  //Get logged user
  getUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  //Verify if is authenticated
  isAuthenticated(): boolean {
    // return localStorage.getItem('token') !== null localStorage.getItem('user') !== null;
    return typeof window !== 'undefined' &&
      window.localStorage.getItem('token') !== null &&
      window.localStorage.getItem('user') !== null;
  }

  //Obtain rol from user
  getUserRole(): string {
    const token = localStorage.getItem('token');
    if (!token) return 'GUEST';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role || 'GUEST';
      return role.toUpperCase();
    } catch (e) {
      console.error('Error al decodificar el token JWT:', e);
      return 'GUEST';
    }
    //const token = localStorage.getItem('token');
    //if (!token) return 'GUEST';

    //const payload = JSON.parse(atob(token.split('.')[1])); // decodifica el JWT
    //return payload.role || 'GUEST';
  }

  //Close session 
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
