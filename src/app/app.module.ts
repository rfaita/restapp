import { Routes, RouterModule, Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { MdlDirective } from './mdl.directive';
import { routing } from './app.routes';
import { MenuComponent } from './menu/menu.component';
import { TruncatePipe } from './truncate.pipe';
import { AngularFireHelper } from "./helpers/angularfirehelper";
import { LoginHelper } from "./helpers/loginhelper";
import { LoginComponent } from './login/login.component'
import { User } from './model/user';
import { CheckInHelper } from './helpers/checkinhelper';
import { SnackBarHelper } from './helpers/snackbarhelper';

export const firebaseConfig = {
  apiKey: "AIzaSyDIlT_RN2-aBRUdqe5NrsFu5hmIv3DRCC8",
  authDomain: "restapp-64952.firebaseapp.com",
  databaseURL: "https://restapp-64952.firebaseio.com",
  storageBucket: "restapp-64952.appspot.com",
  messagingSenderId: "86702685835"
};


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    MdlDirective,
    MenuComponent,
    TruncatePipe,
    LoginComponent
  ],
  imports: [
    MaterialModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [AngularFireHelper, LoginHelper,
    CheckInHelper, SnackBarHelper],
  bootstrap: [AppComponent]
})
export class AppModule {

  public isLoggedIn: boolean;
  constructor(public afh: AngularFireHelper,
    public lh: LoginHelper,
    public ch: CheckInHelper,
    private router: Router) {
    // This asynchronously checks if our user is logged it and will automatically
    // redirect them to the Login page when the status changes.
    // This is just a small thing that Firebase does that makes it easy to use.
    this.afh.af.auth.subscribe(
      (auth) => {
        if (auth == null) {
          this.router.navigate(['login']);
          this.isLoggedIn = false;
        } else {
          this.router.navigate(['']);

          this.lh.user = new User();
          this.lh.user.displayName = auth.facebook.displayName;
          this.lh.user.email = auth.facebook.email;
          this.lh.user.photoURL = auth.facebook.photoURL;
          this.lh.user.uid = auth.facebook.uid;

          this.ch.checkIn = undefined;

          this.isLoggedIn = true;
        }
      }
    );
  }

}
