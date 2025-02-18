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
  standalone: false
})
export class Sample1Component implements OnInit {
  constructor(private _window: Ng2WindowService) {
  }

  @ViewChild('tpl', {static: true}) tpl: TemplateRef<any>;

  windows: {
    [key: string]: {
      window: Ng2WindowComponent,
      visible: boolean,
    };
  } = {}
  count = 3;

  openWindow() {
    this._window.dockTheme = 'dark';
    this._window.create({
      title: 'Window ' + this.count++,
      icon: '/assets/logo.png',
      width: 800,
      height: 500,
      content: this.tpl,
      offsetX: 200,
      offsetY: 100,
      align: 'leftTop',
      theme: 'dark',
      outOfBounds: true,
      bodyStyle: {
        lineHeight: '1.5',
      },
    }).then((window: Ng2WindowComponent) => {
      console.log(window)
      const key = window.windowId;
      this.windows[key] = {
        window,
        visible: true,
      };

      window.onClose.subscribe(() => {
        this.windows[key].visible = false;
        this.windows[key].window = null
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
      outOfBounds: false,
      bodyStyle: {
        lineHeight: '1.5',
      },
    }).then((windows: Ng2WindowComponent) => {
        this.windows[windows.windowId] = {
            window: windows,
            visible: true,
        };

        windows.onClose.subscribe(() => {
            this.windows[windows.windowId].visible = false;
            this.windows[windows.windowId].window = null
        });
    });
    this._window.create({
      title: 'Window 2',
      icon: '/assets/logo.png',
      width: 300,
      height: 400,
      content: this.tpl,
      offsetX: 300,
      offsetY: 400,
      align: 'leftTop',
      outOfBounds: true,
      bodyStyle: {
        lineHeight: '1.5',
      },
    }).then((win: Ng2WindowComponent) => {
        this.windows[win.windowId] = {
            window: win,
            visible: true,
        };

        win.onClose.subscribe(() => {
            this.windows[win.windowId].visible = false;
            this.windows[win.windowId].window = null
        });
    });
  }
}
