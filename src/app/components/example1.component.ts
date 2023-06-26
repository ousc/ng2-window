import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {WindowxComponent} from "../../../projects/windowx/src/lib/windowx.component";
import {WindowxService} from "../../../projects/windowx/src/lib/windowx.service";

@Component({
  selector: 'example1-component',
  template: `
    <ng-template #tpl>
      You are arrived!
    </ng-template>
  `,
  styles: [],
})
export class Example1Component implements OnInit {
  constructor(private windowxService: WindowxService) {}

  @ViewChild('tpl', {static: true}) tpl: TemplateRef<any>;

  windowManager: any = {
    tpl: {}
  }

  ngOnInit(): void {
    this.windowxService.create({
      title: '产品报表',
      icon: 'https://cdn.leinbo.com/assets/app.png',
      width: 800,
      height: 500,
      content: this.tpl,
      offsetX: 100,
      offsetY: 100,
      align: 'leftTop',
      bodyStyle: {
        background: '#FFF',
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
