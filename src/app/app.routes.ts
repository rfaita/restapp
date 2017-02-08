import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from "./about/about.component";
import { MenuComponent } from "./menu/menu.component";
import { LoginComponent } from "./login/login.component";
import { OrdersComponent } from './orders/orders.component';

// Route Configuration
export const routes: Routes = [
    {
        path: '',
        redirectTo: '/menu',
        pathMatch: 'full'
    },
    { path: 'login', component: LoginComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'about', component: AboutComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);