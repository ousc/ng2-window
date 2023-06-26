import {NgModule} from '@angular/core';
import {WindowxComponent} from './windowx.component';
import {CloseIcon} from "./components/icon-button/close.icon";
import {MaximizeIcon} from "./components/icon-button/maximize.icon";
import {MinimizeIcon} from "./components/icon-button/minimize.icon";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {NzOutletModule} from "./directive/outlet.module";


@NgModule({
    declarations: [
        WindowxComponent,
        CloseIcon,
        MaximizeIcon,
        MinimizeIcon
    ],
    imports: [
        BrowserModule,
        CommonModule,
        NzOutletModule,
        NgOptimizedImage],
    exports: [
        WindowxComponent,
        CloseIcon,
        MaximizeIcon,
        MinimizeIcon
    ]
})
export class WindowxModule {
}
