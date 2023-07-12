import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Ng2WindowComponent} from "../../../projects/windowx/src/lib/ng2-window.component";
import {Ng2WindowService} from "../../../projects/windowx/src/lib/ng2-window.service";

@Component({
  selector: 'sample1-component',
  template: `
    <div class="body">
      <button (click)="openWindow()">open window</button>
      <ng-template #tpl>
        this is window x
      </ng-template>
    </div>
  `,
  styles: [`
    .body {
      width: 100vw;
      height: 100vh;
      background: url('/assets/ng-windowx-large.png') 100%;
    }
  `],
})
export class Sample1Component implements OnInit {
  constructor(private _window: Ng2WindowService) {
  }

  @ViewChild('tpl', {static: true}) tpl: TemplateRef<any>;

  windowManager: any = {
    tpl: {}
  }
  count = 3;

  openWindow() {
    this._window.create({
      title: 'Window ' + this.count++,
      icon: '/assets/logo.png',
      width: 800,
      height: 500,
      content: this.tpl,
      offsetX: 200,
      offsetY: 100,
      align: 'leftTop',
      bodyStyle: {
        lineHeight: '1.5',
      },
    }).then((win: Ng2WindowComponent) => {
      this.windowManager.tpl.instance = win;

      win.onClose.subscribe(() => {
        this.windowManager.tpl.visible = false;
        this.windowManager.tpl.instance = null;
      });
    });
  }

  ngOnInit(): void {
    this._window.create({
      title: 'Window 1',
      icon: '/assets/logo.png',
      width: 800,
      height: 500,
      content: this.tpl,
      offsetX: 200,
      offsetY: 100,
      align: 'leftTop',
      bodyStyle: {
        lineHeight: '1.5',
      },
    }).then((win: Ng2WindowComponent) => {
      this.windowManager.tpl.instance = win;

      win.onClose.subscribe(() => {
        this.windowManager.tpl.visible = false;
        this.windowManager.tpl.instance = null;
      });
    });
    this._window.create({
      title: 'Window 2',
      icon: '/assets/logo.png',
      width: 300,
      height: 400,
      content: this.tpl,
      language: 'en',
      offsetX: 300,
      offsetY: 400,
      align: 'leftTop',
      bodyStyle: {
        lineHeight: '1.5',
      },
    }).then((win: Ng2WindowComponent) => {
      this.windowManager.tpl.instance = win;

      win.onClose.subscribe(() => {
        this.windowManager.tpl.visible = false;
        this.windowManager.tpl.instance = null;
      });
    });
  }
}
