import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InputDirective } from './directives/input-directive/input.directive';
import { ButtonDirective } from './directives/button-directive/button.directive';
import { LoadingDialogComponent } from './components/dialogs/loading-dialog/loading-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    InputDirective,
    ButtonDirective,
    LoadingDialogComponent
  ],
  exports: [
    InputDirective,
    ButtonDirective,
  ]
})
export class SharedModule { }
