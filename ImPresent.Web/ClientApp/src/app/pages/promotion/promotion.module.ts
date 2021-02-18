import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgParticlesModule } from 'ng-particles';

import { SharedModule } from 'src/app/shared/shared.module';
import { CreatePromotionComponent } from './create-promotion/create-promotion.component';
import { ViewPromotionComponent } from './view-promotion/view-promotion.component';

@NgModule({
  declarations: [
    CreatePromotionComponent,
    ViewPromotionComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgParticlesModule
  ],
  exports: [
    CreatePromotionComponent,
    ViewPromotionComponent,
  ]
})
export class PromotionModule { }
