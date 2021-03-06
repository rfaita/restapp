import { Routes, RouterModule, Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { MdlModule } from 'angular2-mdl';
import { MdlSelectModule } from '@angular2-mdl-ext/select';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { routing } from './app.routes';
import { MenuComponent } from './menu/menu.component';
import { TruncatePipe } from './truncate.pipe';
import { FilterPipe } from './filter.pipe';
import { AngularFireHelper } from './helpers/angularfirehelper';
import { LoginHelper } from './helpers/loginhelper';
import { AuthGuard } from './helpers/authguard';
import { LoginComponent } from './login/login.component';
import { User } from './model/user';
import { CheckInHelper } from './helpers/checkinhelper';
import { SnackBarHelper } from './helpers/snackbarhelper';
import { OrdersComponent } from './orders/orders.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { DishComponent } from './dish/dish.component';
import { DishsComponent } from './dishs/dishs.component';
import { CheckinComponent } from './checkin/checkin.component';
import { ClearHelper } from './helpers/clearhelper';
import { SigninComponent } from './signin/signin.component';
import { ProfileComponent } from './profile/profile.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/take';


export const firebaseConfig = {
  apiKey: 'AIzaSyDIlT_RN2-aBRUdqe5NrsFu5hmIv3DRCC8',
  authDomain: 'restapp-64952.firebaseapp.com',
  databaseURL: 'https://restapp-64952.firebaseio.com',
  storageBucket: 'restapp-64952.appspot.com',
  messagingSenderId: '86702685835'
};


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    MenuComponent,
    TruncatePipe,
    LoginComponent,
    OrdersComponent,
    KitchenComponent,
    DishComponent,
    DishsComponent,
    FilterPipe,
    CheckinComponent,
    SigninComponent,
    ProfileComponent
  ],
  imports: [
    MdlModule,
    MdlSelectModule,
    AngularFireModule.initializeApp(firebaseConfig),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing
  ],
  providers: [AngularFireHelper, LoginHelper,
    CheckInHelper, SnackBarHelper, AuthGuard, ClearHelper],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(public afh: AngularFireHelper) {

  }

}
