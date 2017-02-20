import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2';
import { AngularFireHelper } from '../helpers/angularfirehelper';
import { CheckInHelper } from '../helpers/checkinhelper';
import { Order } from '../model/order';
import { Dish } from '../model/dish';
import { SnackBarHelper } from '../helpers/snackbarhelper';
import { MdlSnackbarComponent } from 'angular2-mdl';
import { LoginHelper } from '../helpers/loginhelper';
import { Favorite } from '../model/favorite';
import { Comment } from '../model/comment';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public working: Boolean;
  public items: Dish[];
  public favorites: Favorite[];
  private menuObservable: Observable<Dish[]>;
  public comments: FirebaseListObservable<Comment[]>;
  public ingredients: FirebaseListObservable<any[]>;

  private comment: Comment = new Comment();

  constructor(private afh: AngularFireHelper,
    private sbh: SnackBarHelper,
    public ch: CheckInHelper,
    private lh: LoginHelper,
    private route: ActivatedRoute) {

  }

  orderDish(dish: Dish) {

    this.working = true;

    let order: Order = new Order();

    order.table = this.ch.checkIn.table;
    order.did = dish.$key;
    order.dishName = dish.name;
    order.dishImage = dish.image;
    order.price = dish.price;
    order.cid = this.ch.checkIn.$key;
    order.destination = dish.destination;

    this.afh.orderDish(order).then((ordered) => {
      this.sbh.showInfo(order.dishName + " solicitado.", "Cancelar",
        () => {
          order.$key = ordered.key
          this.removeLastOrderDish(order);
        },
        () => {
          this.working = false;
        });

    });
  }

  loadComments(dish: Dish) {
    this.comment.did = dish.$key;
    this.comments = this.afh.commentsByDishRef(dish);
  }

  loadIngredients(dish: Dish) {
    this.ingredients = this.afh.ingredientsByDishRef(dish);
  }

  addComment() {
    let did: string = this.comment.did;
    
    this.afh.addComment(this.comment).then(() => {
      this.comment = new Comment();
      this.comment.did = did;
    });

  }

  toggleFavorite(dish: Dish) {
    this.working = true;

    let favorited: Favorite = this.verifyFavoriteDish(dish);

    if (!favorited) {

      let favorite: Favorite = new Favorite();
      favorite.did = dish.$key;
      
      this.afh.addFavorite(favorite).then(() => {
        this.sbh.showInfo(dish.name + " adicionado aos favoritos", "", () => { },
          () => {
            this.working = false;
          });
      });
    } else {
      this.afh.removeFavorite(favorited).then(() => {
        this.sbh.showInfo(dish.name + " removido dos favoritos", "", () => { },
          () => {
            this.working = false;
          });
      });
    }
  }

  verifyFavoriteDish(dish: Dish) {
    if (this.favorites) {
      for (let i = 0; i < this.favorites.length; i++) {
        if (this.favorites[i].did == dish.$key) {
          return this.favorites[i];
        }
      }
    }
    return null;
  }

  private removeLastOrderDish(order: Order) {
    this.working = true;
    this.afh.removeOrderDish(order).then(() => {
      this.sbh.showInfo("Última solicitação cancelada.", "", () => { }, () => {
        this.working = false;
      });

    });
  }

  ngOnInit() {

    let subMenu: Subscription;
    let subFav: Subscription;
    this.route.params.subscribe(params => {

      if (subMenu) {
        subMenu.unsubscribe();
      }
      if (subFav) {
        subFav.unsubscribe();
      }

      if (params["category"] !== "fav") {
        subMenu = this.afh.menuRef(params["category"]).subscribe((items) => {
          this.items = items;
        });
      }
      subFav = this.afh.favoritesRefByUser()
        .subscribe((favorites) => {
          if (params["category"] === "fav") {
            this.items = [];
            subMenu = this.afh.menuRef().subscribe((items) => {
              favorites.forEach((favorite) => {
                items.forEach((item) => {
                  if (favorite.did === item.$key) {
                    this.items.push(item);
                  }
                });

              });
            });
          }
          this.favorites = favorites;
        });

    });

  }

}