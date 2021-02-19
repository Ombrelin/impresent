import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgParticlesModule } from 'ng-particles';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedModule } from 'src/app/shared/shared.module';
import { PromotionComponent } from './promotion.component';
import { CreatePromotionDialogComponent } from '../home/dialogs/create-promotion-dialog/create-promotion-dialog.component';
import { AddStudentDialogComponent } from './dialogs/add-student-dialog/add-student-dialog.component';

@NgModule({
  declarations: [
    PromotionComponent,
    CreatePromotionDialogComponent,
    AddStudentDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgParticlesModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
})
export class PromotionModule { }
