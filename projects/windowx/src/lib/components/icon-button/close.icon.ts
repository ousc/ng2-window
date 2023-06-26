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
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M0 0h10v1H0V0zm0 4h1V1h3V0H0v4zm0 5h4V5H1v4H0v1zm5 0h4V5H5v4H4v1zm5 0h1V5h-3v4h3v1z"
            />
        </svg>
    `,
    styles: [],
})
export class CloseIcon {
    constructor() {
    }

    theme: any = null;
}
