import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgParticlesModule } from 'ng-particles';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { PromotionComponent } from './promotion.component';
import { CreatePromotionDialogComponent } from './dialogs/create-promotion-dialog/create-promotion-dialog.component';
import { AddStudentDialogComponent } from './dialogs/add-student-dialog/add-student-dialog.component';

@NgModule({
  declarations: [
    PromotionComponent,
    CreatePromotionDialogComponent,
    AddStudentDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgParticlesModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
})
export class PromotionModule { }
