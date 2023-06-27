import {Component} from '@angular/core';

@Component({
  selector: 'minimize-icon',
  template: `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        viewBox="0 0 10 10"
    >
      <path
          fill="#000"
          fill-rule="evenodd"
          d="M0 5h10v1H0z"
      />
    </svg>
  `,
  styles: [],
})
export class MinimizeIcon {
  constructor() {}
}
