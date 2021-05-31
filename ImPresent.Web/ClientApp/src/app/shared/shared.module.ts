import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

import { InputDirective } from './directives/input/input.directive';
import { ButtonDirective } from './directives/button/button.directive';
import { LoadingDialogComponent } from './components/dialogs/loading/loading-dialog.component';
import { PageComponent } from './components/page/page.component';
import { ScrollbarDirective } from './directives/scrollbar/scrollbar.directive';
import { ListDirective } from './directives/list/list.directive';
import { StudentItemComponent } from './components/student-item/student-item.component';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from './components/dialogs/confirm/confirm-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  declarations: [
    InputDirective,
    ButtonDirective,
    LoadingDialogComponent,
    PageComponent,
    ScrollbarDirective,
    ListDirective,
    StudentItemComponent,
    ConfirmDialogComponent,
  ],
  exports: [
    InputDirective,
    ButtonDirective,
    LoadingDialogComponent,
    PageComponent,
    ScrollbarDirective,
    ListDirective,
    StudentItemComponent,
  ]
})
export class SharedModule { }
