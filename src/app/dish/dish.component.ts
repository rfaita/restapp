import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AngularFireHelper } from '../helpers/angularfirehelper';
import { FirebaseListObservable } from 'angularfire2';
import { Dish } from '../model/dish';
import { SnackBarHelper } from '../helpers/snackbarhelper';

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.css']
})
export class DishComponent implements OnInit {

  public imageUpload: File = undefined;
  public form: FormGroup;


  public categories: FirebaseListObservable<any[]>;
  public destinations: FirebaseListObservable<any[]>;

  constructor(private afh: AngularFireHelper,
    private sbh: SnackBarHelper,
    private fb: FormBuilder) {
    this.form = fb.group({
      'name': ['', Validators.required],
      'description': ['', Validators.required],
      'destination': ['', Validators.required],
      'category': ['', Validators.required],
      'price': ['', Validators.required],
      'image': ['', Validators.required]
    });

  }

  ngOnInit() {

    this.categories = this.afh.categoriesRef()
      .map(items => items.filter(item => { return !item.favorite })) as FirebaseListObservable<any[]>

    this.destinations = this.afh.destinationsRef();

  }

  submit() {

    var uploadRef = this.afh.uploadFile(this.imageUpload);
    uploadRef.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // See below for more detail
      },
      (error) => {
        // Handle unsuccessful uploads
        this.sbh.showInfo("Problema no upload da imagem do prato.");
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        let dish: Dish = this.form.value as Dish;
        dish.image = uploadRef.snapshot.downloadURL;

        this.afh.addMenu(dish).then(() => {
          this.sbh.showInfo("Prato adicionado com sucesso.");
          this.form.reset();
          this.imageUpload = undefined;
        });
      });;

  }

  uploadChangeListener($event): void {
    this.readThis($event.target);
  }

  private readThis(inputValue: any): void {
    this.imageUpload = inputValue.files[0];
  }

}
