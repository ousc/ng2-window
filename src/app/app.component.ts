import {Component} from '@angular/core';
import {If, In, Is, when} from "when-case"

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    constructor() {
        const a = -5;
        console.log(
            when(a)(
                Is(-5, 'a is -5'),
                If(a > 1, () => 'a > 1'),
                If(a > 0, () => 'a > 0'),
                In([-1, -2, -3], () => 'a in -1/-2/-3'),
                In(-4, () => 'a in -4'),
                () => {
                    console.log(123);
                    return 'a <= 0';
                }
            )
        )
    }
}
