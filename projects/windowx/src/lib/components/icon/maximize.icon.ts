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
          class="apple-theme color-path"
          points="5,0 0,0 0,5"
      />
      <polygon
          class="apple-theme color-path"
          points="10,10 10,5 5,10"
      />
      <rect
          class="win-theme color-rect"
          x="0"
          y="0"
          width="10"
          height="10"
          stroke="#444"
          stroke-width="1"
          fill="none"
      />
      <rect
          class="win-theme color-rect"
          x="1"
          y="1"
          width="8"
          height="1"
          stroke="#444"
          stroke-width="1"
      />
    </svg>
  `,
  styles: [],
  standalone: true
})
export class MaximizeIcon {
  constructor() {}
}
