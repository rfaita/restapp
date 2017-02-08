import { Injectable } from "@angular/core";
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { User } from '../model/user';
import { Order } from '../model/order';
import { LoginHelper } from './loginhelper';
import { Router } from '@angular/router';
import { CheckInHelper } from './checkinhelper';
import { CheckIn } from '../model/checkin';

@Injectable()
export class AngularFireHelper {

  constructor(public af: AngularFire,
    private lh: LoginHelper,
    private ch: CheckInHelper,
    private router: Router) { }

  loginWithFacebook() {
    return this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup,
    });
  }

  logout() {
    return this.af.auth.logout().then(() => {
      this.lh.user = undefined;
      this.unsubscribeLastCheckIn();
    });
  }

  checkIn() {
    let newCheckIn: CheckIn = new CheckIn();
    newCheckIn.initDate = new Date().getTime();

    this.lh.user.lastCheckIn = newCheckIn;
    return this.updateUser().then(() => {
      this.subscribeLastCheckIn();
    });
  }

  updateUser() {
    return this.af.database.object("/user/" + this.lh.user.uid).set(this.lh.user);
  }

  checkOut() {
    return this.lastCheckInRef().update({ orderedCheckOut: true });
  }

  lastCheckInRef() {
    return this.af.database.object("/user/" + this.lh.user.uid + "/lastCheckIn");
  }

  lastCheckInRefOrders() {
    return this.af.database.list("/user/" + this.lh.user.uid + "/lastCheckIn/orders");
  }

  orderDish(order: Order) {
    return this.lastCheckInRefOrders().push(order);
  }

  removePath(key: string) {
    return this.af.database.list("/user/" + this.lh.user.uid + "/lastCheckIn/orders/" + key).remove();
  }

  subscribeUser() {
    this.af.auth.subscribe(
      (auth) => {
        if (auth == null) {
          this.router.navigate(['login']);
          this.lh.user = undefined;
        } else {
          this.router.navigate(['']);

          this.lh.user = new User();
          this.lh.user.displayName = auth.facebook.displayName;
          this.lh.user.email = auth.facebook.email;
          this.lh.user.photoURL = auth.facebook.photoURL;
          this.lh.user.uid = auth.facebook.uid;

          this.subscribeLastCheckIn();

        }
      }
    );
  }

  subscribeLastCheckIn() {
    this.ch.subscription = this.lastCheckInRef().subscribe((lastCheckIn) => {
      this.ch.lastCheckIn = lastCheckIn;
    });
  }

  unsubscribeLastCheckIn() {
    this.ch.subscription.unsubscribe();
    this.ch.lastCheckIn = undefined;
  }

}