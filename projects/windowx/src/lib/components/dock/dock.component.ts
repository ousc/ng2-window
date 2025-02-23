import {Component} from '@angular/core';
import {Ng2WindowComponent} from "../../ng2-window.component";
import {Ng2WindowService} from "../../ng2-window.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {CommonModule} from "@angular/common";
import {CloseIcon} from "../icon/close.icon";
import {StringTemplateOutletDirective} from "../../directive/string-template-outlet.directive";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
  selector: 'dock',
  imports: [CommonModule, CloseIcon, StringTemplateOutletDirective],
  template: `
      <div [ngClass]="['ng-window-dock', 'ng-window-theme' + themeSuffix]">
          <ng-container *ngFor="let dock of docks">
              <div class="ng-window-dock-item"
                   [@dockAnimation]
                   (click)="restore(dock)"
                   [title]="dock.title">
                  <ng-container *stringTemplateOutlet="dock.icon">
                      <img class="icon" draggable="false" [src]="dock.icon" alt="icon"/>
                  </ng-container>
                  <ng-container *stringTemplateOutlet="dock.title">{{ dock.title }}</ng-container>
                  <close-icon (click)="close(dock)"/>
              </div>
          </ng-container>
      </div>
  `,
  animations: [
    trigger('dockAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translate3d(30px, 0, 0) scale(0.8)'  // 启用 3D 加速
        }),
        animate('500ms cubic-bezier(0.34, 1.56, 0.64, 1)',  // 弹性贝塞尔曲线
            style({
              opacity: 1,
              transform: 'translate3d(0, 0, 0) scale(1)'
            })
        )
      ]),
      transition(':leave', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
            style({
              opacity: 0,
              transform: 'scale(0.8) translateX(20px)'
            })
        )
      ])
    ])
  ]
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
    this.windowService.selectedWindow.set(win.windowId);
    win.zIndex = this.windowService.maxZIndex++;
  }

  close(win: Ng2WindowComponent) {
    this.docks = this.docks.filter(dock => dock !== win);
    win.close();
  }
}
