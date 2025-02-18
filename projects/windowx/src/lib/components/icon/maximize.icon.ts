import { Component } from '@angular/core';

@Component({
  selector: 'maximize-icon',
  template: `
    <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg">
      <polygon
          class="apple-theme"
          points="5,0 0,0 0,5"
          fill="#444"
      />
      <polygon
          class="apple-theme"
          points="10,10 10,5 5,10"
          fill="#444"
      />
      <rect
          class="win-theme"
          x="0"
          y="0"
          width="10"
          height="10"
          stroke="#444"
          stroke-width="1"
          fill="none"
      />
      <rect
          class="win-theme"
          x="1"
          y="1"
          width="8"
          height="1"
          stroke="#444"
          stroke-width="1"
          fill="none"
      />
    </svg>
  `,
  styles: [],
  standalone: false
})
export class MaximizeIcon {
  constructor() {}
}
