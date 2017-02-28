import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireHelper } from "./helpers/angularfirehelper";
import { CheckInHelper } from "./helpers/checkinhelper";
import { SnackBarHelper } from "./helpers/snackbarhelper";
import { CheckIn } from './model/checkin';
import { LoginHelper } from './helpers/loginhelper';
import { FirebaseListObservable, AuthProviders } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public categories: FirebaseListObservable<any[]>;

  public allowedCreateCheckIn: boolean = false;
  public allowedReadCheckIn: boolean = false;
  public allowedUpdateCheckIn: boolean = false;
  public allowedReadOtherCheckIn: boolean = false;
  public allowedReadOtherOrders: boolean = false;
  public allowedReadOtherDishs: boolean = false;

  constructor(public afh: AngularFireHelper,
    public lh: LoginHelper,
    public ch: CheckInHelper,
    private sbh: SnackBarHelper,
    private router: Router) {

    this.categories = this.afh.categoriesRef();
  }

  ngOnInit() {
    this.afh.subscribeUser().subscribe((auth) => {
      if (!!this.lh.user) {
        this.afh.subscribeCheckIn();
        if (this.lh.user.provider === AuthProviders.Password) {
          this.afh.userRef().subscribe(user => {
            if (!user.uid) {
              //cria o usuário no sistema
              this.afh.updateUser();
            } else {
              //resgata o usuário no sistema
              this.lh.user = user;
              this.lh.user.role = this.lh.user.role || "user";
              this.loadAllowedByUser();
            }
          });
        } else {
          this.afh.updateUser().then(() => {
            this.afh.userRef().subscribe(user => {
              this.lh.user.role = user.role || "user";
              this.loadAllowedByUser();
            });
          });
        }
      }
    });

  }

  private loadAllowedByUser() {

    this.afh.userIsAllowed("check_ins", "c").subscribe(perm => this.allowedCreateCheckIn = perm);
    this.afh.userIsAllowed("check_ins", "r").subscribe(perm => this.allowedReadCheckIn = perm);
    this.afh.userIsAllowed("check_ins", "u").subscribe(perm => this.allowedUpdateCheckIn = perm);

    this.afh.userIsAllowed("check_ins", "r", false).subscribe(perm => this.allowedReadOtherCheckIn = perm);

    this.afh.userIsAllowed("orders", "r", false).subscribe(perm => this.allowedReadOtherOrders = perm);

    this.afh.userIsAllowed("dishs", "r", false).subscribe(perm => this.allowedReadOtherDishs = perm);
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
