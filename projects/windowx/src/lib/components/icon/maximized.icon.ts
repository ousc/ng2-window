import { Component } from '@angular/core';

@Component({
  selector: 'maximized-icon',
  template: `
    <svg width="100" height="100" viewBox="-2 -2 14 14" xmlns="http://www.w3.org/2000/svg">
      <polygon points="-2,4.6 4.6,4.6 4.6,-2" fill="#222222"></polygon>
      <polygon points="5.4,5.4 12,5.4 5.4,12" fill="#222222"></polygon>
    </svg>
  `,
  styles: [],
})
export class MaximizeDIcon {
  constructor() {}
}
