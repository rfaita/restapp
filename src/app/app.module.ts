import { Routes, RouterModule, Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { MdlDirective } from './mdl.directive';
import { routing } from './app.routes';
import { MenuComponent } from './menu/menu.component';
import { TruncatePipe } from './truncate.pipe';
import { AngularFireHelper } from "./helpers/angularfirehelper";
import { LoginComponent } from './login/login.component'

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
    AngularFireModule.initializeApp(firebaseConfig),
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [AngularFireHelper],
  bootstrap: [AppComponent]
})
export class AppModule {

  public isLoggedIn: boolean;
  constructor(public afh: AngularFireHelper, private router: Router) {
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

          this.afh.displayName = auth.facebook.displayName;
          this.afh.email = auth.facebook.email;
          this.afh.photoURL = auth.facebook.photoURL;

          this.isLoggedIn = true;
        }
      }
    );
  }

}
