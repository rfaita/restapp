import { Injectable } from '@angular/core';

@Injectable()
export class ClearHelper {

    constructor() { }

    public clear(o: any): string {
        const key: string = o['$key'];
        delete o['$key'];
        delete o['$exists'];
        return key;
    }

}
