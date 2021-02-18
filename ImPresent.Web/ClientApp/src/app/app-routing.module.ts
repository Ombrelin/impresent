import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { CreatePromotionComponent } from './pages/promotion/create-promotion/create-promotion.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'promotion/create', component: CreatePromotionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
