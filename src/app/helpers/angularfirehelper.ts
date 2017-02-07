import { Injectable } from "@angular/core";
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

@Injectable()
export class AngularFireHelper {

  public displayName:string;
  public photoURL:string;
  public email:string;

  constructor(public af: AngularFire) { }
  
  loginWithFacebook() {
    return this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup,
    });
  }
  
  logout() {
    return this.af.auth.logout();
  }
}