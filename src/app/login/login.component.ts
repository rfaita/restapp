import { Component, OnInit } from '@angular/core';
import { AngularFireHelper } from '../helpers/angularfirehelper';
import { Router } from '@angular/router';
import { SnackBarHelper } from '../helpers/snackbarhelper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email = '';
  public pass = '';

  constructor(public afh: AngularFireHelper, public sbh: SnackBarHelper, public router: Router) {

  }

  loginWithFacebook() {
    this.afh.loginWithFacebook().then((data) => {
      this.router.navigate(['']);
    }, (e: Error) => {
      switch (e['code']) {
        case 'auth/account-exists-with-different-credential': {
          this.sbh.showInfo('Este e-mail já esta associado a outro provedor de acesso.');
        }
          break;
        default: {
          this.sbh.showInfo(e.message);
        }
      }
    });
  }
  loginWithGoogle() {
    this.afh.loginWithGoogle().then((data) => {
      this.router.navigate(['']);
    }, (e: Error) => {
      switch (e['code']) {
        case 'auth/account-exists-with-different-credential': {
          this.sbh.showInfo('Este e-mail já esta associado a outro provedor de acesso.');
        }
          break;
        default: {
          this.sbh.showInfo(e.message);
        }
      }
    });
  }
  loginWithEmail() {
    this.afh.loginWithEmail(this.email, this.pass).then((data) => {
      this.router.navigate(['']);
    }, (e: Error) => {
      switch (e['code']) {
        case 'auth/invalid-email': {
          this.sbh.showInfo('Formato do e-mail inválido.');
        }
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password': {
          this.sbh.showInfo('E-mail não cadastrado ou senha incorreta.');
        }
          break;
        default: {
          this.sbh.showInfo(e.message);
        }
      }
    });

  }



  ngOnInit() {
  }

}
