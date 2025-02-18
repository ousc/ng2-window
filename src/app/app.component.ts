import {Component} from '@angular/core';
import {Ng2WindowService} from "../../projects/windowx/src/lib/ng2-window.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
    standalone: false
})
export class AppComponent {
    constructor(private _window: Ng2WindowService) {
        this._window.language = 'en';
    }
}
