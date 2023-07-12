import {NgModule} from '@angular/core';
import {Ng2WindowComponent} from './ng2-window.component';
import {CloseIcon} from "./components/icon/close.icon";
import {MaximizeIcon} from "./components/icon/maximize.icon";
import {MinimizeIcon} from "./components/icon/minimize.icon";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {NzOutletModule} from "./directive/outlet.module";
import {LoadingIcon} from "./components/icon/loading.icon";
import {MaximizeDIcon} from "./components/icon/maximized.icon";
import {DockComponent} from "./components/dock/dock.component";


@NgModule({
    declarations: [
        Ng2WindowComponent,
        CloseIcon,
        MaximizeIcon,
        MinimizeIcon,
        LoadingIcon,
        MaximizeDIcon,
        DockComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        NzOutletModule,
        NgOptimizedImage
    ],
    exports: [
        Ng2WindowComponent,
        CloseIcon,
        MaximizeIcon,
        MinimizeIcon,
        LoadingIcon,
        MaximizeDIcon,
        DockComponent
    ]
})
export class Ng2WindowModule {
}
