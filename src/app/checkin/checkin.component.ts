import { Component, OnInit } from '@angular/core';
import { AngularFireHelper } from '../helpers/angularfirehelper';
import { FirebaseListObservable } from 'angularfire2';
import { CheckIn } from '../model/checkin';
import { SnackBarHelper } from '../helpers/snackbarhelper';
import { Order } from '../model/order';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {

  public tax: boolean = false;
  public perc: number = 10;
  public items: FirebaseListObservable<CheckIn[]>;
  public selectedCheckIn: CheckIn;
  public tables: FirebaseListObservable<any[]>;
  public selectedTable: any;
  public orders: FirebaseListObservable<Order[]>;

  public allowedUpdateOtherCheckIn:boolean = false;
  public allowedReadOtherOrders:boolean = false;

  constructor(private afh: AngularFireHelper,
    private sbh: SnackBarHelper) { }

  checkInSetTable() {
    this.selectedCheckIn.tid = this.selectedTable.$key;
    this.selectedCheckIn.table = this.selectedTable.name;
    this.afh.checkInSetTable(this.selectedCheckIn).then(() => {
      this.sbh.showInfo("Mesa atribuída com sucesso.");
    });
  }

  calculateCheckOut() {
    let total: number = 0;
    let totalSub: Subscription = this.afh.ordersByCheckInRef(this.selectedCheckIn).subscribe(
      items => {
        items.forEach(
          item => {
            total += item.price;
          }
        );
        if (this.tax) {
          total *= 1 + (this.perc / 100);
        }
        this.selectedCheckIn.total = total;
        this.afh.checkOutSetTotal(this.selectedCheckIn).then(() => {
          this.sbh.showInfo("Checkout realizado com sucesso.");
        });
        totalSub.unsubscribe();
        return items;
      }
    );
  }

  loadOrdersByCheckIn() {
    this.orders = this.afh.ordersByCheckInRef(this.selectedCheckIn);
  }

  ngOnInit() {
    this.items = this.afh.checkInsRef();
    this.tables = this.afh.tablesRef();

    this.afh.userIsAllowed("check_ins", "u", false).subscribe(perm => this.allowedUpdateOtherCheckIn = perm);

    this.afh.userIsAllowed("orders", "r", false).subscribe(perm => this.allowedReadOtherOrders = perm);

  }

}
