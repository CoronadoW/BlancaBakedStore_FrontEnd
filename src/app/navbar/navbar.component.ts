import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true, //Necesario en angular moderno para poder ser reconocido 
  imports: [CommonModule, RouterModule], //Importar modulos necesarios para poder realizar navegaciones (routerlink)
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  role: string = 'GUEST'; //Inicializamos con un rol por defecto

  isAuthenticated: boolean = false;
  user: string = 'Un Usuario';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.refreshUserInfo();
    //this.role = this.authService.getUserRole(); //We obtein rol from User when init
    //console.log('Rol del usuario: ', this.role) //Veriry Role in Console.
  }

  refreshUserInfo(): void {
    this.role = this.authService.getUserRole();
    this.isAuthenticated = this.authService.isAuthenticated();

    const userObject = this.authService.getUser();
    this.user = userObject?.userName || 'Un usuario';
    console.log('Rol del usuario:', this.role, 'Usuario: ', this.user);
  }

  getUser(): void {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
    this.refreshUserInfo(); // Refrescar datos
    this.router.navigate(['/login']);
    //this.authService.logout();
    //this.role = 'GUEST'; //Reset rol when close session.
  }


}
