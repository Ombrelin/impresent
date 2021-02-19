import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputDirective } from './directives/input-directive/input.directive';
import { ButtonDirective } from './directives/button-directive/button.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    InputDirective,
    ButtonDirective,
  ],
  exports: [
    InputDirective,
    ButtonDirective,
  ]
})
export class SharedModule { }
