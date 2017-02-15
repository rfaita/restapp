import { Injectable } from "@angular/core";
import { MdlSnackbarService, MdlSnackbarComponent } from "angular2-mdl";
import { Observable } from "rxjs";

@Injectable()
export class SnackBarHelper {

    constructor(private mdlSnackbarService: MdlSnackbarService) { }

    showInfo(m: string, t?: string, h?: () => void, hideAction?: () => void) {
        let timeOut;
        let _h = () => {
            clearTimeout(timeOut);
            h();
        };
        this.mdlSnackbarService.showSnackbar({
            message: m,
            action: {
                handler: _h,
                text: t
            }
        }).subscribe((mdlSnackbarComponent: MdlSnackbarComponent) => {
            timeOut = setTimeout(() => {
                mdlSnackbarComponent.hide();
                if (hideAction) {
                    hideAction();
                }
            }, 2750)
        });
    }

}