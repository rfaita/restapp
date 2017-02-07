import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireHelper } from "./helpers/angularfirehelper";
import { LoginHelper } from "./helpers/loginhelper";
import { CheckInHelper } from "./helpers/checkinhelper";
import { SnackBarHelper } from "./helpers/snackbarhelper";
import { CheckIn } from './model/checkin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string = 'app works!';
  @ViewChild("snackbar") public snackBar;

  constructor(public afh: AngularFireHelper,
    public lh: LoginHelper,
    public ch: CheckInHelper,
    public sbh: SnackBarHelper,
    private router: Router) {
  }

  ngOnInit() {
    this.sbh.snackBarRef = this.snackBar;

  }

  logout() {
    this.afh.logout().then(() => {
      this.lh.user = undefined;
      this.ch.checkIn = undefined;
    });
  }

  checkIn() {
    let newCheckIn: CheckIn = new CheckIn();
    newCheckIn.user = this.lh.user;
    newCheckIn.initDate = new Date().getTime();

    this.afh.af.database.list("/checkin").push(newCheckIn).then((item) => {
      newCheckIn.uid = item.key;
      this.ch.checkIn = newCheckIn;
      this.sbh.showInfo("CheckIn realizado.");
    });
  }

}
