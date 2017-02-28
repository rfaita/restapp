import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from "./about/about.component";
import { MenuComponent } from "./menu/menu.component";
import { LoginComponent } from "./login/login.component";
import { OrdersComponent } from './orders/orders.component';
import { AuthGuard } from './helpers/authguard';
import { KitchenComponent } from './kitchen/kitchen.component';
import { DishComponent } from './dish/dish.component';
import { DishsComponent } from './dishs/dishs.component';
import { CheckinComponent } from './checkin/checkin.component';
import { SigninComponent } from './signin/signin.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [

    { path: 'login', component: LoginComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'checkin', component: CheckinComponent, canActivate: [AuthGuard] },
    { path: 'menu/:category', component: MenuComponent, canActivate: [AuthGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
    { path: 'dishs', component: DishsComponent, canActivate: [AuthGuard] },
    { path: 'dish', component: DishComponent, canActivate: [AuthGuard] },
    { path: 'dish/:id', component: DishComponent, canActivate: [AuthGuard] },
    { path: 'kitchen/:local', component: KitchenComponent, canActivate: [AuthGuard] },
    { path: 'about', component: AboutComponent, canActivate: [AuthGuard] }, {
        path: '',
        redirectTo: '/menu',
        pathMatch: 'full'
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);