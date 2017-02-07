import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireHelper } from "./helpers/angularfirehelper";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(public afh: AngularFireHelper, public router: Router) {

  }

  logout() {
    this.afh.logout().then(() => {
      this.afh.displayName = undefined;
      this.afh.email = undefined;
      this.afh.photoURL = undefined;
    });
  }

}
