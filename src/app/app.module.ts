import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {CommonModule} from "@angular/common";
import {Ng2WindowModule} from "../../projects/windowx/src/lib/ng2-window.module";
import {Sample1Component} from "./samples/sample1.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
    declarations: [
        AppComponent,
        Sample1Component
    ],
    imports: [
        BrowserModule,
        CommonModule,
        Ng2WindowModule,
        BrowserAnimationsModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
