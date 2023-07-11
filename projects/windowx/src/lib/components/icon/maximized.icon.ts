import { Component } from '@angular/core';

@Component({
  selector: 'maximized-icon',
  template: `
    <svg width="100"
         height="100"
         viewBox="-2 -2 14 14"
         xmlns="http://www.w3.org/2000/svg">
      <polygon
          class="apple-theme"
          points="-2,4.6 4.6,4.6 4.6,-2"
          fill="#444"
      ></polygon>
      <polygon
          class="apple-theme"
          points="5.4,5.4 12,5.4 5.4,12"
          fill="#444"
      ></polygon>
      <!-- Two rectangles, one is under the other, one in the top right corner, one in the bottom left corner, and the one in the bottom left corner -->
        <rect
            class="win-theme"
            x="2"
            y="-1"
            width="9"
            height="9"
            stroke="#444"
            stroke-width="1"
            fill="none"
        ></rect>
        <rect
            class="win-theme"
            x="-1"
            y="2"
            width="9"
            height="9"
            stroke="#444"
            stroke-width="1"
            fill="#FFFFFF"
        ></rect>
    </svg>
  `,
  styles: [],
})
export class MaximizeDIcon {
  constructor() {}
}
