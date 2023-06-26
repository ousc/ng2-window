/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {StringTemplateOutletDirective} from './string-template-outlet.directive';

@NgModule({
    imports: [CommonModule],
    exports: [StringTemplateOutletDirective],
    declarations: [StringTemplateOutletDirective]
})
export class NzOutletModule {
}