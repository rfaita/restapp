import { Injectable, Inject } from "@angular/core";
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable, FirebaseApp } from 'angularfire2';
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
import { Observable } from 'rxjs';

@Injectable()
export class AngularFireHelper {

  constructor(public af: AngularFire,
    @Inject(FirebaseApp) private firebaseApp: any,
    private lh: LoginHelper,
    private ch: CheckInHelper,
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

  logout() {
    return this.af.auth.logout().then(() => {
      this.lh.user = undefined;
      this.unsubscribeCheckIn();
    });
  }

  updateUser() {
    return this.af.database.object("/users/" + this.lh.user.uid).set(this.lh.user);
  }

  dishRef(key: string) {
    return this.af.database.object("/menu/" + key);
  }

  addDish(dish: Dish) {
    return this.af.database.list("/menu").push(dish);
  }

  updateDish(dish: Dish) {
    const key: string = dish.$key;
    delete dish.$key;
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

  ordersByCheckInRef() {
    return this.af.database.list("/orders/", {
      query: {
        orderByChild: "cid",
        equalTo: this.ch.checkIn.$key
      }
    }).map(items => items.sort((o1: Order, o2: Order) => { return o2.time - o1.time })) as FirebaseListObservable<Order[]>;
  }

  ordersByStatusAndLocalRef(status: string, local: string) {
    return this.af.database.list("/orders/", {
      query: {
        orderByChild: "status",
        equalTo: status
      }
    }).map(items => items.filter(item => { return item.destination === local }))
      .map(items => items.sort((o1: Order, o2: Order) => { return o1.time - o2.time })) as FirebaseListObservable<Order[]>;
  }


  orderDish(order: Order) {
    order.uid = this.lh.user.uid;
    return this.ordersByCheckInRef().push(order);
  }

  updateOrder(order: Order) {
    const key: string = order.$key;
    delete order.$key;
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