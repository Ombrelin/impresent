import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InputDirective } from './directives/input/input.directive';
import { ButtonDirective } from './directives/button/button.directive';
import { LoadingDialogComponent } from './components/dialogs/loading/loading-dialog.component';
import { PageComponent } from './components/page/page.component';
import { ScrollbarDirective } from './directives/scrollbar/scrollbar.directive';
import { ListDirective } from './directives/list/list.directive';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    InputDirective,
    ButtonDirective,
    LoadingDialogComponent,
    PageComponent,
    ScrollbarDirective,
    ListDirective,
  ],
  exports: [
    InputDirective,
    ButtonDirective,
    LoadingDialogComponent,
    PageComponent,
    ScrollbarDirective,
    ListDirective,
  ]
})
export class SharedModule { }
