import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {WindowxComponent} from "../../../projects/windowx/src/lib/windowx.component";
import {WindowxService} from "../../../projects/windowx/src/lib/windowx.service";

@Component({
  selector: 'sample1-component',
  template: `
    <div class="body">
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
  constructor(private windowxService: WindowxService) {}

  @ViewChild('tpl', {static: true}) tpl: TemplateRef<any>;

  windowManager: any = {
    tpl: {}
  }

  ngOnInit(): void {
    this.windowxService.create({
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
    }).then((win: WindowxComponent) => {
      this.windowManager.tpl.instance = win;

      win.onClose.subscribe(() => {
        this.windowManager.tpl.visible = false;
        this.windowManager.tpl.instance = null;
      });
    });
    this.windowxService.create({
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
    }).then((win: WindowxComponent) => {
      this.windowManager.tpl.instance = win;

      win.onClose.subscribe(() => {
        this.windowManager.tpl.visible = false;
        this.windowManager.tpl.instance = null;
      });
    });
  }
}
