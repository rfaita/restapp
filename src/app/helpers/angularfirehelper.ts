import { Injectable } from "@angular/core";
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { User } from '../model/user';
import { Order } from '../model/order';
import { LoginHelper } from './loginhelper';
import { Router } from '@angular/router';
import { CheckInHelper } from './checkinhelper';
import { CheckIn } from '../model/checkin';
import { Subscription } from 'rxjs';
import { Dish } from '../model/dish';
import { Favorite } from '../model/favorite';
import { Comment } from '../model/comment';

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


  loginWithGoogle() {
    return this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup,
    });
  }

  logout() {
    return this.af.auth.logout().then(() => {
      this.lh.user = undefined;
      this.unsubscribeCheckIn();
    });
  }

  updateUser() {
    return this.af.database.object("/users/" + this.lh.user.uid).set(this.lh.user);
  }


  menuRef(category?: string) {
    if (category) {
      return this.af.database.list('/menu',
        {
          query: {
            orderByChild: "category",
            equalTo: category,
          }
        }
      );
    } else {
      return this.af.database.list('/menu');
    }
  }

  categoriesRef() {
    return this.af.database.list('/categories');
  }

  addFavorite(favorite: Favorite) {
    favorite.uid = this.lh.user.uid;
    return this.favoritesRefByUser().push(favorite);
  }

  removeFavorite(favorite: Favorite) {
    return this.af.database.object("/favorites/" + favorite.$key).remove();
  }

  favoritesRefByUser() {
    return this.af.database.list('/favorites', {
      query: {
        orderByChild: "uid",
        equalTo: this.lh.user.uid
      }
    });
  }

  checkIn() {
    let newCheckIn: CheckIn = new CheckIn();
    newCheckIn.uid = this.lh.user.uid;
    newCheckIn.initDate = new Date().getTime();

    return this.updateUser().then(() => {
      this.checkInByUserRef().push(newCheckIn).then(() => {
        this.subscribeCheckIn();
      });
    });
  }

  checkOut() {
    return this.af.database.object("/check_ins/" + this.ch.checkIn.$key).update({ orderedCheckOut: true });
  }

  checkInByUserRef() {
    return this.af.database.list("/check_ins/", {
      query: {
        orderByChild: "uid",
        equalTo: this.lh.user.uid,
        limitToFirst: 1
      }
    });
  }

  subscribeCheckIn() {
    return this.ch.subscription = this.checkInByUserRef().subscribe((checkIn) => {
      this.ch.checkIn = checkIn[0];
    });
  }

  unsubscribeCheckIn() {
    this.ch.subscription.unsubscribe();
    this.ch.checkIn = undefined;
  }

  ordersByCheckIn() {
    return this.af.database.list("/orders/", {
      query: {
        orderByChild: "cid",
        equalTo: this.ch.checkIn.$key
      }
    }).map(items => items.sort((o1: Order, o2: Order) => { return o2.time - o1.time })) as FirebaseListObservable<Order[]>;
  }

  orderDish(order: Order) {
    order.uid = this.lh.user.uid;
    return this.ordersByCheckIn().push(order);
  }

  removeOrderDish(order: Order) {
    return this.af.database.list("/orders/" + order.$key).remove();
  }

  commentsByDishRef(dish: Dish) {
    return this.af.database.list('/dish_comments', {
      query: {
        orderByChild: "did",
        equalTo: dish.$key
      }
    }).map(items => items.sort((o1: Comment, o2: Comment) => { return o2.time - o1.time })) as FirebaseListObservable<Comment[]>;
  }

  ingredientsByDishRef(dish: Dish) {
    return this.af.database.list('/dish_ingredients', {
      query: {
        orderByChild: "did",
        equalTo: dish.$key
      }
    });
  }

  addComment(comment: Comment) {
    comment.userDisplayName = this.lh.user.displayName;
    comment.userPhotoURL = this.lh.user.photoURL;
    comment.uid = this.lh.user.uid;
    return this.af.database.list('/dish_comments').push(comment);
  }

  auth() {
    return this.af.auth;
  }

  subscribeUser() {
    this.auth().subscribe(
      (auth) => {
        if (auth == null) {
          this.router.navigate(['login']);
          this.lh.user = undefined;

        } else {
          this.router.navigate(['']);

          this.lh.user = new User();

          if (auth.facebook) {
            this.lh.user.displayName = auth.facebook.displayName;
            this.lh.user.email = auth.facebook.email;
            this.lh.user.photoURL = auth.facebook.photoURL;
          } else if (auth.google) {
            this.lh.user.displayName = auth.google.displayName;
            this.lh.user.email = auth.google.email;
            this.lh.user.photoURL = auth.google.photoURL;
          }
          this.lh.user.uid = auth.uid;

          this.subscribeCheckIn();

        }
      }
    );
  }
}