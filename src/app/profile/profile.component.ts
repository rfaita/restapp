import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireHelper } from '../helpers/angularfirehelper';
import { SnackBarHelper } from '../helpers/snackbarhelper';
import { LoginHelper } from '../helpers/loginhelper';
import { User } from '../model/user';
import { AuthProviders } from 'angularfire2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private canEdit: boolean = false;
  public imageUpload: File = undefined;
  private image: string;
  public form: FormGroup;
  public progressUpload: number = 0;

  constructor(
    private lh: LoginHelper,
    private afh: AngularFireHelper,
    private sbh: SnackBarHelper,
    private fb: FormBuilder) {
    this.form = fb.group({
      'displayName': ['', Validators.required],
      'email': [{ value: '', disabled: true }, Validators.required],
      'image': ['']
    });

  }

  ngOnInit() {

    this.image = this.lh.user.photoURL;
    this.form.setValue({
      displayName: this.lh.user.displayName,
      email: this.lh.user.email,
      image: ""
    });

    this.canEdit = (this.lh.user.provider === AuthProviders.Password);
  }

  uploadChangeListener($event): void {
    this.readThis($event.target);
  }

  private readThis(inputValue: any): void {
    this.imageUpload = inputValue.files[0];
  }

  submit() {
    let user: User = this.form.value as User;

    this.lh.user.displayName = user.displayName;


    if (this.imageUpload) {
      this.afh.uploadFile(this.imageUpload, "avatars/").subscribe(
        (value) => {
          if (typeof (value) === "string") {
            this.lh.user.photoURL = value;
          } else {
            this.progressUpload = value;
          }
        },
        (error) => {
          this.form.enable();
          this.sbh.showInfo("Problema no upload da imagem do prato.");
        },
        () => {
          this.afh.updateUser().then(() => {
            this.imageUpload = undefined;

          });

        });
    } else {
      this.afh.updateUser().then(() => {
        this.imageUpload = undefined;

      });

    }
  }

}
