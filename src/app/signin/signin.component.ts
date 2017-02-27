import { Component, OnInit } from '@angular/core';
import { AngularFireHelper, } from '../helpers/angularfirehelper';
import { Router } from '@angular/router';
import { SnackBarHelper } from '../helpers/snackbarhelper';
import { FirebaseAuthState } from 'angularfire2';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  public email: string = "";
  public pass: string = "";
  public passConf: string = "";

  constructor(public afh: AngularFireHelper, public sbh: SnackBarHelper, public router: Router) {

  }

  signInWithEmail() {
    if (this.pass === this.passConf) {
      this.afh.signInWithEmail(this.email, this.pass).then((d) => {
        this.router.navigate(['']);
      }, (e: Error) => {
        switch (e['code']) {
          case "auth/invalid-email": {
            this.sbh.showInfo("Formato do e-mail inválido.");
            break;
          }
          case "auth/email-already-in-use": {
            this.sbh.showInfo("E-mail já em uso.");
            break;
          }
          case "auth/weak-password": {
            this.sbh.showInfo("Senha deve ter pelo menos 6 caractéres.");
            break;
          }
          default: {
            this.sbh.showInfo(e.message);
          }
        }
      });
    } else {
      this.sbh.showInfo("Senhas devem ser iguais.");
    }
  }


  ngOnInit() {
  }

}
