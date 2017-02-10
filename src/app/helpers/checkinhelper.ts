import { Injectable } from '@angular/core';
import { CheckIn } from '../model/checkin';
import { Subscription } from 'rxjs';

@Injectable()
export class CheckInHelper {

    public checkIn: CheckIn;
    public subscription: Subscription;

    constructor() { }

}