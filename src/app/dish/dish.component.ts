import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AngularFireHelper } from '../helpers/angularfirehelper';
import { FirebaseListObservable } from 'angularfire2';
import { Dish } from '../model/dish';
import { SnackBarHelper } from '../helpers/snackbarhelper';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.css']
})
export class DishComponent implements OnInit {

  public imageUpload: File = undefined;
  private image: string;
  public form: FormGroup;
  public progressUpload: number = 0;
  public id: string;

  public categories: FirebaseListObservable<any[]>;
  public destinations: FirebaseListObservable<any[]>;

  constructor(private afh: AngularFireHelper,
    private sbh: SnackBarHelper,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
    this.form = fb.group({
      'name': ['', Validators.required],
      'description': ['', Validators.required],
      'destination': ['', Validators.required],
      'category': ['', Validators.required],
      'price': ['', Validators.required],
      'image': ['']
    });

  }

  ngOnInit() {

    this.categories = this.afh.categoriesRef()
      .map(items => items.filter(item => { return !item.favorite })) as FirebaseListObservable<any[]>

    this.destinations = this.afh.destinationsRef();

    this.route.params.subscribe(params => {

      this.id = params["id"];

      if (this.id) {
        this.afh.dishRef(this.id).subscribe((dish) => {
          this.image = dish.image;
          this.form.setValue({
            name: dish.name,
            price: dish.price,
            description: dish.description,
            destination: dish.destination,
            category: dish.category,
            image: ""
          });
        });
      }
    });

  }

  private addDish(dish: Dish) {
    this.afh.addDish(dish).then(() => {
      this.form.enable();
      this.sbh.showInfo("Prato adicionado com sucesso.");
      this.form.reset();
      this.imageUpload = undefined;
      this.router.navigate(['/dishs']);
    });
  }

  private updateDish(dish: Dish) {
    this.afh.updateDish(dish).then(() => {
      this.form.enable();
      this.sbh.showInfo("Prato atualizado com sucesso.");
      this.form.reset();
      this.imageUpload = undefined;
      this.router.navigate(['/dishs']);
    });
  }

  submit() {
    let dish: Dish = this.form.value as Dish;

    this.form.disable();

    if (this.id) {
      dish.$key = this.id;
      if (this.imageUpload) {
        this.afh.uploadFile(this.imageUpload, "images/").subscribe(
          (value) => {
            if (typeof (value) === "string") {
              dish.image = value;
            } else {
              this.progressUpload = value;
            }
          },
          (error) => {
            this.form.enable();
            this.sbh.showInfo("Problema no upload da imagem do prato.");
          },
          () => {
            this.updateDish(dish);
          });
      } else {
        dish.image = this.image;
        this.updateDish(dish);
      }
    } else {
      this.afh.uploadFile(this.imageUpload, "images/").subscribe(
        (value) => {
          if (typeof (value) === "string") {
            dish.image = value;
          } else {
            this.progressUpload = value;
          }
        },
        (error) => {
          this.form.enable();
          this.sbh.showInfo("Problema no upload da imagem do prato.");
        },
        () => {
          this.addDish(dish);
        });
    }
  }

  uploadChangeListener($event): void {
    this.readThis($event.target);
  }

  private readThis(inputValue: any): void {
    this.imageUpload = inputValue.files[0];
  }

}
