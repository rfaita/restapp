import { Component, OnInit } from '@angular/core';
import { AngularFireHelper } from '../helpers/angularfirehelper';
import { FirebaseListObservable } from 'angularfire2';
import { Dish } from '../model/dish';
import { SnackBarHelper } from '../helpers/snackbarhelper';

@Component({
  selector: 'app-dishs',
  templateUrl: './dishs.component.html',
  styleUrls: ['./dishs.component.css']
})
export class DishsComponent implements OnInit {

  public items: FirebaseListObservable<Dish[]>;
  private _removeDish: Dish;

  public allowedCreateOtherDishs = false;
  public allowedUpdateOtherDishs = false;
  public allowedDeleteOtherDishs = false;
  public searchText: string;

  constructor(private afh: AngularFireHelper,
    private sbh: SnackBarHelper) { }

  setRemoveDish(dish: Dish) {
    this._removeDish = dish;
  }

  removeDish() {
    this.afh.removeDish(this._removeDish).then(() => {
      this.sbh.showInfo('Prato removido som sucesso');
      this._removeDish = undefined;
    });
  }

  ngOnInit() {

    this.items = this.afh.menuRef();


    this.afh.userIsAllowed('dishs', 'c', false).subscribe(perm => this.allowedCreateOtherDishs = perm);
    this.afh.userIsAllowed('dishs', 'u', false).subscribe(perm => this.allowedUpdateOtherDishs = perm);
    this.afh.userIsAllowed('dishs', 'd', false).subscribe(perm => this.allowedDeleteOtherDishs = perm);

  }

}
