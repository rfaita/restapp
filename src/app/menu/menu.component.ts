import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';
import { AngularFireHelper } from '../helpers/angularfirehelper';
import { CheckInHelper } from '../helpers/checkinhelper';
import { Order } from '../model/order';
import { Dish } from '../model/dish';
import { SnackBarHelper } from '../helpers/snackbarhelper';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public working: Boolean;
  public items: FirebaseListObservable<Dish[]>;

  constructor(private afh: AngularFireHelper,
    private sbh: SnackBarHelper,
    public ch: CheckInHelper) {
    this.items = this.afh.menuRef();
  }

  orderDish(uidDish: string, dish: Dish) {

    this.working = true;

    let order: Order = new Order();

    order.uidDish = uidDish;
    order.nameDish = dish.name;
    order.imageDish = dish.image;
    order.price = dish.price;
    order.time = new Date().getTime();

    this.afh.orderDish(order).then((ordered) => {
      this.sbh.showInfoWithAction(order.nameDish + " solicitado.", "Cancelar", () => {
        this.removeLastOrderDish(ordered.key);
      });
      this.working = false;
    });
  }

  private removeLastOrderDish(keyOrder: string) {
    this.working = true;
    this.afh.removeOrderDish(keyOrder).then(() => {
      this.sbh.showInfo("Última solicitação cancelada.");
      this.working = false;
    });
  }

  ngOnInit() {
  }

}