import { Routes, RouterModule } from '@angular/router';
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
    TruncatePipe
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
