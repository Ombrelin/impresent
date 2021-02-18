import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgParticlesModule } from 'ng-particles';

import { SharedModule } from 'src/app/shared/shared.module';
import { CreatePromotionComponent } from './create-promotion/create-promotion.component';
import { ViewPromotionComponent } from './view-promotion/view-promotion.component';
import { AddStudentComponent } from './add-student/add-student.component';

@NgModule({
  declarations: [
    CreatePromotionComponent,
    ViewPromotionComponent,
    AddStudentComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgParticlesModule
  ],
  exports: [
    CreatePromotionComponent,
    ViewPromotionComponent,
    AddStudentComponent
  ]
})
export class PromotionModule { }
