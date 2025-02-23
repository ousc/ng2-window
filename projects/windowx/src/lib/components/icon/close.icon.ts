import {Component} from '@angular/core';

@Component({
    selector: 'close-icon',
    template: `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
        >
            <path
                class="color-path"
                fill-rule="evenodd"
                d="M5.707 5l3.647-3.646a.5.5 0 0 0-.708-.708L5 4.293 1.354.646a.5.5 0 0 0-.708.708L4.293 5 .646 8.646a.5.5 0 0 0 .708.708L5 5.707l3.646 3.647a.5.5 0 0 0 .708-.708L5.707 5z"
            />
        </svg>
    `,
    styles: [],
    standalone: true
})
export class CloseIcon {
    constructor() {
    }
}
