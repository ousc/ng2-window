import {Component, TemplateRef} from '@angular/core';
import {WindowxComponent} from "../../windowx.component";
@Component({
  selector: 'dock',
  template: `
      <div class="ng-windowx-dock">
          <div *ngFor="let dock of docks" class="ng-windowx-dock-item" (click)="restore(dock)">
              <ng-container *stringTemplateOutlet="dock.icon">
                  <img class="icon" draggable="false" [src]="dock.icon" alt="icon"/>
              </ng-container>
              <ng-container *stringTemplateOutlet="dock.title">{{ dock.title }}</ng-container>
              <close-icon (click)="close(dock)"/>
          </div>
      </div>
  `
})
export class DockComponent {
  constructor() {
  }

  docks: WindowxComponent[] = [];

  restore(win: WindowxComponent) {
    this.docks = this.docks.filter(dock => dock !== win);
    win.minimize();
  }

  close(win: WindowxComponent) {
    this.docks = this.docks.filter(dock => dock !== win);
    win.close();
  }
}
