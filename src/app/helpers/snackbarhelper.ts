import { Injectable } from "@angular/core";

@Injectable()
export class SnackBarHelper {

    public snackBarRef

    constructor() { }

    showInfo(message: string) {
        this.snackBarRef.nativeElement.MaterialSnackbar.showSnackbar({ message: message, timeout: 3000 });
    }
    showInfoWithAction(message: string, text: string, handler: Function) {
        this.snackBarRef.nativeElement.MaterialSnackbar.showSnackbar({ message: message, timeout: 3000, actionHandler: handler, actionText: text });
    }

}