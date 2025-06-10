import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.authService.isAuthenticated()) {
            return true;
        } else {
            console.warn('Acceso denegado: Debes iniciar sesión');
            this.router.navigate(['/login']);
            return false;
        }
    }
}
