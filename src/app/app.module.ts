import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {CommonModule} from "@angular/common";
import {WindowxModule} from "../../projects/windowx/src/lib/windowx.module";
import {Sample1Component} from "./samples/sample1.component";

@NgModule({
    declarations: [
        AppComponent,
        Sample1Component
    ],
    imports: [
        BrowserModule,
        CommonModule,
        WindowxModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
