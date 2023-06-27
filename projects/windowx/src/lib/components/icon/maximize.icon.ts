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
          points="5,0 0,0 0,5"
          fill="#222222"
      />
      <polygon
          points="10,10 10,5 5,10"
          fill="#222222"
      />
    </svg>
  `,
  styles: [],
})
export class MaximizeIcon {
  constructor() {}
}
