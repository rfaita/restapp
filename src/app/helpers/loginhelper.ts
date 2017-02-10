import { Injectable } from "@angular/core";
import { User } from '../model/user';
import { Subject } from 'rxjs';

@Injectable()
export class LoginHelper {

  public user: User;
  
  constructor() {
    
  }

}