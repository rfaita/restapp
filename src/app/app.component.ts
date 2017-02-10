import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireHelper } from "./helpers/angularfirehelper";
import { CheckInHelper } from "./helpers/checkinhelper";
import { SnackBarHelper } from "./helpers/snackbarhelper";
import { CheckIn } from './model/checkin';
import { LoginHelper } from './helpers/loginhelper';
import { FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public categories: FirebaseListObservable<any[]>;

  constructor(public afh: AngularFireHelper,
    public lh: LoginHelper,
    public ch: CheckInHelper,
    private sbh: SnackBarHelper,
    private router: Router) {

    this.categories = this.afh.categoriesRef();
  }

  ngOnInit() {

  }

  logout() {
    this.afh.logout();
  }

  checkIn() {
    this.afh.checkIn().then(() => {
      this.sbh.showInfo("Bem vindo. Aguarde a confirmação da mesa.");
    });
  }

  checkOut() {
    this.afh.checkOut().then(() => {
      this.sbh.showInfo("Solicitação de checkout realizada.");
    });
  }

}
