import { Injectable, Inject } from "@angular/core";
import {
  AngularFire, AuthProviders, AuthMethods,
  FirebaseObjectObservable, FirebaseListObservable,
  FirebaseApp
} from 'angularfire2';
import { User } from '../model/user';
import { Order } from '../model/order';
import { LoginHelper } from './loginhelper';
import { Router } from '@angular/router';
import { CheckInHelper } from './checkinhelper';
import { CheckIn } from '../model/checkin';
import { Subscription, Subject } from 'rxjs';
import { Dish } from '../model/dish';
import { Favorite } from '../model/favorite';
import { Comment } from '../model/comment';
import { Observable } from 'rxjs';
import { ClearHelper } from './clearhelper';

@Injectable()
export class AngularFireHelper {

  constructor(public af: AngularFire,
    @Inject(FirebaseApp) private firebaseApp: any,
    private lh: LoginHelper,
    private ch: CheckInHelper,
    private clearHelper: ClearHelper,
    private router: Router) {
  }

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

  loginWithEmail(email: string, pass: string) {
    return this.af.auth.login({
      email: email,
      password: pass
    }, {
        provider: AuthProviders.Password,
        method: AuthMethods.Password,
      });
  }

  signInWithEmail(email: string, pass: string) {
    return this.af.auth.createUser({ email: email, password: pass });
  }

  logout() {
    return this.af.auth.logout().then(() => {
      this.lh.user = undefined;
      this.unsubscribeCheckIn();
    });
  }

  userRef() {
    return this.af.database.object("/users/" + this.lh.user.uid);
  }

  updateUser() {
    this.clearHelper.clear(this.lh.user)
    return this.userRef().update(this.lh.user);
  }

  dishRef(key: string) {
    return this.af.database.object("/menu/" + key);
  }

  addDish(dish: Dish) {
    return this.af.database.list("/menu").push(dish);
  }

  updateDish(dish: Dish) {
    const key: string = this.clearHelper.clear(dish);
    return this.af.database.object("/menu/" + key).update(dish);
  }

  removeDish(dish: Dish) {
    return this.af.database.object("/menu/" + dish.$key).remove();
  }

  uploadFile(file: File, path?: string): Observable<any> {
    return new Observable<any>((sub => {
      let uploadRef = this._uploadFile(file, path);
      uploadRef.on('state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // See below for more detail
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          sub.next(progress);
        },
        (error) => {
          // Handle unsuccessful uploads
          sub.error(error);
        },
        () => {
          sub.next(uploadRef.snapshot.downloadURL);
          sub.complete();

        });
    }));
  }

  private _uploadFile(file: File, path?: string) {
    return this.firebaseApp.storage().ref().child(path + new Date().getTime() + file.name).put(file);
  }

  tablesRef() {
    return this.af.database.list('/tables', {
      query: {
        orderByChild: "inUse",
        equalTo: false
      }
    });
  }

  checkInsRef() {
    return this.af.database.list('/check_ins');
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

  destinationsRef() {
    return this.af.database.list('/destinations');
  }

  addFavorite(favorite: Favorite) {
    favorite.uid = this.lh.user.uid;
    favorite.time = new Date().getTime();
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
    newCheckIn.orderCheckInTime = new Date().getTime();
    newCheckIn.userDisplayName = this.lh.user.displayName;
    newCheckIn.userPhotoURL = this.lh.user.photoURL;
    newCheckIn = CheckIn.buildIndex(newCheckIn);

    return this.checkInByUserRef().push(newCheckIn).then(() => {
      this.subscribeCheckIn();
    });

  }

  checkOut() {
    return this.af.database.object("/check_ins/" + this.ch.checkIn.$key).update({
      orderCheckOutTime: new Date().getTime()
    });
  }

  checkOutSetTotal(checkIn: CheckIn) {
    checkIn.checkOutTime = new Date().getTime();
    checkIn.closed = true;
    checkIn = CheckIn.buildIndex(checkIn);
    const key: string = this.clearHelper.clear(checkIn);

    return this.af.database.object('/check_ins/' + key).update(checkIn).then(() => {
      this.af.database.object("/tables/" + checkIn.tid).update({ inUse: false });
    });
  }

  checkInSetTable(checkIn: CheckIn) {

    checkIn.checkInTime = new Date().getTime();
    const key: string = this.clearHelper.clear(checkIn);

    return this.af.database.object('/check_ins/' + key).update(checkIn).then(() => {
      this.af.database.object("/tables/" + checkIn.tid).update({ inUse: true });
    });
  }

  checkInByUserRef() {
    return this.af.database.list("/check_ins/", {
      query: {
        orderByChild: "_closed_uid",
        equalTo: "false" + this.lh.user.uid
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

  ordersByCheckInRef(checkIn?: CheckIn) {
    return this.af.database.list("/orders/", {
      query: {
        orderByChild: "cid",
        equalTo: (checkIn ? checkIn.$key : this.ch.checkIn.$key)
      }
    }).map(items => items.sort((o1: Order, o2: Order) => { return o1.time - o2.time })) as FirebaseListObservable<Order[]>;
  }

  ordersByStatusAndLocalRef(status: string, local: string) {
    return this.af.database.list("/orders/", {
      query: {
        orderByChild: "_destination_status",
        equalTo: local + status,

      }
    }).map(items => items.sort((o1: Order, o2: Order) => { return o1.time - o2.time })) as FirebaseListObservable<Order[]>;
  }


  orderDish(order: Order) {
    order.uid = this.lh.user.uid;
    order.time = new Date().getTime();
    order = Order.buildIndex(order);
    return this.ordersByCheckInRef().push(order);
  }

  updateOrder(order: Order) {
    const key: string = this.clearHelper.clear(order);
    order = Order.buildIndex(order);
    return this.af.database.object("/orders/" + key).update(order);
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
    }).map(items => items.sort((o1: Comment, o2: Comment) => { return o2.time - o1.time }))
      .map(items => { return items.splice(0, 15) }) as FirebaseListObservable<Comment[]>;
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
    comment.time = new Date().getTime();
    comment.uid = this.lh.user.uid;
    return this.af.database.list('/dish_comments').push(comment);
  }

  auth() {
    return this.af.auth;
  }

  userIsAllowed(entity, permission, ownResources: boolean = true): Observable<boolean> {
    if (this.lh.user.role === "admin") {
      return Observable.of(true);
    } else {
      return this.af.database.object("/permissions/" +
        (!this.lh.user.role ? "user" : this.lh.user.role) + "/" + entity + "/" +
        (ownResources ? "own" : "other") + "/" + permission)
        .map(perm => { return (this.lh.user && this.lh.user.uid && !!perm) ? perm.$value : false });
    }
  }

  subscribeUser() {
    return this.auth().map(
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
          } else if (auth.provider === AuthProviders.Password) {
            this.lh.user.displayName = auth.auth.email;//duuu
            this.lh.user.email = auth.auth.email;
            this.lh.user.photoURL = "/assets/nobody.jpg"
          }
          this.lh.user.provider = auth.provider;
          this.lh.user.uid = auth.uid;
        }
      }
    );
  }
}