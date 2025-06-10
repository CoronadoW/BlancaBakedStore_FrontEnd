import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { CashBalanceComponent } from './cash-balance/cash-balance.component';
import { ResaleProductComponent } from './resale-product/resale-product.component';
import { SupplyComponent } from './supply/supply.component';
import { RecipeComponent } from './recipe/recipe.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { PreSellerComponent } from './pre-seller/pre-seller.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
export const routes: Routes = [

    {
        path: 'product', component: ProductComponent,
        canActivate: [AuthGuard]
    }, //Ruta para el componente ProductComponent

    {
        path: 'cash-balance', component: CashBalanceComponent, canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: 'ADMIN' }
    },

    {
        path: 'resale-product', component: ResaleProductComponent, canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: 'ADMIN' }
    },

    {
        path: 'supply', component: SupplyComponent, canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: 'ADMIN' }
    },

    {
        path: 'recipe', component: RecipeComponent, canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: 'ADMIN' }
    },

    {
        path: 'pre-seller', component: PreSellerComponent, canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: 'ADMIN' }
    },

    {
        path: 'admin-users', component: AdminUsersComponent, canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: 'ADMIN' }
    },

    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/product', pathMatch: 'full' } //Redirijo por defecto a 'product'
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }