import {Component} from '@angular/core';
import {Ng2WindowComponent} from "../../ng2-window.component";
import {Ng2WindowService} from "../../ng2-window.service";
@Component({
  selector: 'dock',
  template: `
      <div class="ng-window-dock">
          <div *ngFor="let dock of docks" class="ng-window-dock-item" (click)="restore(dock)">
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
  constructor(private ng2WindowService: Ng2WindowService) {
  }

  docks: Ng2WindowComponent[] = [];

  restore(win: Ng2WindowComponent) {
    this.docks = this.docks.filter(dock => dock !== win);
    win.minimize();
    this.ng2WindowService.selectedWindow = win.windowId;
    win.zIndex = this.ng2WindowService.maxZIndex++;
  }

  close(win: Ng2WindowComponent) {
    this.docks = this.docks.filter(dock => dock !== win);
    win.close();
  }
}
