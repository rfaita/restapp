import { Injectable } from "@angular/core";

@Injectable()
export class SnackBarHelper {

    public snackBarRef

    constructor() { }

    showInfo(message: string) {
        this.snackBarRef.nativeElement.MaterialSnackbar.showSnackbar({ message: message, duration: 2000 });
    }

}