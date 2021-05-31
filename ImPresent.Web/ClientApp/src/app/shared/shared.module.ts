import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InputDirective } from './directives/input/input.directive';
import { ButtonDirective } from './directives/button/button.directive';
import { LoadingDialogComponent } from './components/dialogs/loading/loading-dialog.component';
import { PageComponent } from './components/page/page.component';
import { ScrollbarDirective } from './directives/scrollbar/scrollbar.directive';
import { ListDirective } from './directives/list/list.directive';
import { StudentItemComponent } from './components/student-item/student-item.component';
import { MatIconModule } from '@angular/material/icon';
import { LogoComponent } from './components/logo/logo.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    InputDirective,
    ButtonDirective,
    LoadingDialogComponent,
    PageComponent,
    ScrollbarDirective,
    ListDirective,
    StudentItemComponent,
    LogoComponent,
  ],
  exports: [
    InputDirective,
    ButtonDirective,
    LoadingDialogComponent,
    PageComponent,
    ScrollbarDirective,
    ListDirective,
    StudentItemComponent,
    LogoComponent,
  ]
})
export class SharedModule { }
