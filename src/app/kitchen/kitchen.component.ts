import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';
import { Order } from '../model/order';
import { AngularFireHelper } from '../helpers/angularfirehelper';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit {


  public waitings: FirebaseListObservable<Order[]>;
  public doings: FirebaseListObservable<Order[]>;
  public dones: FirebaseListObservable<Order[]>;

  constructor(private afh: AngularFireHelper,
    private route: ActivatedRoute) {

  }

  changeOrderStatusToDoing(order: Order) {
    let updateOrder: Order = new Order();
    updateOrder.$key = order.$key;
    updateOrder.status = "doing";
    updateOrder.timeInitDoing = new Date().getTime();
    this.afh.updateOrder(updateOrder);
  }

  changeOrderStatusToDone(order: Order) {
    let updateOrder: Order = new Order();
    updateOrder.$key = order.$key;
    updateOrder.status = "done";
    updateOrder.timeFinishDoing = new Date().getTime();
    this.afh.updateOrder(updateOrder);
  }

  ngOnInit() {

    this.route.params.subscribe(params => {

      const local = params["local"];

      this.waitings = this.afh.ordersByStatusAndLocalRef('waiting', local);
      this.doings = this.afh.ordersByStatusAndLocalRef('doing', local);
      this.dones = this.afh.ordersByStatusAndLocalRef('done', local)
        .map(items => items.filter(item => { return item.timeFinishDoing + 60000 >= new Date().getTime() })) as FirebaseListObservable<Order[]>;

    });


  }
}
