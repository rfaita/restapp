import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';
import { AngularFireHelper } from '../helpers/angularfirehelper';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  items: FirebaseListObservable<any[]>;

  constructor(afh: AngularFireHelper) {
    this.items = afh.af.database.list('/menu');
  }
  ngOnInit() {
  }

}