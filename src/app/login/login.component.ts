import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthIntentService } from '../service/auth-intent.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userName: string = '';
  password: string = '';
  errorMessage: string = '';
  redirectUrl: string = '';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private authIntentService: AuthIntentService) { }

  ngOnInit() {
    // Capturo la URL a la que el usuario intentaba acceder antes de ser redirigido al login
    this.route.queryParams.subscribe(params => {
      this.redirectUrl = params['redirect'] || '';
    });
  }

  onLoginSuccess(user: any) {
    this.authService.saveUser(user);

    if (this.redirectUrl === 'cerrar-caja') {
      this.router.navigate(['/caja'], { queryParams: { ejecutar: 'cerrar' } });
    } else {
      this.router.navigate(['/home']);
    }
  }

  login() {
    if (!this.userName || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    this.authService.login({ userName: this.userName, password: this.password }).subscribe({
      next: (response) => {
        this.authService.saveUser(response); // Guardar usuario y token

        // Ejecutar intención pendiente si existe (como cerrar caja)
        this.authIntentService.runCallback();

        // Redirigir después del login
        if (this.redirectUrl) {
          this.router.navigate([`/${this.redirectUrl}`]);
        } else {
          this.router.navigate(['/product']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
        console.error(err);
      }
    });
  }
}
