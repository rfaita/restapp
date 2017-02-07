import { Component, OnInit } from '@angular/core';
import { AngularFireHelper } from '../helpers/angularfirehelper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public afh: AngularFireHelper, public router: Router) {

  }

  loginWithFacebook() {
    this.afh.loginWithFacebook().then((data) => {
      this.router.navigate(['']);
    })
  }

  ngOnInit() {
  }

}
