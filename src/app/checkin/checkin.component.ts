import { Component, OnInit } from '@angular/core';
import { AngularFireHelper } from '../helpers/angularfirehelper';
import { FirebaseListObservable } from 'angularfire2';
import { CheckIn } from '../model/checkin';
import { SnackBarHelper } from '../helpers/snackbarhelper';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {

  public items: FirebaseListObservable<CheckIn[]>;
  public selectedCheckIn: CheckIn;
  public tables: FirebaseListObservable<any[]>;
  public selectedTable: any;

  constructor(private afh: AngularFireHelper,
    private sbh: SnackBarHelper) { }

  checkInSetTable() {
    this.selectedCheckIn.tid = this.selectedTable.$key;
    this.selectedCheckIn.table = this.selectedTable.name;
    this.afh.checkInSetTable(this.selectedCheckIn).then(() => {
      this.sbh.showInfo("Mesa atribuída com sucesso.");
    });
  }

  ngOnInit() {
    this.items = this.afh.checkInsRef();
    this.tables = this.afh.tablesRef();
  }

}
