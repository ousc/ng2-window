import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {CommonModule} from "@angular/common";
import {WindowxModule} from "../../projects/windowx/src/lib/windowx.module";
import {Example1Component} from "./components/example1.component";

@NgModule({
    declarations: [
        AppComponent,
        Example1Component
    ],
    imports: [
        BrowserModule,
        CommonModule,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
