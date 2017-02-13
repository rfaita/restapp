import { Component, OnInit } from '@angular/core';
import { AngularFireHelper } from '../helpers/angularfirehelper';
import { FirebaseListObservable } from 'angularfire2';
import { Order } from '../model/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  public items: FirebaseListObservable<Order[]>;

  constructor(private afh: AngularFireHelper) {

  }

  ngOnInit() {

    this.items = this.afh.ordersByCheckInRef();

  }

}
