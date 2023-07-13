import {Component} from '@angular/core';
import {Ng2WindowComponent} from "../../ng2-window.component";
import {Ng2WindowService} from "../../ng2-window.service";

@Component({
  selector: 'dock',
  template: `
    <div [class]="'ng-window-dock' + themeSuffix">
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
  constructor(private windowService: Ng2WindowService) {
  }

  docks: Ng2WindowComponent[] = [];

  get themeSuffix() {
    return this.windowService.dockTheme === 'dark' ? '-dark' : '';
  }

  restore(win: Ng2WindowComponent) {
    this.docks = this.docks.filter(dock => dock !== win);
    win.minimize();
    this.windowService.selectedWindow = win.windowId;
    win.zIndex = this.windowService.maxZIndex++;
  }

  close(win: Ng2WindowComponent) {
    this.docks = this.docks.filter(dock => dock !== win);
    win.close();
  }
}
