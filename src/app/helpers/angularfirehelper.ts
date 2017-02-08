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
    newCheckIn.uid = this.lh.user.uid;
    newCheckIn.initDate = new Date().getTime();

    this.lastCheckInRef().set(newCheckIn);
    return this.updateUser().then(() => {
      this.subscribeLastCheckIn();
    });



  }

  menuRef() {
    return this.af.database.list('/menu');
  }

  updateUser() {
    return this.af.database.object("/users/" + this.lh.user.uid).set(this.lh.user);
  }

  checkOut() {
    return this.lastCheckInRef().update({ orderedCheckOut: true });
  }

  lastCheckInRef() {
    return this.af.database.object("/last_check_ins/" + this.lh.user.uid);
  }

  lastCheckInRefOrders() {
    return this.af.database.list("/current_orders/" + this.ch.lastCheckIn.uid + "/dishs");
  }

  orderDish(order: Order) {
    return this.lastCheckInRefOrders().push(order);
  }

  removeOrderDish(key: string) {
    return this.af.database.list("/current_orders/" + this.ch.lastCheckIn.uid + "/dishs/" + key).remove();
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
          this.lh.user.uid = auth.uid;

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