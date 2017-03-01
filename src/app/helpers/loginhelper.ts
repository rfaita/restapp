import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoginHelper {

  public user: User;

  constructor() { }

}
